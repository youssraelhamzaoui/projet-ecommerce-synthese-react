export default function Loading({ text = 'Chargement…' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: 14 }}>
      <div className="spinner-lux" />
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{text}</p>
    </div>
  );
}
