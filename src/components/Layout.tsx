import React, { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { colors } from '../theme'
import { mockPatients } from '../data/mockData'

interface Props {
  children: ReactNode
  specialist: { name: string; role: string; institution: string }
}

interface NavItem {
  path: string
  label: string
  icon: string
  badge?: number
}

export function Layout({ children, specialist }: Props) {
  const unacknowledgedAlerts = mockPatients.flatMap(p => p.riskAlerts).filter(a => !a.acknowledged).length
  const pendingRequests = mockPatients.filter(p => p.category === 'request' && p.requestStatus === 'pending').length

  const topNavItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { path: '/current-patients', label: 'Current Patients', icon: '👤' },
    { path: '/waiting-patients', label: 'Waiting Patients', icon: '⏳' },
    { path: '/patient-requests', label: 'Patient Requests', icon: '📋', badge: pendingRequests },
  ]

  const bottomNavItems: NavItem[] = [
    { path: '/alerts', label: 'Risk Alerts', icon: '⚠', badge: unacknowledgedAlerts },
    { path: '/appointments', label: 'Appointments', icon: '📅' },
    { path: '/messages', label: 'Messages', icon: '✉' },
    { path: '/analytics', label: 'Analytics', icon: '📊' },
  ]

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: 232, background: colors.sidebar, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: '22px 20px 18px', borderBottom: `1px solid ${colors.sidebarBorder}` }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: colors.primary, letterSpacing: -0.5 }}>AltHea</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: '0.02em' }}>Specialist Dashboard</div>
        </div>

        {/* Top nav */}
        <nav style={{ padding: '12px 10px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px 6px' }}>
            Patients
          </div>
          {topNavItems.map(item => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Divider */}
        <div style={{ margin: '4px 14px', borderTop: `1px solid ${colors.sidebarBorder}` }} />

        {/* Bottom nav */}
        <nav style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px 6px' }}>
            Tools
          </div>
          {bottomNavItems.map(item => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Specialist info */}
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${colors.sidebarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: colors.primaryLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: colors.primary, flexShrink: 0,
            }}>
              {specialist.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.white, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {specialist.name}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{specialist.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', background: colors.background }}>
        {children}
      </main>
    </div>
  )
}

function NavItem({ item }: { item: { path: string; label: string; icon: string; badge?: number } }) {
  return (
    <NavLink
      to={item.path}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '9px 10px',
        borderRadius: 8,
        textDecoration: 'none',
        fontSize: 13.5,
        fontWeight: isActive ? 600 : 400,
        color: isActive ? colors.white : colors.sidebarText,
        background: isActive ? colors.sidebarActiveBg : 'transparent',
      })}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        if (!el.classList.contains('active')) el.style.background = colors.sidebarHover
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        if (!el.classList.contains('active')) el.style.background = 'transparent'
      }}
    >
      <span style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span style={{
          background: item.path.includes('alerts') ? colors.riskRed : colors.primary,
          color: colors.white,
          borderRadius: 9999,
          padding: '1px 7px',
          fontSize: 11,
          fontWeight: 700,
          minWidth: 18,
          textAlign: 'center',
        }}>
          {item.badge}
        </span>
      )}
    </NavLink>
  )
}
