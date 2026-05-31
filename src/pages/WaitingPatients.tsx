import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, shadow } from '../theme'
import { mockPatients } from '../data/mockData'
import { RiskBadge } from '../components/RiskBadge'

const MOCK_TODAY = new Date('2025-06-12')

function daysWaiting(acceptedDate?: string): number {
  if (!acceptedDate) return 0
  const diff = MOCK_TODAY.getTime() - new Date(acceptedDate).getTime()
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

const WAITING_THRESHOLD = 14 // days — highlight patients waiting longer

export function WaitingPatients() {
  const navigate = useNavigate()
  const [riskFilter, setRiskFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all')
  const [sortBy, setSortBy] = useState<'waiting' | 'risk' | 'name'>('waiting')

  const allWaiting = mockPatients.filter(p => p.category === 'waiting')

  const filtered = allWaiting
    .filter(p => riskFilter === 'all' || p.riskLevel === riskFilter)
    .sort((a, b) => {
      if (sortBy === 'waiting') return daysWaiting(b.acceptedDate) - daysWaiting(a.acceptedDate)
      if (sortBy === 'risk') {
        const order = { red: 0, yellow: 1, green: 2 }
        return order[a.riskLevel] - order[b.riskLevel]
      }
      return a.name.localeCompare(b.name)
    })

  const avgDays = allWaiting.length > 0
    ? Math.round(allWaiting.reduce((sum, p) => sum + daysWaiting(p.acceptedDate), 0) / allWaiting.length)
    : 0

  const longestWaiting = allWaiting.reduce<typeof allWaiting[0] | null>((max, p) =>
    !max || daysWaiting(p.acceptedDate) > daysWaiting(max.acceptedDate) ? p : max, null)

  const highRiskWaiting = allWaiting.filter(p => p.riskLevel === 'red').length

  return (
    <div style={{ padding: '28px 32px 48px', background: colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0 }}>Waiting Patients</h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0' }}>
          Accepted patients waiting for their first appointment
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <SummaryCard label="Total waiting" value={allWaiting.length} sub="patients" icon="⏳" color={colors.primary} bg={colors.primaryLight} />
        <SummaryCard label="Avg. wait time" value={avgDays} sub="days" icon="📆" color={colors.statusWaiting} bg={colors.statusWaitingBg} />
        <SummaryCard
          label="Longest waiting"
          value={longestWaiting ? daysWaiting(longestWaiting.acceptedDate) : 0}
          sub={longestWaiting?.name.split(' ')[0] ?? '—'}
          icon="⌛"
          color={daysWaiting(longestWaiting?.acceptedDate) > WAITING_THRESHOLD ? colors.riskRed : colors.statusWaiting}
          bg={daysWaiting(longestWaiting?.acceptedDate) > WAITING_THRESHOLD ? colors.riskRedBg : colors.statusWaitingBg}
        />
        <SummaryCard label="High-risk waiting" value={highRiskWaiting} sub="patients" icon="🔴" color={colors.riskRed} bg={colors.riskRedBg} />
      </div>

      {/* Filters & sort */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'red', 'yellow', 'green'] as const).map(f => (
            <FilterChip key={f} label={f === 'all' ? 'All' : f === 'red' ? 'High risk' : f === 'yellow' ? 'Medium' : 'Low risk'} active={riskFilter === f} onClick={() => setRiskFilter(f)} />
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: colors.textMuted }}>Sort:</span>
          {(['waiting', 'risk', 'name'] as const).map(s => (
            <FilterChip key={s} label={s === 'waiting' ? 'Wait time' : s === 'risk' ? 'Risk' : 'Name'} active={sortBy === s} onClick={() => setSortBy(s)} />
          ))}
        </div>
      </div>

      {/* Patient cards */}
      {filtered.length === 0 ? (
        <EmptyState message="No waiting patients match your filters." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(patient => {
            const days = daysWaiting(patient.acceptedDate)
            const isOverThreshold = days > WAITING_THRESHOLD
            return (
              <div
                key={patient.id}
                style={{
                  background: colors.surface,
                  borderRadius: 14,
                  border: `1px solid ${isOverThreshold ? colors.riskYellowBorder : colors.border}`,
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
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: colors.primaryLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: colors.primary, flexShrink: 0,
                }}>
                  {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>

                {/* Name + meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{patient.name}</span>
                    <RiskBadge level={patient.riskLevel} size="sm" />
                    {isOverThreshold && (
                      <span style={{ fontSize: 11, background: colors.riskYellowBg, color: colors.riskYellow, borderRadius: 9999, padding: '1px 8px', fontWeight: 600, border: `1px solid ${colors.riskYellowBorder}` }}>
                        Long wait
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 8 }}>
                    {patient.age} · {patient.city} · {patient.language} · {patient.insuranceType}
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                    {patient.mainSymptoms.slice(0, 3).map(s => (
                      <SymptomTag key={s} label={s} />
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>
                    <span style={{ color: colors.textMuted }}>Accepted:</span>{' '}
                    {patient.acceptedDate} · <span style={{ color: colors.textMuted }}>Specialist:</span>{' '}
                    {patient.assignedSpecialist || 'Not yet assigned'}
                  </div>
                </div>

                {/* Days waiting — prominent badge */}
                <div style={{
                  flexShrink: 0, textAlign: 'center',
                  background: isOverThreshold ? colors.riskYellowBg : colors.primaryLight,
                  border: `1px solid ${isOverThreshold ? colors.riskYellowBorder : colors.primaryMid}`,
                  borderRadius: 12, padding: '10px 16px', minWidth: 76,
                }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: isOverThreshold ? colors.riskYellow : colors.primary, lineHeight: 1 }}>
                    {days}
                  </div>
                  <div style={{ fontSize: 11, color: isOverThreshold ? colors.riskYellowText : colors.primaryDark, fontWeight: 500 }}>
                    days waiting
                  </div>
                </div>

                {/* Appointment status */}
                <div style={{ width: 150, flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Appointment</div>
                  {patient.upcomingAppointment ? (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{patient.upcomingAppointment.date.split(',')[0]}</div>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>{patient.upcomingAppointment.time}</div>
                      <span style={{
                        display: 'inline-block', marginTop: 4,
                        fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 600,
                        background: colors.riskYellowBg, color: colors.riskYellow, border: `1px solid ${colors.riskYellowBorder}`,
                      }}>
                        {patient.upcomingAppointment.status}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, color: colors.textMuted }}>Not scheduled</span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/patients/${patient.id}`) }}
                    style={{ background: colors.primaryLight, color: colors.primary, border: 'none', borderRadius: 9999, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    View →
                  </button>
                  {!patient.upcomingAppointment && (
                    <button
                      onClick={e => { e.stopPropagation() }}
                      style={{ background: colors.primary, color: colors.white, border: 'none', borderRadius: 9999, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Propose appt
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Local shared components ── */

function SymptomTag({ label }: { label: string }) {
  return (
    <span style={{ background: colors.surfaceMuted, borderRadius: 9999, padding: '3px 9px', fontSize: 11, color: colors.textSecondary, border: `1px solid ${colors.borderLight}` }}>
      {label}
    </span>
  )
}

function SummaryCard({ label, value, sub, icon, color, bg }: { label: string; value: number; sub: string; icon: string; color: string; bg: string }) {
  return (
    <div style={{ background: colors.surface, borderRadius: 14, padding: '16px 18px', border: `1px solid ${colors.border}`, boxShadow: shadow.sm }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10 }}>
        {icon}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 12, color: colors.textMuted }}>{sub}</span>
      </div>
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
      <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
      <p style={{ fontSize: 14, margin: 0 }}>{message}</p>
    </div>
  )
}

// Needed for colors.primaryDark/primaryMid references
declare module '../theme' {
  interface ColorMap {
    primaryDark: string
    primaryMid: string
  }
}
