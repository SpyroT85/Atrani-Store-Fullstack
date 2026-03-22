import { useRef, useState } from 'react';

const API_URL = 'https://api.spyros-tserkezos.dev';

interface AvatarUploadProps {
  currentAvatar?: string;
  name?: string;
  token: string;
  onUpload: (url: string) => void;
}

export default function AvatarUpload({ currentAvatar, name, token, onUpload }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch(`${API_URL}/api/users/upload-avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onUpload(data.url);
    } catch {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      {/* Avatar circle */}
      <div style={{ position: 'relative', width: '96px', height: '96px' }}>
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt={name}
            style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(163,122,65,0.3)' }}
          />
        ) : (
          <div style={{
            width: '96px', height: '96px', borderRadius: '50%',
            background: 'rgba(163,122,65,0.15)', border: '2px solid rgba(163,122,65,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', color: '#a37a41',
          }}>
            {initials}
          </div>
        )}
        {uploading && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '24px', height: '24px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}
      </div>

      {/* Upload button */}
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#a37a41',
          background: 'none',
          border: '1px solid rgba(163,122,65,0.4)',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          opacity: uploading ? 0.5 : 1,
          transition: 'border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { if (!uploading) { e.currentTarget.style.borderColor = '#a37a41'; e.currentTarget.style.background = 'rgba(163,122,65,0.08)'; } }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(163,122,65,0.4)'; e.currentTarget.style.background = 'none'; }}
      >
        {uploading ? 'Uploading...' : currentAvatar ? 'Change Photo' : 'Add Photo'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFile}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}