import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors } from '../theme'
import { mockPatients } from '../data/mockData'
import { RiskBadge } from '../components/RiskBadge'

export function RiskAlerts() {
  const navigate = useNavigate()
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set())

  const allAlerts = mockPatients.flatMap(patient =>
    patient.riskAlerts.map(alert => ({ ...alert, patientId: patient.id, patientName: patient.name, patientAge: patient.age }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const activeAlerts = allAlerts.filter(a => !a.acknowledged && !acknowledged.has(a.id))
  const resolvedAlerts = allAlerts.filter(a => a.acknowledged || acknowledged.has(a.id))

  function acknowledge(alertId: string) {
    setAcknowledged(prev => new Set([...prev, alertId]))
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>Risk Alerts</h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4 }}>
          Crisis detections and safety flags from patient check-ins and chat
        </p>
      </div>

      {activeAlerts.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.riskRed, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Active alerts ({activeAlerts.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeAlerts.map(alert => (
              <div key={alert.id} style={{
                background: colors.riskRedBg,
                border: `1px solid ${colors.riskRedBorder}`,
                borderRadius: 14,
                padding: 20,
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
              }}>
                <div style={{ fontSize: 24 }}>⚠</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{ fontSize: 15, fontWeight: 700, color: colors.text, cursor: 'pointer' }}
                      onClick={() => navigate(`/patients/${alert.patientId}`)}
                    >
                      {alert.patientName}
                    </span>
                    <RiskBadge level={alert.level} size="sm" />
                    <span style={{ fontSize: 12, color: colors.textMuted }}>{alert.date}</span>
                  </div>
                  <p style={{ fontSize: 14, color: colors.text, lineHeight: 1.5, marginBottom: 8 }}>{alert.summary}</p>
                  <div style={{
                    background: 'rgba(239,68,68,0.06)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 13,
                    color: colors.riskRed,
                    fontStyle: 'italic',
                    marginBottom: 12,
                  }}>
                    Trigger: "{alert.triggerMessage}"
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => navigate(`/patients/${alert.patientId}`)}
                      style={{
                        background: colors.riskRed,
                        color: colors.white,
                        border: 'none',
                        borderRadius: 9999,
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      View patient
                    </button>
                    <button
                      onClick={() => acknowledge(alert.id)}
                      style={{
                        background: 'none',
                        color: colors.riskRed,
                        border: `1px solid ${colors.riskRedBorder}`,
                        borderRadius: 9999,
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAlerts.length === 0 && (
        <div style={{
          background: colors.riskGreenBg,
          border: `1px solid ${colors.riskGreenBorder}`,
          borderRadius: 12,
          padding: 20,
          textAlign: 'center',
          marginBottom: 28,
          color: colors.riskGreen,
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
          <strong>No active risk alerts</strong>
          <p style={{ fontSize: 13, marginTop: 4 }}>All alerts have been acknowledged.</p>
        </div>
      )}

      {resolvedAlerts.length > 0 && (
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
            Resolved ({resolvedAlerts.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {resolvedAlerts.map(alert => (
              <div key={alert.id} style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 16,
                opacity: 0.7,
              }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{alert.patientName}</span>
                  <span style={{ fontSize: 12, color: colors.textMuted }}>{alert.date}</span>
                  <span style={{ fontSize: 12, color: colors.riskGreen, fontWeight: 600 }}>Acknowledged</span>
                </div>
                <p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{alert.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
