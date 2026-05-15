import { useState, useEffect } from 'react'
import { Card, Tabs, Descriptions, Tag, Table, Space, message, Spin } from 'antd'
import { getMyProfile } from '../../api/authApi'
import { getReportsByStudent } from '../../api/tasmeeApi'
import { getHomeworkByStudent } from '../../api/homeworkApi'
import { getAttendanceByStudent } from '../../api/attendanceApi'

const StudentPortalPage = () => {
    const [profile, setProfile] = useState(null)
    const [reports, setReports] = useState([])
    const [homeworks, setHomeworks] = useState([])
    const [attendance, setAttendance] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const profileRes = await getMyProfile()
                setProfile(profileRes.data)

                const [reportsRes, homeworkRes, attendanceRes] = await Promise.all([
                    getReportsByStudent(profileRes.data.id),
                    getHomeworkByStudent(profileRes.data.id),
                    getAttendanceByStudent(profileRes.data.id)
                ])
                setReports(reportsRes.data)
                setHomeworks(homeworkRes.data)
                setAttendance(attendanceRes.data)
            } catch (error) {
                message.error('Failed to load your profile')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const statusColors = {
        ACTIVE: 'green',
        INACTIVE: 'red',
        SUSPENDED: 'orange'
    }

    const attendanceColors = {
        PRESENT: 'green',
        ABSENT: 'red',
        LATE: 'orange',
        EXCUSED: 'blue'
    }

    const attendanceIcons = {
        PRESENT: '✅',
        ABSENT: '❌',
        LATE: '🕐',
        EXCUSED: '📋'
    }

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

    // Attendance rate
    const presentCount = attendance.filter(a => a.status === 'PRESENT').length
    const attendanceRate = attendance.length > 0
        ? Math.round((presentCount / attendance.length) * 100)
        : 0

    const tasmeeColumns = [
        { title: 'Date', dataIndex: 'sessionDate', key: 'sessionDate' },
        { title: 'Sheikh', dataIndex: 'sheikhName', key: 'sheikhName' },
        {
            title: 'Recited',
            key: 'recited',
            render: (_, r) => `${r.fromSurah} (${r.fromAyah}) → ${r.toSurah} (${r.toAyah})`
        },
        {
            title: 'Grade',
            dataIndex: 'grade',
            key: 'grade',
            render: (grade) => (
                <Space>
                    <Tag color={getGradeColor(grade)}>{grade}/10</Tag>
                    <span style={{ color: '#888', fontSize: '12px' }}>{getGradeLabel(grade)}</span>
                </Space>
            )
        },
        {
            title: 'Mistakes',
            dataIndex: 'mistakes',
            key: 'mistakes',
            render: (text) => text
                ? <span style={{ color: '#ff4d4f' }}>{text}</span>
                : <span style={{ color: '#bbb' }}>—</span>
        },
        {
            title: 'Notes',
            dataIndex: 'sheikhNotes',
            key: 'sheikhNotes',
            render: (text) => text || '—'
        }
    ]

    const homeworkColumns = [
        { title: 'Assigned', dataIndex: 'assignedDate', key: 'assignedDate', render: (d) => d || '—' },
        { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', render: (d) => d || '—' },
        { title: 'Sheikh', dataIndex: 'sheikhName', key: 'sheikhName' },
        {
            title: 'Memorize',
            key: 'memorize',
            render: (_, r) => `${r.fromSurah} (${r.fromAyah}) → ${r.toSurah} (${r.toAyah})`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'REVIEWED' ? 'green' : 'orange'}>{status}</Tag>
            )
        }
    ]

    const attendanceColumns = [
        { title: 'Date', dataIndex: 'sessionDate', key: 'sessionDate' },
        { title: 'Sheikh', dataIndex: 'sheikhName', key: 'sheikhName' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={attendanceColors[status]}>
                    {attendanceIcons[status]} {status}
                </Tag>
            )
        },
        { title: 'Notes', dataIndex: 'notes', key: 'notes', render: (n) => n || '—' }
    ]

    const tabItems = [
        {
            key: 'info',
            label: '📋 My Profile',
            children: (
                <Descriptions column={2} bordered>
                    <Descriptions.Item label="Full Name">{profile?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Username">{profile?.username}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{profile?.phone || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Age">{profile?.age || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Date of Birth">{profile?.dateOfBirth || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Address">{profile?.address || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Guardian Name">{profile?.guardianName || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Guardian Phone">{profile?.guardianPhone || '—'}</Descriptions.Item>
                    <Descriptions.Item label="Halqa">
                        {profile?.halqaName
                            ? <Tag color="blue">{profile.halqaName}</Tag>
                            : '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={statusColors[profile?.enrollmentStatus]}>
                            {profile?.enrollmentStatus}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
            )
        },
        {
            key: 'tasmee',
            label: `🎤 Tasmee (${reports.length})`,
            children: (
                <Table
                    columns={tasmeeColumns}
                    dataSource={reports}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    locale={{ emptyText: 'No tasmee sessions yet' }}
                    scroll={{ x: true }}
                />
            )
        },
        {
            key: 'homework',
            label: `📝 Homework (${homeworks.filter(h => h.status === 'PENDING').length} pending)`,
            children: (
                <Table
                    columns={homeworkColumns}
                    dataSource={homeworks}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                    locale={{ emptyText: 'No homework assigned yet' }}
                />
            )
        },
        {
            key: 'attendance',
            label: `📅 Attendance (${attendanceRate}%)`,
            children: (
                <div>
                    {attendance.length > 0 && (
                        <div style={{
                            marginBottom: '16px',
                            padding: '12px 16px',
                            background: '#f6ffed',
                            border: '1px solid #b7eb8f',
                            borderRadius: '8px',
                            display: 'inline-block'
                        }}>
                            <strong>Attendance Rate: </strong>
                            <span style={{
                                color: attendanceRate >= 75 ? 'green' : 'red',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}>
                                {attendanceRate}%
                            </span>
                            <span style={{ color: '#888', marginLeft: '8px' }}>
                                ({presentCount} / {attendance.length} sessions)
                            </span>
                        </div>
                    )}
                    <Table
                        columns={attendanceColumns}
                        dataSource={attendance}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        locale={{ emptyText: 'No attendance records yet' }}
                    />
                </div>
            )
        }
    ]

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
        </div>
    )

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>Welcome, {profile?.fullName} 👋</h2>
                <p style={{ margin: 0, color: '#888' }}>Your personal learning portal</p>
            </div>

            <Card>
                <Tabs defaultActiveKey="info" items={tabItems} />
            </Card>
        </div>
    )
}

export default StudentPortalPage