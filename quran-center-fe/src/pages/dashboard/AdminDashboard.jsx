import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Spin, message } from 'antd'
import { TeamOutlined, UserOutlined, BookOutlined, CalendarOutlined } from '@ant-design/icons'
import { getAdminDashboard } from '../../api/dashboardApi'

const AdminDashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const res = await getAdminDashboard()
                setData(res.data)
            } catch {
                message.error('Failed to load dashboard')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    const scheduleColumns = [
        {
            title: 'Halqa',
            dataIndex: 'halqaName',
            key: 'halqaName',
            render: (name) => <strong>{name}</strong>
        },
        {
            title: 'Sheikh',
            dataIndex: 'sheikhName',
            key: 'sheikhName',
        },
        {
            title: 'Schedule',
            dataIndex: 'schedule',
            key: 'schedule',
            render: (s) => s || '—'
        },
        {
            title: 'Students',
            dataIndex: 'studentCount',
            key: 'studentCount',
            render: (count) => <Tag color="blue">{count} students</Tag>
        },
    ]

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
        </div>
    )

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
                <p style={{ margin: 0, color: '#888' }}>Overview of the entire center</p>
            </div>

            {/* Stat Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Students"
                            value={data?.totalStudents || 0}
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Sheikhs"
                            value={data?.totalSheikhs || 0}
                            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Halqas"
                            value={data?.totalHalqas || 0}
                            prefix={<BookOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Attendance Rate (This Month)"
                            value={data?.attendanceRateThisMonth || 0}
                            suffix="%"
                            prefix={<CalendarOutlined style={{ color: '#eb2f96' }} />}
                            valueStyle={{
                                color: data?.attendanceRateThisMonth >= 75 ? '#52c41a' : '#ff4d4f'
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Today's Schedule */}
            <Card title="📅 Halqas Schedule">
                <Table
                    columns={scheduleColumns}
                    dataSource={data?.todaySchedule || []}
                    rowKey="halqaName"
                    pagination={false}
                    locale={{ emptyText: 'No halqas found' }}
                />
            </Card>
        </div>
    )
}

export default AdminDashboard