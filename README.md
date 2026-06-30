# 🛡️ GuptChat

> **Speak freely. Leave nothing behind.**

GuptChat is a privacy-focused real-time chat application built with the MERN stack and Socket.IO. Conversations exist only while participants remain connected to the room and disappear when they leave, disconnect, or refresh the page.

No accounts. No message history. No databases storing your conversations.

---

## 🌐 Live Demo

* **Frontend:** https://guptchat.vercel.app
* **Backend:** https://guptchat.onrender.com

---

## ✨ Features

* 🔒 End-to-End Encryption (E2EE)
* ⚡ Real-time communication using Socket.IO
* 🗝️ Join rooms using a shared passcode
* 👤 No registration or login required
* 🗑️ Zero message persistence
* 🌙 Modern dark theme UI
* 📱 Responsive design for desktop and mobile
* 👥 Multiple users can join the same room
* ✍️ Typing indicators
* 🔗 One-click room sharing
* 🔄 Automatic room cleanup when users disconnect
* 📄 FAQ, Contact, and Privacy Policy pages

---

## 💡 Why GuptChat?

Most messaging platforms permanently store your messages on servers.

GuptChat follows a different philosophy:

* No accounts
* No databases
* No message history
* No tracking
* No advertisements

> **If a conversation isn't stored, it can't be leaked.**

---

## 🏗️ Tech Stack

### Frontend

* React
* Vite
* Socket.IO Client
* React Hooks
* CSS3

### Backend

* Node.js
* Express.js
* Socket.IO
* CORS
* Express Rate Limit

### Security

* Web Crypto API
* AES Encryption
* Passcode-based key derivation
* No server-side message storage

---

## 📂 Project Structure

```text
GuptChat/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── cryptoUtils.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## 🚀 Installation

### Clone the Repository

```bash
git clone https://github.com/siddhartha0812/guptchat.git
cd guptchat
```

---

### Backend Setup

```bash
cd server
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

### Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🔐 How Encryption Works

1. Users join a room using the same passcode.
2. The passcode is converted into an encryption key locally in the browser.
3. Messages are encrypted before leaving the sender's device.
4. The server only relays encrypted data.
5. Only participants with the correct passcode can decrypt messages.

The server never sees plaintext messages.

---

## 🛡️ Privacy Philosophy

GuptChat follows a simple principle:

> **If it isn't stored, it can't be leaked.**

Therefore:

* No message database exists.
* No chat history is stored.
* No accounts are required.
* No conversation logs are retained.
* Refreshing or closing the page permanently removes the session.

---

## 🌐 Deployment

### Frontend

* Vercel

### Backend

* Render

Environment Variable:

```env
VITE_SERVER_URL=https://guptchat.onrender.com
```

---

## 📜 FAQ

### Are messages stored?

No. Messages are never stored on the server.

### Can chats be recovered?

No. Once participants disconnect, the conversation is permanently lost.

### Is registration required?

No. Anyone with the room passcode can join.

### Is GuptChat free?

Yes.

---

## 🚧 Roadmap

* [ ] Voice Calls
* [ ] Video Calls
* [ ] File Sharing
* [ ] Self-destruct Timers
* [ ] QR Code Room Sharing
* [ ] Progressive Web App (PWA)
* [ ] Message Reactions
* [ ] Custom Themes

---

## 🤝 Contributing

Contributions, suggestions, and security improvements are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your branch
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by **Siddhartha**

Building privacy-first communication tools for the modern web.

GitHub: https://github.com/siddhartha0812

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

It helps the project grow and motivates future development.

---

### 🛡️ GuptChat

**Private by design. Forgotten by default.**
