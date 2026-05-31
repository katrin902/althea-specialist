import React, { useState } from 'react'
import { colors, shadow } from '../theme'
import { mockMessageTemplates, mockPatients } from '../data/mockData'

export function Messages() {
  const [selectedTemplate, setSelectedTemplate] = useState(mockMessageTemplates[0])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [customBody, setCustomBody] = useState(mockMessageTemplates[0].body)
  const [sent, setSent] = useState(false)
  const [filter, setFilter] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(mockMessageTemplates.map(t => t.category)))]

  const filtered = filter === 'All'
    ? mockMessageTemplates
    : mockMessageTemplates.filter(t => t.category === filter)

  function selectTemplate(t: typeof mockMessageTemplates[0]) {
    setSelectedTemplate(t)
    setCustomBody(t.body)
    setSent(false)
  }

  function handleSend() {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div style={{ padding: '28px 32px 48px', background: colors.background, minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0 }}>Messages</h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0' }}>
          Reusable message templates for common provider communications
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Template list */}
        <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${colors.borderLight}` }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
              Templates
            </h3>
            {/* Category filter */}
            <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '3px 9px', borderRadius: 9999, fontSize: 11, fontWeight: 500,
                    border: `1px solid ${filter === cat ? colors.primary : colors.border}`,
                    background: filter === cat ? colors.primaryLight : 'transparent',
                    color: filter === cat ? colors.primary : colors.textMuted,
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            {filtered.map((t, i) => (
              <button
                key={t.id}
                onClick={() => selectTemplate(t)}
                style={{
                  width: '100%', textAlign: 'left',
                  padding: '12px 16px',
                  borderBottom: i < filtered.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                  background: selectedTemplate.id === t.id ? colors.primaryLight : 'transparent',
                  border: 'none', cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: selectedTemplate.id === t.id ? colors.primary : colors.text }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{t.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Compose area */}
        <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${colors.borderLight}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.text, margin: '0 0 4px' }}>{selectedTemplate.name}</h3>
            <span style={{ fontSize: 11, background: colors.primaryLight, color: colors.primary, borderRadius: 9999, padding: '2px 9px', fontWeight: 600 }}>
              {selectedTemplate.category}
            </span>
          </div>
          <div style={{ padding: '20px' }}>
            {/* Patient selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 6 }}>
                Patient
              </label>
              <select
                value={selectedPatient}
                onChange={e => setSelectedPatient(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 9,
                  border: `1px solid ${colors.border}`, fontSize: 13, color: colors.text,
                  background: colors.surface, outline: 'none',
                }}
              >
                <option value="">— Select patient —</option>
                {mockPatients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.age}, {p.city})</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: colors.textSecondary, marginBottom: 6 }}>
                Subject
              </label>
              <input
                type="text"
                defaultValue={selectedTemplate.subject}
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 9,
                  border: `1px solid ${colors.border}`, fontSize: 13, color: colors.text,
                  background: colors.surface, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Body */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary }}>Message body</label>
                <button
                  onClick={() => setCustomBody(selectedTemplate.body)}
                  style={{ fontSize: 11, color: colors.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Reset to template
                </button>
              </div>
              <textarea
                value={customBody}
                onChange={e => setCustomBody(e.target.value)}
                rows={14}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: `1px solid ${colors.border}`, fontSize: 13, color: colors.text,
                  background: colors.background, resize: 'vertical', lineHeight: 1.7,
                  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Footer note */}
            <div style={{ background: colors.primaryLight, borderRadius: 9, padding: '10px 14px', fontSize: 12, color: colors.primaryDark, marginBottom: 20 }}>
              Replace <strong>[Patient name]</strong>, <strong>[Specialist name]</strong>, and other placeholders before sending.
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={handleSend}
                disabled={!selectedPatient}
                style={{
                  background: selectedPatient ? colors.primary : colors.border,
                  color: selectedPatient ? '#fff' : colors.textMuted,
                  border: 'none', borderRadius: 9999,
                  padding: '10px 24px', fontSize: 14, fontWeight: 600,
                  cursor: selectedPatient ? 'pointer' : 'not-allowed',
                }}
              >
                {sent ? '✓ Sent!' : 'Send message'}
              </button>
              {!selectedPatient && (
                <span style={{ fontSize: 12, color: colors.textMuted }}>Select a patient first</span>
              )}
              {sent && (
                <span style={{ fontSize: 13, color: colors.riskGreen, fontWeight: 600 }}>Message sent successfully</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

declare module '../theme' {
  interface ColorMap {
    primaryDark: string
  }
}
