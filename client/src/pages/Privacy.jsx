export default function Privacy({ onClose }) {
  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(8px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },

    modal: {
      width: "90%",
      maxWidth: "750px",
      maxHeight: "85vh",
      overflowY: "auto",
      background: "#111827",
      border: "1px solid rgba(34,197,94,0.25)",
      borderRadius: "24px",
      padding: "35px",
      color: "#f8fafc",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    },

    title: {
      color: "#22c55e",
      textAlign: "center",
      marginBottom: "25px",
      fontSize: "2rem",
    },

    heading: {
      color: "#4ade80",
      marginTop: "22px",
      marginBottom: "8px",
      fontSize: "1.1rem",
    },

    text: {
      color: "#cbd5e1",
      lineHeight: "1.8",
      fontSize: "15px",
    },

    button: {
      marginTop: "30px",
      width: "100%",
      padding: "14px",
      border: "none",
      borderRadius: "14px",
      background: "#22c55e",
      color: "#08120a",
      fontWeight: "bold",
      fontSize: "15px",
      cursor: "pointer",
    },

    highlight: {
      color: "#22c55e",
      fontWeight: "bold",
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Privacy Policy</h2>

        <p style={styles.text}>
          At <span style={styles.highlight}>GuptChat</span>, privacy is not a feature —
          it is the foundation of the platform.
        </p>

        <h3 style={styles.heading}>🔒 No Message Storage</h3>
        <p style={styles.text}>
          Messages are never stored in databases, logs, or backups.
          Once participants leave the room, conversations disappear permanently.
        </p>

        <h3 style={styles.heading}>🛡️ End-to-End Encryption</h3>
        <p style={styles.text}>
          Messages are encrypted on your device before being sent and can only
          be decrypted by participants who know the room passcode.
        </p>

        <h3 style={styles.heading}>👤 No Accounts Required</h3>
        <p style={styles.text}>
          GuptChat does not require registration, email addresses,
          phone numbers, or personal information.
        </p>

        <h3 style={styles.heading}>📊 No Tracking</h3>
        <p style={styles.text}>
          We do not track your conversations, profile your activity,
          or sell your data to advertisers.
        </p>

        <h3 style={styles.heading}>🌐 Temporary Sessions</h3>
        <p style={styles.text}>
          Refreshing or closing the website immediately ends your session
          and removes all local chat history.
        </p>

        <h3 style={styles.heading}>⚖️ Policy Updates</h3>
        <p style={styles.text}>
          If our privacy practices change in the future, updates will be
          reflected in this policy.
        </p>

        <button
          style={styles.button}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}