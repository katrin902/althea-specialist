import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, shadow } from '../theme'
import { mockPatients } from '../data/mockData'

type ViewMode = 'upcoming' | 'all'

export function Appointments() {
  const navigate = useNavigate()
  const [view, setView] = useState<ViewMode>('upcoming')

  const withAppts = mockPatients.filter(p => p.upcomingAppointment)
  const confirmed = withAppts.filter(p => p.upcomingAppointment?.status === 'confirmed')
  const proposed = withAppts.filter(p => p.upcomingAppointment?.status === 'proposed')

  const displayed = view === 'upcoming' ? withAppts : mockPatients

  return (
    <div style={{ padding: '28px 32px 48px', background: colors.background, minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0 }}>Appointments</h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0' }}>
          Manage and track all patient appointments
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <ApptCard label="Upcoming" value={withAppts.length} icon="📅" color={colors.primary} bg={colors.primaryLight} />
        <ApptCard label="Confirmed" value={confirmed.length} icon="✓" color={colors.riskGreen} bg={colors.riskGreenBg} />
        <ApptCard label="Awaiting confirmation" value={proposed.length} icon="⏳" color={colors.riskYellow} bg={colors.riskYellowBg} />
        <ApptCard label="No appointment" value={mockPatients.filter(p => !p.upcomingAppointment).length} icon="✗" color={colors.textMuted} bg={colors.surfaceMuted} />
      </div>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <ToggleBtn label="Upcoming only" active={view === 'upcoming'} onClick={() => setView('upcoming')} />
        <ToggleBtn label="All patients" active={view === 'all'} onClick={() => setView('all')} />
      </div>

      {/* Awaiting confirmation banner */}
      {proposed.length > 0 && (
        <div style={{
          background: colors.riskYellowBg, border: `1px solid ${colors.riskYellowBorder}`,
          borderLeft: `4px solid ${colors.riskYellow}`,
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          fontSize: 13, color: colors.riskYellowText,
        }}>
          <strong>{proposed.length} appointment{proposed.length > 1 ? 's' : ''}</strong> awaiting patient confirmation
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {displayed.map(patient => (
          <div
            key={patient.id}
            style={{
              background: colors.surface, borderRadius: 13, border: `1px solid ${colors.border}`,
              boxShadow: shadow.sm, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer',
            }}
            onClick={() => navigate(`/patients/${patient.id}`)}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.md }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.sm }}
          >
            {/* Avatar */}
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: colors.primaryLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: colors.primary, flexShrink: 0,
            }}>
              {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{patient.name}</div>
              <div style={{ fontSize: 12, color: colors.textSecondary }}>{patient.age} · {patient.city} · {patient.category}</div>
            </div>

            {/* Appointment detail */}
            {patient.upcomingAppointment ? (
              <>
                <div style={{ width: 200 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{patient.upcomingAppointment.date}</div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>{patient.upcomingAppointment.time} · {patient.upcomingAppointment.type}</div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>{patient.upcomingAppointment.location}</div>
                </div>
                <div style={{ width: 100 }}>
                  <ApptStatusPill status={patient.upcomingAppointment.status} />
                </div>
              </>
            ) : (
              <div style={{ width: 310, fontSize: 13, color: colors.textMuted, fontStyle: 'italic' }}>No appointment scheduled</div>
            )}

            {/* Specialist */}
            <div style={{ width: 150, fontSize: 12, color: colors.textSecondary }}>
              {patient.assignedSpecialist || '—'}
            </div>

            <span style={{ fontSize: 12, color: colors.primary, fontWeight: 600 }}>View →</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApptCard({ label, value, icon, color, bg }: { label: string; value: number; icon: string; color: string; bg: string }) {
  return (
    <div style={{ background: colors.surface, borderRadius: 14, padding: '16px 18px', border: `1px solid ${colors.border}`, boxShadow: shadow.sm }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10 }}>
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 3 }}>{label}</div>
    </div>
  )
}

function ToggleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 500,
        border: `1px solid ${active ? colors.primary : colors.border}`,
        background: active ? colors.primaryLight : colors.surface,
        color: active ? colors.primary : colors.textSecondary,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

function ApptStatusPill({ status }: { status: string }) {
  const isConfirmed = status === 'confirmed'
  return (
    <span style={{
      fontSize: 11, padding: '3px 10px', borderRadius: 9999, fontWeight: 600,
      background: isConfirmed ? colors.riskGreenBg : colors.riskYellowBg,
      color: isConfirmed ? colors.riskGreen : colors.riskYellow,
      border: `1px solid ${isConfirmed ? colors.riskGreenBorder : colors.riskYellowBorder}`,
    }}>
      {status}
    </span>
  )
}
