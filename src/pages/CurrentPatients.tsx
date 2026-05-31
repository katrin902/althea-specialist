import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, shadow } from '../theme'
import { mockPatients } from '../data/mockData'
import { RiskBadge } from '../components/RiskBadge'

export function CurrentPatients() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all')

  const patients = mockPatients
    .filter(p => p.category === 'current')
    .filter(p => riskFilter === 'all' || p.riskLevel === riskFilter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ padding: '28px 32px 48px', background: colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0 }}>Current Patients</h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0' }}>
          Patients actively in your care · {patients.length} patient{patients.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <SummaryCard label="Active patients" value={patients.length} icon="👤" color={colors.primary} bg={colors.primaryLight} />
        <SummaryCard label="High risk" value={patients.filter(p => p.riskLevel === 'red').length} icon="🔴" color={colors.riskRed} bg={colors.riskRedBg} />
        <SummaryCard label="Upcoming appointments" value={patients.filter(p => p.upcomingAppointment).length} icon="📅" color={colors.statusAccepted} bg={colors.statusAcceptedBg} />
        <SummaryCard label="Pending check-ins" value={patients.filter(p => p.lastCheckIn.unsafeFlag).length} icon="⚠" color={colors.riskYellow} bg={colors.riskYellowBg} />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search patients…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: 9999,
            border: `1px solid ${colors.border}`, background: colors.surface,
            fontSize: 13, color: colors.text, outline: 'none', width: 220,
          }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'red', 'yellow', 'green'] as const).map(f => (
            <FilterChip key={f} label={f === 'all' ? 'All' : f === 'red' ? 'High risk' : f === 'yellow' ? 'Medium' : 'Low risk'} active={riskFilter === f} onClick={() => setRiskFilter(f)} />
          ))}
        </div>
      </div>

      {/* Patient cards */}
      {patients.length === 0 ? (
        <EmptyState message="No current patients match your filters." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {patients.map(patient => (
            <div
              key={patient.id}
              style={{
                background: colors.surface,
                borderRadius: 14,
                border: `1px solid ${colors.border}`,
                boxShadow: shadow.sm,
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/patients/${patient.id}`)}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.md }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.sm }}
            >
              {/* Avatar */}
              <Avatar name={patient.name} size={48} hasAlert={patient.riskAlerts.some(a => !a.acknowledged)} />

              {/* Name + meta */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{patient.name}</span>
                  <RiskBadge level={patient.riskLevel} size="sm" />
                  {patient.riskAlerts.some(a => !a.acknowledged) && (
                    <AlertPill />
                  )}
                </div>
                <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>
                  {patient.age} · {patient.city} · {patient.status}
                </div>
                {/* Symptoms */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                  {patient.mainSymptoms.slice(0, 3).map(s => (
                    <SymptomTag key={s} label={s} />
                  ))}
                  {patient.mainSymptoms.length > 3 && (
                    <SymptomTag label={`+${patient.mainSymptoms.length - 3}`} />
                  )}
                </div>
                {/* Check-in bars */}
                <div style={{ display: 'flex', gap: 14 }}>
                  <MiniBar label="Mood" value={patient.lastCheckIn.mood} color={colors.primary} />
                  <MiniBar label="Anxiety" value={patient.lastCheckIn.anxiety} color={colors.riskYellow} invert />
                  <MiniBar label="Sleep" value={patient.lastCheckIn.sleep} color={colors.riskGreen} />
                  <span style={{ fontSize: 11, color: colors.textMuted, alignSelf: 'flex-end' }}>
                    {patient.lastCheckIn.date}
                  </span>
                </div>
              </div>

              {/* Appointment */}
              <div style={{ width: 170, flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
                  Appointment
                </div>
                {patient.upcomingAppointment ? (
                  <>
                    <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{patient.upcomingAppointment.date.split(',')[0]}</div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>{patient.upcomingAppointment.time} · {patient.upcomingAppointment.type}</div>
                    <StatusPill status={patient.upcomingAppointment.status} />
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: colors.textMuted }}>None scheduled</span>
                )}
              </div>

              {/* Specialist */}
              <div style={{ width: 150, flexShrink: 0 }}>
                <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
                  Specialist
                </div>
                <div style={{ fontSize: 13, color: colors.text }}>{patient.assignedSpecialist || '—'}</div>
              </div>

              {/* Action */}
              <button
                onClick={e => { e.stopPropagation(); navigate(`/patients/${patient.id}`) }}
                style={{
                  background: colors.primaryLight, color: colors.primary,
                  border: 'none', borderRadius: 9999,
                  padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                }}
              >
                View →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Shared small components ── */

function Avatar({ name, size, hasAlert }: { name: string; size: number; hasAlert: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: hasAlert ? colors.riskRedBg : colors.primaryLight,
      border: `2px solid ${hasAlert ? colors.riskRedBorder : 'transparent'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: 700,
      color: hasAlert ? colors.riskRed : colors.primary,
      flexShrink: 0,
    }}>
      {name.split(' ').map(n => n[0]).slice(0, 2).join('')}
    </div>
  )
}

function AlertPill() {
  return (
    <span style={{ fontSize: 11, background: colors.riskRedBg, color: colors.riskRed, borderRadius: 9999, padding: '1px 8px', fontWeight: 700, border: `1px solid ${colors.riskRedBorder}` }}>
      ⚠ Alert
    </span>
  )
}

function SymptomTag({ label }: { label: string }) {
  return (
    <span style={{
      background: colors.surfaceMuted, borderRadius: 9999,
      padding: '3px 9px', fontSize: 11, color: colors.textSecondary,
      border: `1px solid ${colors.borderLight}`,
    }}>
      {label}
    </span>
  )
}

function MiniBar({ label, value, color, invert = false }: { label: string; value: number; color: string; invert?: boolean }) {
  const fill = value / 10
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: 54 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: colors.textMuted }}>{label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 4, borderRadius: 9999, background: colors.borderLight, overflow: 'hidden' }}>
        <div style={{ width: `${fill * 100}%`, height: '100%', background: color, borderRadius: 9999 }} />
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const isConfirmed = status === 'confirmed'
  return (
    <span style={{
      display: 'inline-block', marginTop: 5,
      fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 600,
      background: isConfirmed ? colors.riskGreenBg : colors.riskYellowBg,
      color: isConfirmed ? colors.riskGreen : colors.riskYellow,
      border: `1px solid ${isConfirmed ? colors.riskGreenBorder : colors.riskYellowBorder}`,
    }}>
      {status}
    </span>
  )
}

function SummaryCard({ label, value, icon, color, bg }: { label: string; value: number; icon: string; color: string; bg: string }) {
  return (
    <div style={{
      background: colors.surface, borderRadius: 14, padding: '16px 18px',
      border: `1px solid ${colors.border}`, boxShadow: shadow.sm,
    }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10 }}>
        {icon}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 3 }}>{label}</div>
    </div>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px', borderRadius: 9999, fontSize: 12, fontWeight: 500,
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

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textMuted }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🗂</div>
      <p style={{ fontSize: 14, margin: 0 }}>{message}</p>
    </div>
  )
}
