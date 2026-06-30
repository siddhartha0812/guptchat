export default function Contact({ onClose }) {
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
      maxWidth: "700px",
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

    sectionTitle: {
      color: "#4ade80",
      marginTop: "20px",
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
        <h2 style={styles.title}>Contact Us</h2>

        <h3 style={styles.sectionTitle}>📧 Email Support</h3>
        <p style={styles.text}>
          For general questions, feedback, or assistance:
          <br />
          <span style={styles.highlight}>
            guptchat.org@gmail.com
          </span>
        </p>

        <h3 style={styles.sectionTitle}>🐛 Report a Bug</h3>
        <p style={styles.text}>
          Found a bug or unexpected behavior?
          Please report it so we can improve GuptChat.
        </p>

        <h3 style={styles.sectionTitle}>💡 Suggestions & Ideas</h3>
        <p style={styles.text}>
          We welcome ideas for new features, UI improvements,
          and privacy enhancements.
        </p>

        <h3 style={styles.sectionTitle}>🔒 Security Issues</h3>
        <p style={styles.text}>
          If you discover a security vulnerability, please contact us privately
          so we can resolve it quickly and responsibly.
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