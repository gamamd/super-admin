// Afișat în admin când utilizatorul nu are niciun rol (user_roles) în vreun workspace.
export default function NoAdminAccess() {
  return (
    <div className="p-12 text-center">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Nu ai acces la niciun workspace.</p>
    </div>
  )
}
