import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Spin, message, Space } from 'antd'
import { TeamOutlined, BookOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons'
import { getSheikhDashboard } from '../../api/dashboardApi'
import { useAuth } from '../../store/authStore.jsx'

const SheikhDashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const res = await getSheikhDashboard()
                setData(res.data)
            } catch {
                message.error('Failed to load dashboard')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    const getGradeColor = (grade) => {
        if (grade >= 9) return 'green'
        if (grade >= 7) return 'blue'
        if (grade >= 5) return 'orange'
        return 'red'
    }

    const recentColumns = [
        {
            title: 'Student',
            dataIndex: 'studentName',
            key: 'studentName',
            render: (name) => <strong>{name}</strong>
        },
        {
            title: 'Date',
            dataIndex: 'sessionDate',
            key: 'sessionDate',
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            render: (grade) => (
                <Tag color={getGradeColor(grade)}>{grade}/10</Tag>
            )
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
                <h2 style={{ margin: 0 }}>Welcome, {user?.username} 👋</h2>
                <p style={{ margin: 0, color: '#888' }}>Your teaching overview</p>
            </div>

            {/* Stat Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="My Students"
                            value={data?.totalStudents || 0}
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="My Halqas"
                            value={data?.totalHalqas || 0}
                            prefix={<BookOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Attendance Rate"
                            value={data?.attendanceRateThisMonth || 0}
                            suffix="%"
                            prefix={<CalendarOutlined style={{ color: '#eb2f96' }} />}
                            valueStyle={{
                                color: data?.attendanceRateThisMonth >= 75 ? '#52c41a' : '#ff4d4f'
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending Homework"
                            value={data?.pendingHomeworkCount || 0}
                            prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent Tasmee Sessions */}
            <Card title="🎤 Recent Tasmee Sessions">
                <Table
                    columns={recentColumns}
                    dataSource={data?.recentTasmeeSessions || []}
                    rowKey="id"
                    pagination={false}
                    locale={{ emptyText: 'No sessions recorded yet' }}
                />
            </Card>
        </div>
    )
}

export default SheikhDashboard