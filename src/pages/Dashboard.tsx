import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, shadow } from '../theme'
import { mockPatients, mockSpecialist, mockProviderCapacity, ProviderCapacity } from '../data/mockData'
import { RiskBadge } from '../components/RiskBadge'

const MOCK_TODAY = new Date('2025-06-12')
function daysWaiting(date?: string) {
  if (!date) return 0
  return Math.max(0, Math.floor((MOCK_TODAY.getTime() - new Date(date).getTime()) / 86400000))
}

export function Dashboard() {
  const navigate = useNavigate()
  const [capacity, setCapacity] = useState<ProviderCapacity>(mockProviderCapacity)

  const current = mockPatients.filter(p => p.category === 'current')
  const waiting = mockPatients.filter(p => p.category === 'waiting')
  const requests = mockPatients.filter(p => p.category === 'request' && p.requestStatus === 'pending')
  const alerts = mockPatients.flatMap(p => p.riskAlerts.filter(a => !a.acknowledged))
  const highRisk = mockPatients.filter(p => p.riskLevel === 'red')
  const withAppointment = mockPatients.filter(p => p.upcomingAppointment)
  const pendingIntakeForms = mockPatients.filter(p => p.intakeFormStatus === 'sent')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  // Needs Action items — computed dynamically
  const needsActionItems = [
    ...alerts.map(a => {
      const patient = mockPatients.find(p => p.riskAlerts.some(r => r.id === a.id))
      return { id: a.id, patient: patient?.name ?? '—', type: 'Risk alert', detail: a.summary, urgency: 'urgent' as const, date: a.date, action: () => navigate('/alerts') }
    }),
    ...requests.map(p => ({
      id: p.id, patient: p.name, type: 'New request', detail: `${p.riskLevel === 'red' ? '⚠ Urgent — ' : ''}${p.mainSymptoms.slice(0, 2).join(', ')}`, urgency: p.riskLevel === 'red' ? 'urgent' as const : 'normal' as const,
      date: p.requestDate ?? '', action: () => navigate('/patient-requests'),
    })),
    ...pendingIntakeForms.map(p => ({
      id: p.id + '_intake', patient: p.name, type: 'Intake completed', detail: 'Patient has completed the institution intake form', urgency: 'normal' as const,
      date: p.lastCheckIn.date, action: () => navigate(`/patients/${p.id}`),
    })),
    ...waiting.filter(p => !p.upcomingAppointment).map(p => ({
      id: p.id + '_appt', patient: p.name, type: 'No appointment', detail: `Waiting ${daysWaiting(p.acceptedDate)} days — no appointment scheduled`, urgency: daysWaiting(p.acceptedDate) > 14 ? 'urgent' as const : 'normal' as const,
      date: p.acceptedDate ?? '', action: () => navigate(`/patients/${p.id}`),
    })),
  ].sort((a, b) => (a.urgency === 'urgent' ? -1 : 1))

  return (
    <div style={{ padding: '28px 32px 48px', background: colors.background, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0 }}>
          {greeting}, {mockSpecialist.name.split(' ')[1]}.
        </h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0' }}>
          {mockSpecialist.institution} · {new Date().toLocaleDateString('en-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Urgent alert banner */}
      {alerts.length > 0 && (
        <div
          onClick={() => navigate('/alerts')}
          style={{
            background: colors.riskRedBg, border: `1px solid ${colors.riskRedBorder}`,
            borderLeft: `4px solid ${colors.riskRed}`,
            borderRadius: 12, padding: '12px 18px', marginBottom: 22,
            display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          }}
        >
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: colors.riskRed, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, flexShrink: 0 }}>⚠</div>
          <div style={{ flex: 1 }}>
            <strong style={{ color: colors.riskRedText, fontSize: 13, display: 'block' }}>
              {alerts.length} unacknowledged risk alert{alerts.length > 1 ? 's' : ''}
            </strong>
            <span style={{ fontSize: 12, color: colors.riskRedText }}>{alerts[0].summary}</span>
          </div>
          <button style={{ background: colors.riskRed, color: '#fff', border: 'none', borderRadius: 9999, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Review →
          </button>
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 24 }}>
        <KPICard label="Current" value={current.length} icon="👤" color={colors.primary} bg={colors.primaryLight} onClick={() => navigate('/current-patients')} />
        <KPICard label="Waiting" value={waiting.length} icon="⏳" color={colors.statusWaiting} bg={colors.statusWaitingBg} onClick={() => navigate('/waiting-patients')} />
        <KPICard label="Requests" value={requests.length} icon="📋" color={requests.length > 0 ? colors.primary : colors.textMuted} bg={requests.length > 0 ? colors.primaryLight : colors.surfaceMuted} onClick={() => navigate('/patient-requests')} />
        <KPICard label="High risk" value={highRisk.length} icon="🔴" color={colors.riskRed} bg={colors.riskRedBg} onClick={() => navigate('/current-patients')} />
        <KPICard label="Alerts" value={alerts.length} icon="⚠" color={alerts.length > 0 ? colors.riskRed : colors.textMuted} bg={alerts.length > 0 ? colors.riskRedBg : colors.surfaceMuted} onClick={() => navigate('/alerts')} />
        <KPICard label="Appointments" value={withAppointment.length} icon="📅" color={colors.riskGreen} bg={colors.riskGreenBg} onClick={() => navigate('/appointments')} />
      </div>

      {/* Two-column body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Needs Action queue */}
          <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${colors.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.text, margin: 0 }}>Needs action</h2>
                <p style={{ fontSize: 12, color: colors.textSecondary, margin: '2px 0 0' }}>Items requiring your attention</p>
              </div>
              {needsActionItems.length > 0 && (
                <span style={{ background: needsActionItems.some(i => i.urgency === 'urgent') ? colors.riskRedBg : colors.primaryLight, color: needsActionItems.some(i => i.urgency === 'urgent') ? colors.riskRed : colors.primary, borderRadius: 9999, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                  {needsActionItems.length}
                </span>
              )}
            </div>
            {needsActionItems.length === 0 ? (
              <div style={{ padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
                <p style={{ fontSize: 13, color: colors.riskGreen, fontWeight: 600, margin: 0 }}>All clear — no pending actions</p>
              </div>
            ) : (
              <div>
                {needsActionItems.slice(0, 6).map((item, i) => (
                  <div
                    key={item.id}
                    onClick={item.action}
                    style={{
                      padding: '12px 20px',
                      borderBottom: i < Math.min(needsActionItems.length, 6) - 1 ? `1px solid ${colors.borderLight}` : 'none',
                      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = colors.surfaceMuted }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                  >
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: item.urgency === 'urgent' ? colors.riskRed : colors.riskYellow,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{item.patient}</span>
                        <span style={{
                          fontSize: 11, padding: '1px 7px', borderRadius: 9999, fontWeight: 600,
                          background: item.urgency === 'urgent' ? colors.riskRedBg : colors.riskYellowBg,
                          color: item.urgency === 'urgent' ? colors.riskRed : colors.riskYellow,
                        }}>
                          {item.type}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: colors.textSecondary, margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.detail}
                      </p>
                    </div>
                    <span style={{ fontSize: 11, color: colors.textMuted, flexShrink: 0 }}>{item.date}</span>
                    <span style={{ fontSize: 12, color: colors.primary, fontWeight: 600, flexShrink: 0 }}>→</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Patient overview */}
          <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${colors.borderLight}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.text, margin: 0 }}>Recent patients</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <NavChip label="Current" path="/current-patients" count={current.length} navigate={navigate} />
                <NavChip label="Waiting" path="/waiting-patients" count={waiting.length} navigate={navigate} />
              </div>
            </div>
            <div>
              {mockPatients.filter(p => p.category !== 'request').slice(0, 4).map((patient, i, arr) => (
                <div
                  key={patient.id}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: i < arr.length - 1 ? `1px solid ${colors.borderLight}` : 'none',
                    display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = colors.surfaceMuted }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: colors.primary, flexShrink: 0 }}>
                    {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{patient.name}</span>
                      <RiskBadge level={patient.riskLevel} size="sm" />
                      <CategoryPill category={patient.category} />
                    </div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>{patient.age} · {patient.city} · {patient.status}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <MiniScore label="Mood" value={patient.lastCheckIn.mood} colorFn={v => v >= 6 ? colors.riskGreen : v >= 4 ? colors.riskYellow : colors.riskRed} />
                    <MiniScore label="Anxiety" value={patient.lastCheckIn.anxiety} colorFn={v => v <= 3 ? colors.riskGreen : v <= 6 ? colors.riskYellow : colors.riskRed} />
                  </div>
                  <span style={{ fontSize: 12, color: colors.primary, fontWeight: 600 }}>View →</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Capacity management */}
          <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, padding: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
              Capacity management
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Toggle: accepting new patients */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: colors.text }}>Accepting new patients</span>
                <button
                  onClick={() => setCapacity(c => ({ ...c, acceptingNewPatients: !c.acceptingNewPatients }))}
                  style={{
                    width: 44, height: 24, borderRadius: 9999, border: 'none', cursor: 'pointer',
                    background: capacity.acceptingNewPatients ? colors.riskGreen : colors.border,
                    position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3,
                    left: capacity.acceptingNewPatients ? 23 : 3,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
              {/* Toggle: pause recommendations */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: colors.text }}>Pause Althea recommendations</span>
                <button
                  onClick={() => setCapacity(c => ({ ...c, pauseRecommendations: !c.pauseRecommendations }))}
                  style={{
                    width: 44, height: 24, borderRadius: 9999, border: 'none', cursor: 'pointer',
                    background: capacity.pauseRecommendations ? colors.riskYellow : colors.border,
                    position: 'relative', transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3,
                    left: capacity.pauseRecommendations ? 23 : 3,
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
              <div style={{ height: 1, background: colors.borderLight }} />
              <InfoRow label="Est. waiting time" value={capacity.estimatedWaitingTime} />
              <InfoRow label="Available appt slots" value={`${capacity.availableAppointmentSlots}`} />
              <InfoRow label="Max new requests" value={`${capacity.maxNewRequests}`} />
              {/* Load bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: colors.textMuted }}>Patient load</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{current.length + waiting.length}/{capacity.maxPatientCount}</span>
                </div>
                <div style={{ height: 6, borderRadius: 9999, background: colors.borderLight, overflow: 'hidden' }}>
                  <div style={{ width: `${((current.length + waiting.length) / capacity.maxPatientCount) * 100}%`, height: '100%', background: colors.primary, borderRadius: 9999 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming appointments */}
          <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, padding: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>
              Upcoming appointments
            </h3>
            {withAppointment.length === 0 ? (
              <p style={{ fontSize: 13, color: colors.textMuted, margin: 0 }}>None scheduled.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {withAppointment.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/patients/${p.id}`)}
                    style={{ cursor: 'pointer', padding: '10px 12px', borderRadius: 10, border: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = colors.surfaceMuted }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                  >
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: colors.textSecondary, margin: '2px 0 0' }}>{p.upcomingAppointment!.date.split(',')[0]} · {p.upcomingAppointment!.time}</p>
                    </div>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 600, whiteSpace: 'nowrap',
                      background: p.upcomingAppointment!.status === 'confirmed' ? colors.riskGreenBg : colors.riskYellowBg,
                      color: p.upcomingAppointment!.status === 'confirmed' ? colors.riskGreen : colors.riskYellow,
                    }}>
                      {p.upcomingAppointment!.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Risk distribution */}
          <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, padding: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
              Risk distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'High risk', count: mockPatients.filter(p => p.riskLevel === 'red').length, color: colors.riskRed },
                { label: 'Medium risk', count: mockPatients.filter(p => p.riskLevel === 'yellow').length, color: colors.riskYellow },
                { label: 'Low risk', count: mockPatients.filter(p => p.riskLevel === 'green').length, color: colors.riskGreen },
              ].map(r => (
                <div key={r.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: colors.textSecondary }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.count}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 9999, background: colors.borderLight, overflow: 'hidden' }}>
                    <div style={{ width: `${mockPatients.length > 0 ? (r.count / mockPatients.length) * 100 : 0}%`, height: '100%', background: r.color, borderRadius: 9999 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ── */

function KPICard({ label, value, icon, color, bg, onClick }: { label: string; value: number; icon: string; color: string; bg: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{ background: colors.surface, borderRadius: 13, padding: '14px 16px', border: `1px solid ${colors.border}`, boxShadow: shadow.sm, cursor: 'pointer' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.md }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = shadow.sm }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 3 }}>{label}</div>
    </div>
  )
}

function MiniScore({ label, value, colorFn }: { label: string; value: number; colorFn: (v: number) => string }) {
  const color = colorFn(value)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: colors.surfaceMuted, borderRadius: 6, padding: '3px 7px' }}>
      <span style={{ fontSize: 10, color: colors.textMuted }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{value}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: colors.textMuted }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{value}</span>
    </div>
  )
}

function CategoryPill({ category }: { category: string }) {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    current: { bg: colors.riskGreenBg, color: colors.riskGreen, label: 'Current' },
    waiting: { bg: colors.statusWaitingBg, color: colors.statusWaiting, label: 'Waiting' },
    request: { bg: colors.primaryLight, color: colors.primary, label: 'Request' },
  }
  const c = config[category] ?? config.current
  return (
    <span style={{ fontSize: 11, background: c.bg, color: c.color, borderRadius: 9999, padding: '1px 7px', fontWeight: 600 }}>
      {c.label}
    </span>
  )
}

function NavChip({ label, path, count, navigate }: { label: string; path: string; count: number; navigate: (path: string) => void }) {
  return (
    <button
      onClick={() => navigate(path)}
      style={{
        background: colors.primaryLight, color: colors.primary, border: 'none',
        borderRadius: 9999, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 5,
      }}
    >
      {label} <span style={{ opacity: 0.7 }}>{count}</span>
    </button>
  )
}
