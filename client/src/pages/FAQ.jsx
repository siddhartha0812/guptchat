export default function FAQ({ onClose }) {
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
      maxHeight: "80vh",
      overflowY: "auto",
      background: "#111827",
      border: "1px solid rgba(34,197,94,0.25)",
      borderRadius: "24px",
      padding: "35px",
      color: "#f8fafc",
    },
    title: {
      color: "#22c55e",
      textAlign: "center",
      marginBottom: "25px",
    },
    heading: {
      color: "#4ade80",
      marginTop: "20px",
    },
    text: {
      color: "#cbd5e1",
      lineHeight: "1.8",
    },
    button: {
      marginTop: "25px",
      width: "100%",
      padding: "12px",
      border: "none",
      borderRadius: "12px",
      background: "#22c55e",
      color: "#08120a",
      fontWeight: "bold",
      cursor: "pointer",
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Frequently Asked Questions</h2>

        <h3 style={styles.heading}>Are messages stored?</h3>
        <p style={styles.text}>
          No. Messages are never stored on our servers.
        </p>

        <h3 style={styles.heading}>Are chats encrypted?</h3>
        <p style={styles.text}>
          Yes. Messages are encrypted end-to-end.
        </p>

        <h3 style={styles.heading}>Do I need an account?</h3>
        <p style={styles.text}>
          No signup or email is required.
        </p>

        <button style={styles.button} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}