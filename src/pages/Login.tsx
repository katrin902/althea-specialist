import React, { useState } from 'react'
import { colors } from '../theme'

interface Props {
  onLogin: () => void
}

export function Login({ onLogin }: Props) {
  const [email, setEmail] = useState('l.vanberg@amhc.nl')
  const [password, setPassword] = useState('password123')

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <div style={{
        background: colors.surface,
        borderRadius: 20,
        padding: 48,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 4px 32px rgba(26,26,46,0.08)',
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 42, fontWeight: 800, color: colors.primary, letterSpacing: -1, marginBottom: 4 }}>
            AltHea
          </div>
          <div style={{ fontSize: 14, color: colors.textSecondary }}>Specialist Dashboard</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 6 }}>
            Work email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
              fontSize: 15,
              color: colors.text,
              background: colors.background,
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: colors.text, marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
              fontSize: 15,
              color: colors.text,
              background: colors.background,
              outline: 'none',
            }}
          />
        </div>

        <button
          onClick={onLogin}
          style={{
            width: '100%',
            padding: '14px',
            background: colors.primary,
            color: colors.white,
            border: 'none',
            borderRadius: 9999,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Log in
        </button>

        <div style={{
          marginTop: 24,
          padding: 14,
          background: colors.surfaceMuted,
          borderRadius: 10,
          fontSize: 12,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          Demo login: use the pre-filled credentials above. Specialist accounts require clinic approval in production.
        </div>
      </div>
    </div>
  )
}
