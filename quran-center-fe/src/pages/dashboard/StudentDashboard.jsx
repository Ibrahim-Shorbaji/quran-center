import { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Tag, Spin, message } from 'antd'
import { CalendarOutlined, FileTextOutlined, StarOutlined, BookOutlined } from '@ant-design/icons'
import { getStudentDashboard } from '../../api/dashboardApi'
import { useAuth } from '../../store/authStore.jsx'

const StudentDashboard = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const res = await getStudentDashboard()
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

    const getGradeLabel = (grade) => {
        if (grade >= 9) return 'Excellent'
        if (grade >= 7) return 'Good'
        if (grade >= 5) return 'Acceptable'
        return 'Weak'
    }

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
        </div>
    )

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>Welcome, {user?.username} 👋</h2>
                <p style={{ margin: 0, color: '#888' }}>Your learning overview</p>
            </div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="My Halqa"
                            value={data?.halqaName || 'Not assigned'}
                            prefix={<BookOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff', fontSize: '18px' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Attendance Rate"
                            value={data?.attendanceRate || 0}
                            suffix="%"
                            prefix={<CalendarOutlined style={{ color: '#eb2f96' }} />}
                            valueStyle={{
                                color: data?.attendanceRate >= 75 ? '#52c41a' : '#ff4d4f'
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
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <div style={{ marginBottom: '8px', color: '#888', fontSize: '14px' }}>
                            Last Tasmee Grade
                        </div>
                        {data?.lastTasmeeGrade != null ? (
                            <div>
                                <Tag
                                    color={getGradeColor(data.lastTasmeeGrade)}
                                    style={{ fontSize: '20px', padding: '4px 12px' }}
                                >
                                    {data.lastTasmeeGrade}/10
                                </Tag>
                                <div style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
                                    {getGradeLabel(data.lastTasmeeGrade)} • {data.lastTasmeeDate}
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: '#bbb' }}>No sessions yet</div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default StudentDashboard