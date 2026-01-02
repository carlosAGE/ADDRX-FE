export default function Nav() {
  const linkStyle: React.CSSProperties = {
    padding: "10px 14px",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 10,
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <a href="/" style={linkStyle}>
        Home
      </a>
      <a href="/about" style={linkStyle}>
        About
      </a>
      <a href="/contact" style={linkStyle}>
        Contact
      </a>
      <a href="/archive" style={linkStyle}>
        Archive
      </a>
    </nav>
  );
}
