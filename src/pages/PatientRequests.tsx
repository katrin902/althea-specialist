import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors, shadow } from '../theme'
import { mockPatients, mockMessageTemplates, Patient } from '../data/mockData'
import { RiskBadge } from '../components/RiskBadge'

type LocalStatus = 'pending' | 'accepted' | 'rejected' | 'intake_sent'

export function PatientRequests() {
  const navigate = useNavigate()
  // Local override state (persists while on this page)
  const [statuses, setStatuses] = useState<Record<string, LocalStatus>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [messageModal, setMessageModal] = useState<{ patientId: string; templateId: string } | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')

  const requests = mockPatients.filter(p => p.category === 'request')

  function getStatus(patient: Patient): LocalStatus {
    return statuses[patient.id] ?? (patient.requestStatus as LocalStatus) ?? 'pending'
  }

  function accept(id: string) {
    setStatuses(s => ({ ...s, [id]: 'accepted' }))
  }

  function sendIntakeForm(id: string) {
    setStatuses(s => ({ ...s, [id]: 'intake_sent' }))
  }

  function reject(id: string) {
    setStatuses(s => ({ ...s, [id]: 'rejected' }))
    setRejectModal(null)
    setRejectReason('')
  }

  const filtered = requests.filter(p => filter === 'all' || getStatus(p) === filter)
  const pendingCount = requests.filter(p => getStatus(p) === 'pending').length
  const acceptedCount = requests.filter(p => getStatus(p) === 'accepted').length
  const rejectedCount = requests.filter(p => getStatus(p) === 'rejected').length

  return (
    <div style={{ padding: '28px 32px 48px', background: colors.background, minHeight: '100vh', position: 'relative' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0 }}>Patient Requests</h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: '4px 0 0' }}>
          New requests from patients who selected your clinic
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <SCard label="Pending review" value={pendingCount} icon="📋" color={colors.primary} bg={colors.primaryLight} />
        <SCard label="Accepted" value={acceptedCount} icon="✓" color={colors.statusAccepted} bg={colors.statusAcceptedBg} />
        <SCard label="Rejected" value={rejectedCount} icon="✗" color={colors.statusRejected} bg={colors.statusRejectedBg} />
        <SCard label="Total requests" value={requests.length} icon="📁" color={colors.textSecondary} bg={colors.surfaceMuted} />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {(['all', 'pending', 'accepted', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '7px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 500,
              border: `1px solid ${filter === f ? colors.primary : colors.border}`,
              background: filter === f ? colors.primaryLight : colors.surface,
              color: filter === f ? colors.primary : colors.textSecondary,
              cursor: 'pointer',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'pending' && pendingCount > 0 && (
              <span style={{ marginLeft: 6, background: colors.primary, color: '#fff', borderRadius: 9999, padding: '0 6px', fontSize: 11 }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Request cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textMuted }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <p style={{ fontSize: 14, margin: 0 }}>No requests match this filter.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(patient => {
            const status = getStatus(patient)
            const isExpanded = expanded === patient.id
            const isUrgent = patient.riskLevel === 'red'

            return (
              <div
                key={patient.id}
                style={{
                  background: colors.surface,
                  borderRadius: 16,
                  border: `1px solid ${isUrgent && status === 'pending' ? colors.riskRedBorder : colors.border}`,
                  boxShadow: shadow.sm,
                  overflow: 'hidden',
                  opacity: status === 'rejected' ? 0.65 : 1,
                }}
              >
                {/* Card header */}
                <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: isUrgent ? colors.riskRedBg : colors.primaryLight,
                    border: `2px solid ${isUrgent ? colors.riskRedBorder : 'transparent'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700,
                    color: isUrgent ? colors.riskRed : colors.primary, flexShrink: 0,
                  }}>
                    {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{patient.name}</span>
                      <RiskBadge level={patient.riskLevel} size="sm" />
                      {isUrgent && status === 'pending' && (
                        <span style={{ fontSize: 11, background: colors.riskRedBg, color: colors.riskRed, borderRadius: 9999, padding: '1px 8px', fontWeight: 700, border: `1px solid ${colors.riskRedBorder}` }}>
                          ⚠ Urgent
                        </span>
                      )}
                      <StatusBadge status={status} />
                    </div>
                    <div style={{ fontSize: 12, color: colors.textSecondary }}>
                      {patient.age} · {patient.city} · {patient.language} · {patient.insuranceType} · Referral: {patient.referralStatus}
                    </div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 7 }}>
                      {patient.mainSymptoms.map(s => (
                        <span key={s} style={{ background: colors.surfaceMuted, borderRadius: 9999, padding: '3px 9px', fontSize: 11, color: colors.textSecondary, border: `1px solid ${colors.borderLight}` }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Request date + intake status */}
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: colors.textMuted }}>Submitted</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{patient.requestDate}</div>
                    {patient.intakeFormStatus && (
                      <div style={{ marginTop: 6 }}>
                        <IntakeFormStatusBadge status={status === 'intake_sent' ? 'sent' : patient.intakeFormStatus} />
                      </div>
                    )}
                  </div>

                  {/* Expand/collapse */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : patient.id)}
                    style={{
                      background: colors.surfaceMuted, color: colors.textSecondary,
                      border: `1px solid ${colors.border}`, borderRadius: 9999,
                      padding: '6px 14px', fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    {isExpanded ? 'Less ↑' : 'Details ↓'}
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ borderTop: `1px solid ${colors.borderLight}`, padding: '20px 22px', background: colors.surfaceCard }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                      {/* Patient message */}
                      <div>
                        <SectionLabel>Patient's message</SectionLabel>
                        <div style={{ background: colors.surface, borderRadius: 10, padding: '12px 14px', border: `1px solid ${colors.border}`, fontSize: 13, color: colors.text, lineHeight: 1.6, fontStyle: 'italic' }}>
                          "{patient.patientMessage}"
                        </div>
                      </div>

                      {/* Althea recommendation */}
                      <div>
                        <SectionLabel>Althea recommendation reason</SectionLabel>
                        <div style={{ background: colors.primaryLight, borderRadius: 10, padding: '12px 14px', border: `1px solid ${colors.primaryMid}`, fontSize: 13, color: colors.text, lineHeight: 1.6 }}>
                          {patient.altheaRecommendationReason || 'No specific recommendation reason provided.'}
                        </div>
                      </div>

                      {/* AI intake summary */}
                      <div>
                        <SectionLabel>AI intake summary</SectionLabel>
                        <div style={{ background: colors.surface, borderRadius: 10, padding: '12px 14px', border: `1px solid ${colors.border}`, fontSize: 13, color: colors.text, lineHeight: 1.7 }}>
                          <div style={{ background: colors.primaryLight, borderRadius: 7, padding: '6px 10px', marginBottom: 10, fontSize: 11, color: colors.primaryDark }}>
                            Generated by Althea · approved by patient · not a diagnosis
                          </div>
                          {patient.intakeSummary.split('\n').slice(0, 8).join('\n').replace(/\*\*(.*?)\*\*/g, '$1')}
                          <button
                            onClick={() => navigate(`/patients/${patient.id}`)}
                            style={{ display: 'block', marginTop: 8, background: 'none', border: 'none', color: colors.primary, fontSize: 12, cursor: 'pointer', padding: 0, fontWeight: 600 }}
                          >
                            Read full summary →
                          </button>
                        </div>
                      </div>

                      {/* Documents + preferences */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <SectionLabel>Uploaded documents</SectionLabel>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {patient.documents.map(doc => (
                              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: colors.surface, borderRadius: 8, padding: '8px 12px', border: `1px solid ${colors.border}` }}>
                                <span style={{ fontSize: 16 }}>📄</span>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: 12, fontWeight: 600, color: colors.text, margin: 0 }}>{doc.name}</p>
                                  <p style={{ fontSize: 11, color: colors.textMuted, margin: 0 }}>{doc.type} · {doc.size}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <SectionLabel>Treatment preference</SectionLabel>
                          <p style={{ fontSize: 13, color: colors.text, margin: 0 }}>{patient.preferredTreatment || '—'}</p>
                        </div>
                        {/* Latest check-in */}
                        <div>
                          <SectionLabel>Latest check-in ({patient.lastCheckIn.date})</SectionLabel>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {[
                              { label: 'Mood', value: patient.lastCheckIn.mood, color: colors.primary },
                              { label: 'Anxiety', value: patient.lastCheckIn.anxiety, color: colors.riskYellow },
                              { label: 'Sleep', value: patient.lastCheckIn.sleep, color: colors.riskGreen },
                            ].map(m => (
                              <div key={m.label} style={{ background: colors.surfaceMuted, borderRadius: 8, padding: '6px 12px', textAlign: 'center' }}>
                                <div style={{ fontSize: 10, color: colors.textMuted }}>{m.label}</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action bar */}
                    {status === 'pending' && (
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', paddingTop: 16, borderTop: `1px solid ${colors.borderLight}` }}>
                        <ActionBtn primary onClick={() => accept(patient.id)}>✓ Accept patient</ActionBtn>
                        <ActionBtn onClick={() => sendIntakeForm(patient.id)}>Send intake form</ActionBtn>
                        <ActionBtn onClick={() => setMessageModal({ patientId: patient.id, templateId: 'mt1' })}>Send message</ActionBtn>
                        <ActionBtn danger onClick={() => setRejectModal(patient.id)}>✗ Reject request</ActionBtn>
                      </div>
                    )}
                    {status === 'accepted' && (
                      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: `1px solid ${colors.borderLight}`, alignItems: 'center' }}>
                        <div style={{ flex: 1, fontSize: 13, color: colors.statusAccepted, fontWeight: 600 }}>
                          ✓ Accepted — patient will be moved to Waiting Patients
                        </div>
                        <ActionBtn onClick={() => navigate(`/patients/${patient.id}`)}>View patient</ActionBtn>
                      </div>
                    )}
                    {status === 'intake_sent' && (
                      <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: `1px solid ${colors.borderLight}`, alignItems: 'center' }}>
                        <div style={{ flex: 1, fontSize: 13, color: colors.primary, fontWeight: 600 }}>
                          📋 Institution intake form sent — waiting for patient to complete
                        </div>
                        <ActionBtn primary onClick={() => accept(patient.id)}>Accept patient</ActionBtn>
                        <ActionBtn danger onClick={() => setRejectModal(patient.id)}>Reject</ActionBtn>
                      </div>
                    )}
                    {status === 'rejected' && (
                      <div style={{ paddingTop: 16, borderTop: `1px solid ${colors.borderLight}` }}>
                        <span style={{ fontSize: 13, color: colors.textMuted, fontStyle: 'italic' }}>This request has been rejected and archived.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setRejectModal(null)}>
          <div
            style={{ background: colors.surface, borderRadius: 16, padding: 28, width: 460, boxShadow: shadow.lg }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 17, fontWeight: 700, color: colors.text, margin: '0 0 6px' }}>Reject request</h2>
            <p style={{ fontSize: 13, color: colors.textSecondary, margin: '0 0 16px' }}>
              Optionally provide a reason. A polite rejection message will be sent to the patient.
            </p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)…"
              rows={4}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                border: `1px solid ${colors.border}`, fontSize: 13, color: colors.text,
                background: colors.background, resize: 'vertical', outline: 'none',
                fontFamily: 'inherit', boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setRejectModal(null); setRejectReason('') }}
                style={{ padding: '9px 18px', borderRadius: 9999, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.textSecondary, fontSize: 13, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => reject(rejectModal)}
                style={{ padding: '9px 18px', borderRadius: 9999, border: 'none', background: colors.riskRed, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Confirm rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message template modal */}
      {messageModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setMessageModal(null)}>
          <div
            style={{ background: colors.surface, borderRadius: 16, padding: 28, width: 560, boxShadow: shadow.lg, maxHeight: '80vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 17, fontWeight: 700, color: colors.text, margin: '0 0 16px' }}>Send message</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {mockMessageTemplates.slice(0, 4).map(t => (
                <button
                  key={t.id}
                  onClick={() => setMessageModal(m => m ? { ...m, templateId: t.id } : null)}
                  style={{
                    padding: '10px 14px', borderRadius: 10, textAlign: 'left',
                    border: `1px solid ${messageModal.templateId === t.id ? colors.primary : colors.border}`,
                    background: messageModal.templateId === t.id ? colors.primaryLight : colors.surface,
                    cursor: 'pointer', fontSize: 13, color: colors.text,
                  }}
                >
                  <strong>{t.name}</strong>
                  <span style={{ color: colors.textMuted, marginLeft: 8 }}>{t.category}</span>
                </button>
              ))}
            </div>
            <div style={{ background: colors.surfaceMuted, borderRadius: 10, padding: '12px 14px', fontSize: 12, color: colors.textSecondary, lineHeight: 1.6, marginBottom: 16, whiteSpace: 'pre-wrap', maxHeight: 180, overflow: 'auto' }}>
              {mockMessageTemplates.find(t => t.id === messageModal.templateId)?.body ?? ''}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setMessageModal(null)} style={{ padding: '9px 18px', borderRadius: 9999, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.textSecondary, fontSize: 13, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => setMessageModal(null)} style={{ padding: '9px 18px', borderRadius: 9999, border: 'none', background: colors.primary, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Send message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Local helpers ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: LocalStatus }) {
  const config: Record<LocalStatus, { bg: string; color: string; label: string }> = {
    pending: { bg: colors.statusPendingBg, color: colors.statusPending, label: 'Pending review' },
    accepted: { bg: colors.statusAcceptedBg, color: colors.statusAccepted, label: '✓ Accepted' },
    rejected: { bg: colors.statusRejectedBg, color: colors.statusRejected, label: 'Rejected' },
    intake_sent: { bg: colors.primaryLight, color: colors.primary, label: '📋 Intake sent' },
  }
  const c = config[status]
  return (
    <span style={{ fontSize: 11, background: c.bg, color: c.color, borderRadius: 9999, padding: '2px 9px', fontWeight: 600 }}>
      {c.label}
    </span>
  )
}

function IntakeFormStatusBadge({ status }: { status: string }) {
  if (status === 'completed') return <span style={{ fontSize: 11, background: colors.riskGreenBg, color: colors.riskGreen, borderRadius: 9999, padding: '2px 8px', fontWeight: 600 }}>Intake completed</span>
  if (status === 'sent') return <span style={{ fontSize: 11, background: colors.primaryLight, color: colors.primary, borderRadius: 9999, padding: '2px 8px', fontWeight: 600 }}>Intake sent</span>
  return <span style={{ fontSize: 11, background: colors.surfaceMuted, color: colors.textMuted, borderRadius: 9999, padding: '2px 8px', fontWeight: 600 }}>Intake not sent</span>
}

function ActionBtn({ children, onClick, primary = false, danger = false }: { children: React.ReactNode; onClick: () => void; primary?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px', borderRadius: 9999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        background: primary ? colors.primary : danger ? colors.riskRedBg : colors.surfaceMuted,
        color: primary ? '#fff' : danger ? colors.riskRed : colors.text,
        border: `1px solid ${primary ? colors.primary : danger ? colors.riskRedBorder : colors.border}`,
      }}
    >
      {children}
    </button>
  )
}

function SCard({ label, value, icon, color, bg }: { label: string; value: number; icon: string; color: string; bg: string }) {
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

declare module '../theme' {
  interface ColorMap {
    primaryDark: string
    primaryMid: string
  }
}
