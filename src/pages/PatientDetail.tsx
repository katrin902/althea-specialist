import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { colors, shadow } from '../theme'
import { mockPatients } from '../data/mockData'
import { RiskBadge } from '../components/RiskBadge'

type Tab = 'overview' | 'intake' | 'checkins' | 'documents' | 'notes'

export function PatientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const patient = mockPatients.find(p => p.id === id)
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [notes, setNotes] = useState(patient?.privateNotes ?? '')
  const [noteSaved, setNoteSaved] = useState(false)
  const [handoverOpen, setHandoverOpen] = useState(false)
  const [handoverNote, setHandoverNote] = useState('')
  const [handoverReason, setHandoverReason] = useState('')
  const [handoverTo, setHandoverTo] = useState('')

  if (!patient) {
    return <div style={{ padding: 32 }}><p style={{ color: colors.textSecondary }}>Patient not found.</p></div>
  }

  function saveNotes() {
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'intake', label: 'Intake summary' },
    { id: 'checkins', label: 'Check-ins' },
    { id: 'documents', label: 'Documents' },
    { id: 'notes', label: 'Notes & Audit' },
  ]

  const hasAlert = patient.riskAlerts.some(a => !a.acknowledged)

  // Back destination based on category
  const backPath = patient.category === 'current' ? '/current-patients'
    : patient.category === 'waiting' ? '/waiting-patients'
    : '/patient-requests'
  const backLabel = patient.category === 'current' ? '← Current Patients'
    : patient.category === 'waiting' ? '← Waiting Patients'
    : '← Patient Requests'

  return (
    <div style={{ padding: '24px 32px 48px', background: colors.background, minHeight: '100vh' }}>
      {/* Back */}
      <button
        onClick={() => navigate(backPath)}
        style={{ background: 'none', border: 'none', color: colors.primary, fontSize: 13, cursor: 'pointer', marginBottom: 18, fontWeight: 500, padding: 0 }}
      >
        {backLabel}
      </button>

      {/* Alert banner */}
      {hasAlert && (
        <div style={{
          background: colors.riskRedBg, border: `1px solid ${colors.riskRedBorder}`,
          borderLeft: `4px solid ${colors.riskRed}`,
          borderRadius: 12, padding: '12px 18px', marginBottom: 18,
          display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: colors.riskRed, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, flexShrink: 0 }}>⚠</div>
          <div style={{ flex: 1 }}>
            <strong style={{ color: colors.riskRedText, fontSize: 13, display: 'block', marginBottom: 4 }}>Active risk alert</strong>
            {patient.riskAlerts.filter(a => !a.acknowledged).map(alert => (
              <div key={alert.id}>
                <p style={{ fontSize: 13, color: colors.riskRedText, margin: '0 0 3px', lineHeight: 1.5 }}>{alert.summary}</p>
                <p style={{ fontSize: 12, color: colors.riskRedText, margin: 0, fontStyle: 'italic' }}>
                  Trigger: "{alert.triggerMessage}" — {alert.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Hero section ── */}
      <div style={{
        background: colors.surface, borderRadius: 18,
        border: `1px solid ${hasAlert ? colors.riskRedBorder : colors.border}`,
        boxShadow: shadow.sm, padding: '22px 26px', marginBottom: 22,
        display: 'flex', gap: 22, alignItems: 'flex-start',
      }}>
        {/* Avatar */}
        <div style={{
          width: 68, height: 68, borderRadius: '50%',
          background: hasAlert ? colors.riskRedBg : colors.primaryLight,
          border: `3px solid ${hasAlert ? colors.riskRedBorder : colors.primaryLight}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 800,
          color: hasAlert ? colors.riskRed : colors.primary, flexShrink: 0,
        }}>
          {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: colors.text, margin: 0 }}>{patient.name}</h1>
            <RiskBadge level={patient.riskLevel} size="md" />
            <CategoryBadge category={patient.category} />
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 10 }}>
            <MetaItem label="Age" value={`${patient.age}`} />
            <MetaItem label="City" value={patient.city} />
            <MetaItem label="Language" value={patient.language} />
            <MetaItem label="Insurance" value={patient.insuranceType} />
            <MetaItem label="Status" value={patient.status} />
            <MetaItem label="Provider" value={patient.selectedProvider} />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {patient.mainSymptoms.map(s => (
              <span key={s} style={{ background: colors.surfaceMuted, borderRadius: 9999, padding: '3px 11px', fontSize: 12, color: colors.textSecondary, border: `1px solid ${colors.borderLight}` }}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <button style={primaryBtn}>Propose appointment</button>
          <button style={outlineBtn}>Send message</button>
          {patient.category !== 'request' && (
            <button
              onClick={() => setHandoverOpen(true)}
              style={{ ...outlineBtn, fontSize: 12, padding: '8px 14px' }}
            >
              Reassign patient
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: `2px solid ${colors.border}` }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '9px 18px', background: 'none', border: 'none',
              borderBottom: activeTab === tab.id ? `2px solid ${colors.primary}` : '2px solid transparent',
              color: activeTab === tab.id ? colors.primary : colors.textSecondary,
              fontWeight: activeTab === tab.id ? 700 : 400,
              fontSize: 13.5, cursor: 'pointer', marginBottom: -2,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <Card title="Latest check-in" badge={patient.lastCheckIn.date}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {patient.lastCheckIn.unsafeFlag && (
                  <div style={{ background: colors.riskRedBg, border: `1px solid ${colors.riskRedBorder}`, borderRadius: 8, padding: '7px 10px', fontSize: 12, color: colors.riskRedText, fontWeight: 600 }}>⚠ Patient marked as feeling unsafe</div>
                )}
                <ScoreBar label="Mood" value={patient.lastCheckIn.mood} color={colors.primary} />
                <ScoreBar label="Anxiety" value={patient.lastCheckIn.anxiety} color={colors.riskYellow} invert />
                <ScoreBar label="Stress" value={patient.lastCheckIn.stress} color={colors.riskRed} invert />
                <ScoreBar label="Sleep" value={patient.lastCheckIn.sleep} color={colors.riskGreen} />
                {patient.lastCheckIn.note && <p style={{ fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', margin: '4px 0 0', lineHeight: 1.5 }}>"{patient.lastCheckIn.note}"</p>}
              </div>
            </Card>

            <Card title="Risk & safety">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                <RiskBadge level={patient.riskLevel} size="lg" />
                <div style={{ height: 1, background: colors.borderLight }} />
                <InfoRow label="Unsafe flag" value={patient.lastCheckIn.unsafeFlag ? '⚠ Yes' : 'No'} valueColor={patient.lastCheckIn.unsafeFlag ? colors.riskRed : colors.riskGreen} />
                <InfoRow label="Active alerts" value={patient.riskAlerts.filter(a => !a.acknowledged).length > 0 ? `${patient.riskAlerts.filter(a => !a.acknowledged).length} open` : 'None'} valueColor={patient.riskAlerts.filter(a => !a.acknowledged).length > 0 ? colors.riskRed : colors.riskGreen} />
                <InfoRow label="Referral" value={patient.referralStatus} />
                <InfoRow label="Specialist" value={patient.assignedSpecialist || 'Not assigned'} />
              </div>
            </Card>

            <Card title="Upcoming appointment">
              {patient.upcomingAppointment ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: colors.text, margin: 0 }}>{patient.upcomingAppointment.date}</p>
                  <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>{patient.upcomingAppointment.time} · {patient.upcomingAppointment.type}</p>
                  <p style={{ fontSize: 12, color: colors.textMuted, margin: 0 }}>{patient.upcomingAppointment.location}</p>
                  <span style={{
                    display: 'inline-block', marginTop: 3, padding: '3px 10px', borderRadius: 9999, fontSize: 12, fontWeight: 600,
                    background: patient.upcomingAppointment.status === 'confirmed' ? colors.riskGreenBg : colors.riskYellowBg,
                    color: patient.upcomingAppointment.status === 'confirmed' ? colors.riskGreen : colors.riskYellow,
                  }}>
                    {patient.upcomingAppointment.status}
                  </span>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>No appointment scheduled.</p>
                  <button style={primaryBtn}>Propose appointment</button>
                </div>
              )}
            </Card>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card title="Mood trends" badge="Last check-ins">
              <MoodSparkline checkIns={patient.checkInHistory} />
            </Card>
            <Card title="AI intake summary" badge="Patient-approved">
              <div style={{ background: colors.primaryLight, borderRadius: 8, padding: '7px 10px', fontSize: 11, color: colors.primaryDark, marginBottom: 10 }}>
                Generated by Althea · approved by patient · not a diagnosis
              </div>
              <p style={{ fontSize: 13, color: colors.text, lineHeight: 1.7, margin: 0 }}>
                {patient.intakeSummary.split('\n').slice(0, 6).join(' ').replace(/\*\*/g, '').slice(0, 230)}…
              </p>
              <button onClick={() => setActiveTab('intake')} style={{ ...outlineBtn, marginTop: 10, fontSize: 12, padding: '6px 14px' }}>
                Read full →
              </button>
            </Card>
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card title="Patient journey">
              <TimelineItem done label="Intake completed" sub="Intake chat + summary approved" />
              <TimelineItem done label="Referral uploaded" sub={`Uploaded ${patient.documents[0]?.uploadedAt ?? '—'}`} />
              <TimelineItem done={!!patient.upcomingAppointment} label="First appointment" sub={patient.upcomingAppointment ? `${patient.upcomingAppointment.date} · ${patient.upcomingAppointment.status}` : 'Not yet scheduled'} />
              <TimelineItem done={false} label="Treatment started" sub="Pending first appointment" last />
            </Card>

            <Card title="Open tasks">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {patient.riskAlerts.some(a => !a.acknowledged) && <TaskPill text="Acknowledge risk alert" urgent />}
                {!patient.upcomingAppointment && <TaskPill text="Schedule first appointment" urgent />}
                {patient.upcomingAppointment?.status === 'proposed' && <TaskPill text="Confirm proposed appointment" />}
                <TaskPill text="Review intake before session" />
                {!patient.riskAlerts.some(a => !a.acknowledged) && patient.upcomingAppointment && patient.upcomingAppointment.status !== 'proposed' && (
                  <p style={{ fontSize: 13, color: colors.riskGreen, fontWeight: 600, margin: 0 }}>✓ No urgent actions</p>
                )}
              </div>
            </Card>
          </div>

          {/* Row 4 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card title="Documents" badge={`${patient.documents.length} file${patient.documents.length !== 1 ? 's' : ''}`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {patient.documents.slice(0, 3).map(doc => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 8, background: colors.surfaceMuted }}>
                    <span style={{ fontSize: 18 }}>📄</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: colors.text, margin: 0 }}>{doc.name}</p>
                      <p style={{ fontSize: 11, color: colors.textMuted, margin: '1px 0 0' }}>{doc.type} · {doc.size}</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => setActiveTab('documents')} style={{ ...outlineBtn, fontSize: 12, padding: '6px 14px' }}>View all →</button>
              </div>
            </Card>

            <Card title="Private notes preview" badge="Only you">
              {patient.privateNotes ? (
                <div>
                  <p style={{ fontSize: 13, color: colors.text, lineHeight: 1.6, margin: '0 0 10px', fontStyle: 'italic' }}>"{patient.privateNotes}"</p>
                  <button onClick={() => setActiveTab('notes')} style={{ ...outlineBtn, fontSize: 12, padding: '6px 14px' }}>Edit notes →</button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 10 }}>No private notes yet.</p>
                  <button onClick={() => setActiveTab('notes')} style={primaryBtn}>Add note</button>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── Intake ── */}
      {activeTab === 'intake' && (
        <div style={{ background: colors.surface, borderRadius: 14, padding: 26, border: `1px solid ${colors.border}`, boxShadow: shadow.sm }}>
          <div style={{ background: colors.primaryLight, borderRadius: 8, padding: '9px 14px', marginBottom: 18, fontSize: 13, color: colors.primaryDark }}>
            This summary was generated by Althea and approved by the patient. It is a starting point — not a diagnosis.
          </div>
          <div style={{ fontSize: 14, color: colors.text, lineHeight: 1.9, whiteSpace: 'pre-line' }}>
            {patient.intakeSummary.replace(/\*\*(.*?)\*\*/g, '$1')}
          </div>
        </div>
      )}

      {/* ── Check-ins ── */}
      {activeTab === 'checkins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {patient.checkInHistory.slice().reverse().map((ci, i) => (
            <div key={i} style={{ background: colors.surface, borderRadius: 13, padding: '16px 20px', border: `1px solid ${ci.unsafeFlag ? colors.riskRedBorder : colors.border}`, boxShadow: shadow.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong style={{ fontSize: 14, color: colors.text }}>{ci.date}</strong>
                {ci.unsafeFlag && <span style={{ fontSize: 12, color: colors.riskRed, fontWeight: 700, background: colors.riskRedBg, padding: '3px 10px', borderRadius: 9999 }}>⚠ Unsafe</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: ci.note ? 12 : 0 }}>
                <ScoreBar label="Mood" value={ci.mood} color={colors.primary} />
                <ScoreBar label="Anxiety" value={ci.anxiety} color={colors.riskYellow} invert />
                <ScoreBar label="Stress" value={ci.stress} color={colors.riskRed} invert />
                <ScoreBar label="Sleep" value={ci.sleep} color={colors.riskGreen} />
              </div>
              {ci.note && <p style={{ fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', margin: 0 }}>"{ci.note}"</p>}
            </div>
          ))}
        </div>
      )}

      {/* ── Documents ── */}
      {activeTab === 'documents' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {patient.documents.map(doc => (
            <div key={doc.id} style={{ background: colors.surface, borderRadius: 12, padding: 16, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 11, background: colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📄</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: colors.text, margin: 0 }}>{doc.name}</p>
                <p style={{ fontSize: 12, color: colors.textSecondary, margin: '3px 0 0' }}>{doc.type} · {doc.size} · Uploaded {doc.uploadedAt}</p>
              </div>
              <button style={{ ...primaryBtn, padding: '8px 16px', fontSize: 13 }}>Download</button>
            </div>
          ))}
        </div>
      )}

      {/* ── Notes & Audit ── */}
      {activeTab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Private notes */}
          <div>
            <SectionLabel>Private notes</SectionLabel>
            <div style={{ background: colors.riskYellowBg, border: `1px solid ${colors.riskYellowBorder}`, borderRadius: 9, padding: 12, fontSize: 13, color: '#7A4F00', marginBottom: 12 }}>
              Private notes are only visible to you and your team. Never shared with the patient.
            </div>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={7}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 11, border: `1px solid ${colors.border}`, fontSize: 14, color: colors.text, background: colors.surface, resize: 'vertical', lineHeight: 1.6, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              placeholder="Add your private clinical notes here..."
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button onClick={saveNotes} style={primaryBtn}>
                {noteSaved ? 'Saved ✓' : 'Save notes'}
              </button>
            </div>
          </div>

          {/* Handover notes */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <SectionLabel>Handover notes</SectionLabel>
              <button
                onClick={() => setHandoverOpen(!handoverOpen)}
                style={{ background: colors.primaryLight, color: colors.primary, border: 'none', borderRadius: 9999, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                + Add handover
              </button>
            </div>
            {handoverOpen && (
              <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 4 }}>Transfer to specialist</label>
                    <input value={handoverTo} onChange={e => setHandoverTo(e.target.value)} placeholder="Dr. Name" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: colors.textMuted, display: 'block', marginBottom: 4 }}>Reason for transfer</label>
                    <input value={handoverReason} onChange={e => setHandoverReason(e.target.value)} placeholder="e.g. Specialist mismatch" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <textarea
                  value={handoverNote}
                  onChange={e => setHandoverNote(e.target.value)}
                  rows={4}
                  placeholder="Clinical notes for the receiving specialist…"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1px solid ${colors.border}`, fontSize: 13, color: colors.text, resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 10 }}
                />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => setHandoverOpen(false)} style={{ ...outlineBtn, fontSize: 12, padding: '7px 14px' }}>Cancel</button>
                  <button onClick={() => { setHandoverOpen(false); setHandoverNote(''); setHandoverTo(''); setHandoverReason('') }} style={{ ...primaryBtn, fontSize: 12, padding: '7px 14px' }}>Save handover note</button>
                </div>
              </div>
            )}
            {patient.handoverNotes && patient.handoverNotes.length > 0 ? (
              patient.handoverNotes.map(h => (
                <div key={h.id} style={{ background: colors.surfaceMuted, borderRadius: 10, padding: '12px 14px', border: `1px solid ${colors.borderLight}`, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>{h.date}</div>
                  <div style={{ fontSize: 13, color: colors.text }}><strong>{h.fromSpecialist}</strong> → <strong>{h.toSpecialist}</strong></div>
                  <div style={{ fontSize: 12, color: colors.textSecondary }}>Reason: {h.reason}</div>
                  <p style={{ fontSize: 13, color: colors.text, margin: '6px 0 0', lineHeight: 1.5 }}>{h.note}</p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 13, color: colors.textMuted }}>No handover notes for this patient.</p>
            )}
          </div>

          {/* Audit log */}
          <div>
            <SectionLabel>Access & audit log</SectionLabel>
            <div style={{ background: colors.surfaceMuted, borderRadius: 10, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: colors.textMuted }}>
              Privacy-focused audit trail showing who accessed or modified this patient's data.
            </div>
            {patient.auditLog && patient.auditLog.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, overflow: 'hidden' }}>
                {patient.auditLog.map((entry, i) => (
                  <div key={entry.id} style={{ padding: '11px 16px', borderBottom: i < patient.auditLog!.length - 1 ? `1px solid ${colors.borderLight}` : 'none', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.primary, marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{entry.action}</span>
                        <span style={{ fontSize: 11, color: colors.textMuted }}>· {entry.actor}</span>
                      </div>
                      <p style={{ fontSize: 12, color: colors.textSecondary, margin: 0 }}>{entry.details}</p>
                    </div>
                    <span style={{ fontSize: 11, color: colors.textMuted, flexShrink: 0 }}>{entry.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 13, color: colors.textMuted }}>No audit entries found.</p>
            )}
          </div>
        </div>
      )}

      {/* Handover modal (from hero button) */}
      {handoverOpen && activeTab !== 'notes' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setHandoverOpen(false)}>
          <div style={{ background: colors.surface, borderRadius: 16, padding: 28, width: 480, boxShadow: shadow.lg }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: colors.text, margin: '0 0 16px' }}>Reassign / Handover</h2>
            <p style={{ fontSize: 13, color: colors.textSecondary, margin: '0 0 16px' }}>Transfer this patient to another specialist and add a clinical handover note.</p>
            <button onClick={() => { setActiveTab('notes'); setHandoverOpen(false) }} style={{ ...primaryBtn, width: '100%' }}>
              Go to Notes & Handover tab
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Sub-components ── */

function Card({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: colors.surface, borderRadius: 14, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>{title}</h3>
        {badge && <span style={{ fontSize: 11, color: colors.textMuted, background: colors.surfaceMuted, borderRadius: 9999, padding: '2px 8px' }}>{badge}</span>}
      </div>
      <div style={{ padding: '14px 16px' }}>{children}</div>
    </div>
  )
}

function ScoreBar({ label, value, color, invert = false }: { label: string; value: number; color: string; invert?: boolean }) {
  const displayColor = (() => {
    const eff = invert ? 10 - value : value
    return eff >= 7 ? colors.riskGreen : eff >= 4 ? colors.riskYellow : colors.riskRed
  })()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{ fontSize: 12, color: colors.textSecondary, width: 50, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 5, borderRadius: 9999, background: colors.borderLight, overflow: 'hidden' }}>
        <div style={{ width: `${(value / 10) * 100}%`, height: '100%', background: color, borderRadius: 9999 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: displayColor, width: 18, textAlign: 'right', flexShrink: 0 }}>{value}</span>
    </div>
  )
}

function MoodSparkline({ checkIns }: { checkIns: Array<{ date: string; mood: number; anxiety: number; sleep: number }> }) {
  const W = 280, H = 90, PAD = 12
  const data = checkIns.slice(-5)
  if (data.length < 2) return <p style={{ fontSize: 13, color: colors.textMuted }}>Not enough data yet.</p>
  const n = data.length
  const xs = data.map((_, i) => PAD + (i / (n - 1)) * (W - PAD * 2))
  const yOf = (v: number) => PAD + ((10 - v) / 10) * (H - PAD * 2)
  function line(vals: number[], color: string) {
    const pts = vals.map((v, i) => `${xs[i]},${yOf(v)}`).join(' L ')
    return <path d={`M ${pts}`} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  }
  function dots(vals: number[], color: string) {
    return vals.map((v, i) => <circle key={i} cx={xs[i]} cy={yOf(v)} r={3} fill={color} />)
  }
  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
        {[2, 4, 6, 8, 10].map(v => <line key={v} x1={PAD} x2={W - PAD} y1={yOf(v)} y2={yOf(v)} stroke={colors.borderLight} strokeWidth={1} />)}
        {line(data.map(d => d.mood), colors.primary)}
        {line(data.map(d => d.sleep), colors.riskGreen)}
        {line(data.map(d => d.anxiety), colors.riskYellow)}
        {dots(data.map(d => d.mood), colors.primary)}
        {dots(data.map(d => d.sleep), colors.riskGreen)}
        {dots(data.map(d => d.anxiety), colors.riskYellow)}
        {data.map((d, i) => <text key={i} x={xs[i]} y={H} textAnchor="middle" fontSize={9} fill={colors.textMuted}>{d.date.slice(5)}</text>)}
      </svg>
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        {[{ color: colors.primary, label: 'Mood' }, { color: colors.riskGreen, label: 'Sleep' }, { color: colors.riskYellow, label: 'Anxiety' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 9, height: 9, borderRadius: '50%', background: l.color }} />
            <span style={{ fontSize: 11, color: colors.textSecondary }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TimelineItem({ label, sub, done, last = false }: { label: string; sub: string; done: boolean; last?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 11, paddingBottom: last ? 0 : 14, position: 'relative' }}>
      {!last && <div style={{ position: 'absolute', left: 11, top: 20, width: 2, height: 'calc(100% - 8px)', background: done ? colors.riskGreen : colors.borderLight }} />}
      <div style={{ width: 23, height: 23, borderRadius: '50%', flexShrink: 0, background: done ? colors.riskGreen : colors.borderLight, border: `2px solid ${done ? colors.riskGreen : colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700, zIndex: 1 }}>
        {done ? '✓' : ''}
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: done ? colors.text : colors.textMuted, margin: 0 }}>{label}</p>
        <p style={{ fontSize: 12, color: colors.textMuted, margin: '1px 0 0' }}>{sub}</p>
      </div>
    </div>
  )
}

function TaskPill({ text, urgent = false }: { text: string; urgent?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 11px', borderRadius: 9, background: urgent ? colors.riskRedBg : colors.surfaceMuted, border: `1px solid ${urgent ? colors.riskRedBorder : colors.borderLight}` }}>
      <span style={{ fontSize: 13, color: urgent ? colors.riskRed : colors.textMuted }}>{urgent ? '⚠' : '○'}</span>
      <span style={{ fontSize: 13, color: urgent ? colors.riskRed : colors.text }}>{text}</span>
    </div>
  )
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: colors.textMuted }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: valueColor ?? colors.text }}>{value}</span>
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{value}</div>
    </div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    current: { bg: colors.riskGreenBg, color: colors.riskGreen, label: 'Current' },
    waiting: { bg: colors.statusWaitingBg, color: colors.statusWaiting, label: 'Waiting' },
    request: { bg: colors.primaryLight, color: colors.primary, label: 'Request' },
  }
  const c = config[category] ?? config.current
  return (
    <span style={{ fontSize: 12, background: c.bg, color: c.color, borderRadius: 9999, padding: '3px 10px', fontWeight: 600 }}>
      {c.label}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
      {children}
    </div>
  )
}

const primaryBtn: React.CSSProperties = {
  background: colors.primary, color: '#fff',
  border: 'none', borderRadius: 9999,
  padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
}

const outlineBtn: React.CSSProperties = {
  background: 'none', color: colors.primary,
  border: `1.5px solid ${colors.primary}`,
  borderRadius: 9999, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
}

declare module '../theme' {
  interface ColorMap {
    primaryDark: string
  }
}
