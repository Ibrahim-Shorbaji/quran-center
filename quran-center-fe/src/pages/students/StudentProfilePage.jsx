import { useState, useEffect } from 'react'
import { Card, Tabs, Descriptions, Tag, Button, message, Spin } from 'antd'
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { getStudentById } from '../../api/studentApi'
import { getReportsByStudent, createReport, deleteReport } from '../../api/tasmeeApi'
import { getCurrentUser } from '../../api/authApi'
import { useAuth } from '../../store/authStore.jsx'
import TasmeeTab from './tabs/TasmeeTab'
import HomeworkTab from './tabs/HomeworkTab'
import AttendanceTab from './tabs/AttendanceTab'


const StudentProfilePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [student, setStudent] = useState(null)
    const [reports, setReports] = useState([])
    const [currentUserInfo, setCurrentUserInfo] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [studentRes, reportsRes, userRes] = await Promise.all([
                    getStudentById(id),
                    getReportsByStudent(id),
                    getCurrentUser()
                ])
                setStudent(studentRes.data)
                setReports(reportsRes.data)
                setCurrentUserInfo(userRes.data)
            } catch (error) {
                message.error('Failed to load student profile')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleReportCreated = async () => {
        const res = await getReportsByStudent(id)
        setReports(res.data)
    }

    const handleReportDeleted = async () => {
        const res = await getReportsByStudent(id)
        setReports(res.data)
    }

    const statusColors = {
        ACTIVE: 'green',
        INACTIVE: 'red',
        SUSPENDED: 'orange'
    }

    const tabItems = [
        {
            key: 'info',
            label: '📋 Info',
            children: (
                <Descriptions column={2} bordered>
                    <Descriptions.Item label="Full Name">
                        {student?.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Username">
                        {student?.username}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                        {student?.phone || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Age">
                        {student?.age || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Date of Birth">
                        {student?.dateOfBirth || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Address">
                        {student?.address || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Guardian Name">
                        {student?.guardianName || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Guardian Phone">
                        {student?.guardianPhone || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Halqa">
                        {student?.halqaName
                            ? <Tag color="blue">{student.halqaName}</Tag>
                            : '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={statusColors[student?.enrollmentStatus]}>
                            {student?.enrollmentStatus}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
            )
        },
        {
            key: 'tasmee',
            label: '🎤 Tasmee',
            children: (
                <TasmeeTab
                    studentId={id}
                    reports={reports}
                    currentUserInfo={currentUserInfo}
                    onReportCreated={handleReportCreated}
                    onReportDeleted={handleReportDeleted}
                />
            )
        },
        {
            key: 'homework',
            label: '📝 Homework',
            children: <HomeworkTab studentId={id} />
        },
        {
            key: 'attendance',
            label: '📅 Attendance',
            children: <AttendanceTab studentId={id} />
        },
    ]

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
        </div>
    )

    return (
        <div>
            {/* Back button + title */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <div>
                    <h2 style={{ margin: 0 }}>{student?.fullName}</h2>
                    <p style={{ margin: 0, color: '#888' }}>Student Profile</p>
                </div>
            </div>

            {/* Tabs */}
            <Card>
                <Tabs defaultActiveKey="info" items={tabItems} />
            </Card>
        </div>
    )
}

export default StudentProfilePage