import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Typography } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
    DashboardOutlined,
    TeamOutlined,
    UserOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    BookOutlined,
    CalendarOutlined
} from '@ant-design/icons'
import { useAuth } from '../../store/authStore.jsx'
import logo from '../../assets/logo.png'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const getMenuItems = () => {
        const adminItems = [
            {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
            },
            {
                key: '/sheikhs',
                icon: <UserOutlined />,
                label: 'Sheikhs',
            },
            {
                key: '/halqas',
                icon: <BookOutlined />,
                label: 'Halqas',
            },
            {
                key: '/students',
                icon: <TeamOutlined />,
                label: 'Students',
            },
            {
                key: '/attendance',
                icon: <CalendarOutlined />,
                label: 'Attendance',
            },
        ]

        const sheikhItems = [
            {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
            },
            {
                key: '/halqas',
                icon: <BookOutlined />,
                label: 'My Halqas',
            },
            {
                key: '/attendance',
                icon: <CalendarOutlined />,
                label: 'Attendance',
            },
        ]

        const studentItems = [
            {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
            },
            {
                key: '/my-profile',
                icon: <UserOutlined />,
                label: 'My Profile',
            },
        ]

        if (user?.role === 'ADMIN') return adminItems
        if (user?.role === 'SHEIKH') return sheikhItems
        if (user?.role === 'STUDENT') return studentItems
        return []
    }

    const handleMenuClick = ({ key }) => {
        navigate(key)
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const userMenuItems = [
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
        },
    ]

    return (
        <Layout style={{ minHeight: '100vh' }}>

            {/* ── Sidebar ── */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                theme="light"
                style={{
                    boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
                }}
            >
                {/* Logo area */}
                <div style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: '8px'
                }}>
                    <img
                        src={logo}
                        alt="Quran Center"
                        style={{ width: collapsed ? '40px' : '80px', transition: 'width 0.2s' }}
                    />
                    {!collapsed && (
                        <Text strong style={{ display: 'block', marginTop: '8px', fontSize: '13px' }}>
                            Quran Center
                        </Text>
                    )}
                </div>

                {/* Navigation menu */}
                <Menu
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={getMenuItems()}
                    onClick={handleMenuClick}
                    style={{ border: 'none' }}
                />
            </Sider>

            {/* ── Main area ── */}
            <Layout>

                {/* Header */}
                <Header style={{
                    background: '#fff',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                    {/* Collapse button */}
                    <div
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '18px', cursor: 'pointer', color: '#666' }}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>

                    {/* User avatar + dropdown */}
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                            <div style={{ lineHeight: '1.3' }}>
                                <Text strong style={{ display: 'block', fontSize: '14px' }}>
                                    {user?.username}
                                </Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {user?.role}
                                </Text>
                            </div>
                        </div>
                    </Dropdown>
                </Header>

                {/* Page content */}
                <Content style={{
                    margin: '24px',
                    padding: '24px',
                    background: '#fff',
                    borderRadius: '8px',
                    minHeight: '360px',
                }}>
                    <Outlet />
                </Content>

            </Layout>
        </Layout>
    )
}

export default AppLayout