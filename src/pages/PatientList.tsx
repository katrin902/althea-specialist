import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { colors } from '../theme'
import { mockPatients } from '../data/mockData'
import { RiskBadge } from '../components/RiskBadge'

export function PatientList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'red' | 'yellow' | 'green'>('all')
  const [search, setSearch] = useState('')

  const filtered = mockPatients.filter(p => {
    const matchRisk = filter === 'all' || p.riskLevel === filter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchRisk && matchSearch
  })

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>Patients</h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4 }}>
          {mockPatients.length} assigned patients
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name..."
          style={{
            padding: '10px 14px',
            borderRadius: 9999,
            border: `1px solid ${colors.border}`,
            fontSize: 14,
            color: colors.text,
            background: colors.surface,
            outline: 'none',
            minWidth: 200,
          }}
        />
        {(['all', 'red', 'yellow', 'green'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: 9999,
              border: `1.5px solid ${filter === f ? colors.primary : colors.border}`,
              background: filter === f ? colors.primaryLight : colors.surface,
              color: filter === f ? colors.primary : colors.textSecondary,
              fontWeight: filter === f ? 600 : 400,
              fontSize: 13,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? 'All' : `${f === 'red' ? 'High' : f === 'yellow' ? 'Medium' : 'Low'} risk`}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(patient => (
          <div
            key={patient.id}
            onClick={() => navigate(`/patients/${patient.id}`)}
            style={{
              background: colors.surface,
              borderRadius: 14,
              border: `1px solid ${patient.riskLevel === 'red' ? colors.riskRedBorder : colors.border}`,
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              cursor: 'pointer',
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,26,46,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            {patient.riskLevel === 'red' && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 4,
                background: colors.riskRed,
                borderRadius: '14px 0 0 14px',
              }} />
            )}
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: colors.primaryLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: colors.primary,
              flexShrink: 0,
            }}>
              {patient.name.split(' ').map(n => n[0]).slice(0,2).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{patient.name}</span>
                <RiskBadge level={patient.riskLevel} size="sm" />
                {patient.riskAlerts.some(a => !a.acknowledged) && (
                  <span style={{
                    background: colors.riskRedBg,
                    color: colors.riskRed,
                    borderRadius: 9999,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontWeight: 700,
                    border: `1px solid ${colors.riskRedBorder}`,
                  }}>
                    Alert
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
                {patient.age} · {patient.city} · {patient.status}
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                Symptoms: {patient.mainSymptoms.slice(0, 3).join(', ')}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Last check-in</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 12, color: colors.primary }}>M: {patient.lastCheckIn.mood}</span>
                <span style={{ fontSize: 12, color: colors.riskYellow }}>A: {patient.lastCheckIn.anxiety}</span>
                <span style={{ fontSize: 12, color: colors.riskGreen }}>S: {patient.lastCheckIn.sleep}</span>
              </div>
              {patient.lastCheckIn.unsafeFlag && (
                <div style={{ fontSize: 11, color: colors.riskRed, fontWeight: 600, marginTop: 4 }}>
                  ⚠ Unsafe flag
                </div>
              )}
            </div>
            <span style={{ color: colors.primary, fontWeight: 600, fontSize: 14 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  )
}
