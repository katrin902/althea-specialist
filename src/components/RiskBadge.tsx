import React from 'react'
import { colors } from '../theme'
import type { RiskLevel } from '../data/mockData'

interface Props {
  level: RiskLevel
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const config = {
  green: {
    bg: colors.riskGreenBg,
    border: colors.riskGreenBorder,
    color: colors.riskGreen,
    label: 'Low risk',
  },
  yellow: {
    bg: colors.riskYellowBg,
    border: colors.riskYellowBorder,
    color: colors.riskYellow,
    label: 'Medium risk',
  },
  red: {
    bg: colors.riskRedBg,
    border: colors.riskRedBorder,
    color: colors.riskRed,
    label: 'High risk',
  },
}

export function RiskBadge({ level, size = 'md', showLabel = true }: Props) {
  const c = config[level]
  const dotSize = size === 'sm' ? 7 : size === 'md' ? 9 : 11
  const fontSize = size === 'sm' ? 11 : size === 'md' ? 12 : 13
  const padding = size === 'sm' ? '2px 8px' : '4px 10px'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 9999,
        padding,
        fontSize,
        fontWeight: 600,
        color: c.color,
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: c.color,
          display: 'inline-block',
          flexShrink: 0,
          opacity: 0.85,
        }}
      />
      {showLabel && c.label}
    </span>
  )
}
