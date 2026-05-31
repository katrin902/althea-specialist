import React from 'react'
import { colors, shadow } from '../theme'
import { mockPatients } from '../data/mockData'

const MOCK_TODAY = new Date('2025-06-12')

function daysWaiting(date?: string) {
  if (!date) return 0
  return Math.max(0, Math.floor((MOCK_TODAY.getTime() - new Date(date).getTime()) / 86400000))
}

export function Analytics() {
  const total = mockPatients.length
  const current = mockPatients.filter(p => p.category === 'current')
  const waiting = mockPatients.filter(p => p.category === 'waiting')
  const requests = mockPatients.filter(p => p.category === 'request')
  const accepted = requests.filter(p => p.requestStatus === 'accepted')
  const rejected = requests.filter(p => p.requestStatus === 'rejected')
  const highRisk = mockPatients.filter(p => p.riskLevel === 'red')
  const withAppointment = mockPatients.filter(p => p.upcomingAppointment)
  const intakeCompleted = mockPatients.filter(p => p.intakeFormStatus === 'completed')
  const avgWait = waiting.length > 0
    ? Math.round(waiting.reduce((s, p) => s + daysWaiting(p.acceptedDate), 0) / waiting.length)
    : 0
  const acceptRate = requests.length > 0 ? Math.round(((accepted.length) / requests.length) * 100) : 0

  return (
    <div style={{ padding: '28px 32px 48px', background: colors.background, minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0 }}>Analytics</h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0' }}>
          Clinic-level overview · Amsterdam Mental Health Center
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        <KPI label="Total patients" value={total} icon="👥" color={colors.primary} bg={colors.primaryLight} />
        <KPI label="Avg. wait time" value={`${avgWait}d`} icon="⏳" color={colors.statusWaiting} bg={colors.statusWaitingBg} isText />
        <KPI label="Acceptance rate" value={`${acceptRate}%`} icon="✓" color={colors.riskGreen} bg={colors.riskGreenBg} isText />
        <KPI label="High-risk patients" value={highRisk.length} icon="🔴" color={colors.riskRed} bg={colors.riskRedBg} />
      </div>

      {/* Main two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Patient breakdown */}
        <ChartCard title="Patient breakdown by category">
          <BarGroup bars={[
            { label: 'Current', value: current.length, total, color: colors.primary, bg: colors.primaryLight },
            { label: 'Waiting', value: waiting.length, total, color: colors.statusWaiting, bg: colors.statusWaitingBg },
            { label: 'Requests', value: requests.length, total, color: colors.textSecondary, bg: colors.surfaceMuted },
          ]} />
        </ChartCard>

        {/* Risk distribution */}
        <ChartCard title="Risk level distribution">
          <BarGroup bars={[
            { label: 'High risk', value: highRisk.length, total, color: colors.riskRed, bg: colors.riskRedBg },
            { label: 'Medium risk', value: mockPatients.filter(p => p.riskLevel === 'yellow').length, total, color: colors.riskYellow, bg: colors.riskYellowBg },
            { label: 'Low risk', value: mockPatients.filter(p => p.riskLevel === 'green').length, total, color: colors.riskGreen, bg: colors.riskGreenBg },
          ]} />
        </ChartCard>

        {/* Intake completion */}
        <ChartCard title="Intake form completion">
          <BarGroup bars={[
            { label: 'Completed', value: intakeCompleted.length, total, color: colors.riskGreen, bg: colors.riskGreenBg },
            { label: 'Sent / pending', value: mockPatients.filter(p => p.intakeFormStatus === 'sent').length, total, color: colors.riskYellow, bg: colors.riskYellowBg },
            { label: 'Not sent', value: mockPatients.filter(p => p.intakeFormStatus === 'not_sent' || !p.intakeFormStatus).length, total, color: colors.textMuted, bg: colors.surfaceMuted },
          ]} />
        </ChartCard>

        {/* Request outcomes */}
        <ChartCard title="Patient request outcomes">
          <BarGroup bars={[
            { label: 'Pending review', value: requests.filter(p => p.requestStatus === 'pending').length, total: requests.length || 1, color: colors.primary, bg: colors.primaryLight },
            { label: 'Intake sent', value: requests.filter(p => p.requestStatus === 'intake_sent').length, total: requests.length || 1, color: colors.statusWaiting, bg: colors.statusWaitingBg },
            { label: 'Accepted', value: accepted.length, total: requests.length || 1, color: colors.riskGreen, bg: colors.riskGreenBg },
            { label: 'Rejected', value: rejected.length, total: requests.length || 1, color: colors.riskRed, bg: colors.riskRedBg },
          ]} />
        </ChartCard>
      </div>

      {/* Appointment stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard
          label="Appointment proposal response"
          value={`${withAppointment.length}/${waiting.length + current.length}`}
          sub="patients have an appointment"
          color={colors.primary}
        />
        <StatCard
          label="Patients waiting beyond threshold"
          value={waiting.filter(p => daysWaiting(p.acceptedDate) > 14).length}
          sub="waiting more than 14 days"
          color={colors.riskYellow}
        />
        <StatCard
          label="Active risk alerts"
          value={mockPatients.flatMap(p => p.riskAlerts).filter(a => !a.acknowledged).length}
          sub="unacknowledged alerts"
          color={colors.riskRed}
        />
      </div>

      {/* Patient wait times table */}
      <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${colors.borderLight}` }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            Waiting patients — time breakdown
          </h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: colors.surfaceMuted }}>
              {['Patient', 'Risk', 'Accepted date', 'Days waiting', 'Appointment', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {waiting.map((p, i) => {
              const days = daysWaiting(p.acceptedDate)
              return (
                <tr key={p.id} style={{ borderTop: i > 0 ? `1px solid ${colors.borderLight}` : 'none' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: colors.text }}>{p.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <RiskDot level={p.riskLevel} />
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: colors.textSecondary }}>{p.acceptedDate ?? '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: days > 14 ? colors.riskYellow : colors.riskGreen,
                    }}>
                      {days} days
                    </span>
                    {days > 14 && <span style={{ fontSize: 11, color: colors.riskYellow, marginLeft: 6 }}>⚠</span>}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: colors.textSecondary }}>
                    {p.upcomingAppointment ? p.upcomingAppointment.date.split(',')[0] : 'Not scheduled'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 9999, fontWeight: 600,
                      background: p.upcomingAppointment ? colors.riskGreenBg : colors.riskYellowBg,
                      color: p.upcomingAppointment ? colors.riskGreen : colors.riskYellow,
                    }}>
                      {p.upcomingAppointment ? p.upcomingAppointment.status : 'Pending'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KPI({ label, value, icon, color, bg, isText = false }: { label: string; value: number | string; icon: string; color: string; bg: string; isText?: boolean }) {
  return (
    <div style={{ background: colors.surface, borderRadius: 14, padding: '16px 18px', border: `1px solid ${colors.border}`, boxShadow: shadow.sm }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10 }}>
        {icon}
      </div>
      <div style={{ fontSize: isText ? 24 : 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 3 }}>{label}</div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.borderLight}` }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          {title}
        </h3>
      </div>
      <div style={{ padding: '18px' }}>{children}</div>
    </div>
  )
}

function BarGroup({ bars }: { bars: { label: string; value: number; total: number; color: string; bg: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {bars.map(bar => (
        <div key={bar.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 13, color: colors.text }}>{bar.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: bar.color }}>{bar.value}</span>
          </div>
          <div style={{ height: 8, borderRadius: 9999, background: colors.borderLight, overflow: 'hidden' }}>
            <div style={{
              width: `${bar.total > 0 ? (bar.value / bar.total) * 100 : 0}%`,
              height: '100%', background: bar.color, borderRadius: 9999,
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub: string; color: string }) {
  return (
    <div style={{ background: colors.surface, borderRadius: 14, padding: '18px 20px', border: `1px solid ${colors.border}`, boxShadow: shadow.sm }}>
      <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: colors.textMuted }}>{sub}</div>
    </div>
  )
}

function RiskDot({ level }: { level: string }) {
  const color = level === 'red' ? colors.riskRed : level === 'yellow' ? colors.riskYellow : colors.riskGreen
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 9, height: 9, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 12, color }}>{level === 'red' ? 'High' : level === 'yellow' ? 'Medium' : 'Low'}</span>
    </div>
  )
}
