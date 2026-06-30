import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { deriveKey, encryptText, decryptText, randomPasscode } from './cryptoUtils.js';
import { Routes, Route, Link } from "react-router-dom";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function initials(name) {
  return (name || '?').trim().slice(0, 1).toUpperCase();
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [screen, setScreen] = useState('home'); // 'home' | 'chat'
  const [nickname, setNickname] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [connecting, setConnecting] = useState(false);

  const [roomCode, setRoomCode] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [typingName, setTypingName] = useState('');
  const [toast, setToast] = useState('');

  const socketRef = useRef(null);
  const cryptoKeyRef = useRef(null);
  const nicknameRef = useRef('');
  const screenRef = useRef('home');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const shouldAutoScrollRef = useRef(true);

 useEffect(() => {
  const container = document.querySelector(".messages");

  if (!container) return;

  const distanceFromBottom =
    container.scrollHeight -
    container.scrollTop -
    container.clientHeight;

  // Only auto-scroll if user is already near bottom
    if (distanceFromBottom < 50) {
     container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);


  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // Clean up on unmount / tab close — leave the room so the server can free it.
  useEffect(() => {
    const handleUnload = () => {
      socketRef.current?.emit('leave');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);
  
  {showFAQ && (
  <div className="modal">
    <div className="modal-content">
      <button
         className="close-btn"
        onClick={() => setShowFAQ(false)}
        >
        Close
      </button>  
    </div>
  </div>
  )}

  {showContact && (
  <div className="modal">
    <div className="modal-content">
      <button
        className="close-btn"
        onClick={() => setShowContact(false)}
      >
        Close
      </button>
    </div>
  </div>
  )}

  {showPrivacy && (
  <div className="modal">
    <div className="modal-content">
      <h2>Privacy Policy</h2>
      <button
        className="close-btn"
        onClick={() => setShowPrivacy(false)}
      >
        Close
      </button>
    </div>
  </div>
  )}

  const handleJoin = useCallback(async () => {
    setErrorMsg('');
    const nick = nickname.trim();
    const code = passcode.trim();
    if (!nick) { setErrorMsg('Please enter a nickname.'); return; }
    if (!code) { setErrorMsg('Please enter a passcode.'); return; }

    setConnecting(true);
    try {
      const key = await deriveKey(code, code);
      cryptoKeyRef.current = key;
      nicknameRef.current = nick;

      const socket = io(SERVER_URL, { transports: ['websocket', 'polling'] });
      socketRef.current = socket;

      const joinTimeout = setTimeout(() => {
        setConnecting(false);
        setErrorMsg('Could not connect. Is the server running on ' + SERVER_URL + '?');
        socket.disconnect();
      }, 7000);

      socket.on('connect', () => {
        socket.emit('join', { nickname: nick, roomCode: code.toUpperCase() });
      });

      socket.on('joined', (data) => {
        clearTimeout(joinTimeout);
        setConnecting(false);
        setRoomCode(data.roomCode);
        setOnlineCount(data.onlineCount);
        setScreen('chat');
      });

      socket.on('system', (data) => {
        setMessages((prev) => [
          ...prev,
          { kind: 'system', text: `${data.nickname} ${data.event === 'join' ? 'joined the room' : 'left the room'}.` },
        ]);
        setOnlineCount(data.onlineCount);
      });

      socket.on('presence', (data) => {
        setOnlineCount(data.onlineCount);
      });

      socket.on('message', async (data) => {
        try {
          const plaintext = await decryptText(cryptoKeyRef.current, data.payload);
          setMessages((prev) => [
            ...prev,
            { kind: 'msg', mine: false, nickname: data.nickname, text: plaintext, ts: data.ts },
          ]);
        } catch (e) {
          setMessages((prev) => [
            ...prev,
            { kind: 'msg', mine: false, nickname: data.nickname, text: '[Could not decrypt]', ts: data.ts },
          ]);
        }
        setTypingName('');
      });

      socket.on('typing', (data) => {
        setTypingName(data.isTyping ? data.nickname : '');
      });

      socket.on('error_message', (data) => setToast(data.message));

      socket.on('connect_error', () => {
        clearTimeout(joinTimeout);
        setConnecting(false);
        setErrorMsg('Could not connect. Is the server running on ' + SERVER_URL + '?');
      });

      socket.on('disconnect', () => {
        if (screenRef.current === 'chat') {
          setMessages((prev) => [...prev, { kind: 'system', text: 'Connection lost. Refresh to reconnect — nothing is saved.' }]);
        }
      });
    } catch (err) {
      console.error(err);
      setConnecting(false);
      setErrorMsg('Something went wrong while connecting.');
    }
  }, [nickname, passcode]);

  const handleLeave = useCallback(() => {
    socketRef.current?.emit('leave');
    socketRef.current?.disconnect();
    socketRef.current = null;
    cryptoKeyRef.current = null;
    setScreen('home');
    setMessages([]);
    setOnlineCount(0);
    setRoomCode('');
    setPasscode('');
    setErrorMsg('');
  }, []);

  const sendTyping = useCallback((isTyping) => {
    socketRef.current?.emit('typing', { isTyping });
  }, []);

  const [draft, setDraft] = useState('');

  const handleSend = useCallback(async () => {
    const text = draft.trim();
    if (!text || !socketRef.current || !cryptoKeyRef.current) return;
    try {
      const payload = await encryptText(cryptoKeyRef.current, text);
      socketRef.current.emit('message', { payload });
      setMessages((prev) => [...prev, { kind: 'msg', mine: true, nickname: nicknameRef.current, text, ts: Date.now() }]);
      setDraft('');
      sendTyping(false);
    } catch (e) {
      setToast('Failed to send message.');
    }
  }, [draft, sendTyping]);

  const handleDraftChange = (e) => {
    setDraft(e.target.value);
    sendTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping(false), 1500);
  };

  const copyRoomCode = () => {
    navigator.clipboard?.writeText(roomCode).then(() => setToast('Passcode copied!'));
  };

  return (
    <>
      <button className="theme-toggle" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>

      <div id="app">
        {screen === 'home' ? (
          <div className="card">
            <div className="logo-wrap">
              <Logo />
              <div className="logo-text">Gupt<span className="accent">Chat</span></div>
            </div>
            <div className="tagline">Speak freely. Leave nothing behind.</div>

            <div className="field">
              <label htmlFor="nickname">Nickname</label>
              <input
                id="nickname"
                type="text"
                placeholder="Enter your nickname"
                maxLength={24}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                autoComplete="off"
              />
            </div>

            <div className="field">
              <label htmlFor="roomcode">Room Passcode</label>
              <div className="row-gap">
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    id="roomcode"
                    type="text"
                    placeholder="Enter code"
                    maxLength={32}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                    autoComplete="off"
                  />
                </div>
                <button className="ghost-btn" type="button" onClick={() => setPasscode(randomPasscode())}>
                  Generate
                </button>
              </div>
            </div>

            <button className="btn-primary" onClick={handleJoin} disabled={connecting}>
              {connecting ? 'Connecting…' : 'Join Chat'}
            </button>
            <div className="err">{errorMsg}</div>

            <div className="privacy-note">
              <span>🛡️</span>
              <div>
                <strong>Your privacy is our priority</strong>
                End-to-end encrypted in your browser. No accounts, no message storage — everything disappears when you leave.
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-wrap">
            <div className="chat-card">
              <div className="chat-header">
                <div className="chat-header-left">
                  <button className="icon-btn" onClick={handleLeave} title="Leave room">←</button>
                  <div className="room-title">
                    <div className="code-row">Room: {roomCode} 🛡️</div>
                    <div className="sub"><span className="dot" /> {onlineCount} online</div>
                  </div>
                </div>
                <button className="icon-btn" onClick={copyRoomCode} title="Copy room passcode">📤</button>
              </div>

              <div className="messages">
                {messages.map((m, i) =>
                  m.kind === 'system' ? (
                    <div className="system-msg" key={i}> {m.text}</div>
                  ) : (
                    <div className={`msg-row ${m.mine ? 'mine' : ''}`} key={i}>
                      <div className="avatar">{initials(m.nickname)}</div>
                      <div className="bubble-wrap">
                        <div className="sender-name">{m.nickname}</div>
                        <div className="bubble">{m.text}</div>
                        <div className="msg-time">
                          {m.ts ? new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  )
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="typing-indicator">{typingName ? `${typingName} is typing…` : ''}</div>

              <div className="composer">
                <input
                  type="text"
                  placeholder="Type a message…"
                  maxLength={2000}
                  value={draft}
                  onChange={handleDraftChange}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  autoComplete="off"
                  autoFocus
                />
                <button className="send-btn" onClick={handleSend} title="Send">➤</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && <div className="toast">{toast}</div>}

      {showFAQ && <FAQ onClose={() => setShowFAQ(false)} />}

      {showContact && <Contact onClose={() => setShowContact(false)} />}

      {showPrivacy && <Privacy onClose={() => setShowPrivacy(false)} />}
  
      <footer className="footer">
        <div className="footer-links">
          <button onClick={() => setShowFAQ(true)}>FAQ</button>
          <button onClick={() => setShowContact(true)}>Contact Us</button>
          <button onClick={() => setShowPrivacy(true)}>Privacy Policy</button>
        </div>

        <p className="copyright">
          © 2026 GuptChat. All Rights Reserved.
        </p>
      </footer>

    </>
  );
}

function Logo() {
  return (
    <svg className="logo-icon" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 A35 35 0 1 0 76 90 L76 78" stroke="#22c55e" strokeWidth="6" fill="none" strokeLinecap="round" transform="translate(0,2)" />
      <circle cx="40" cy="55" r="4" fill="#22c55e" />
      <circle cx="52" cy="55" r="4" fill="#22c55e" />
      <circle cx="64" cy="55" r="4" fill="#22c55e" />
      <g transform="translate(58,8)">
        <rect x="0" y="14" width="26" height="20" rx="5" fill="#22c55e" />
        <path d="M5 14 V8 a8 8 0 0 1 16 0 v6" stroke="#22c55e" strokeWidth="5" fill="none" />
        <circle cx="13" cy="23" r="3" fill="#0b1220" />
      </g>
    </svg>
  );
}

