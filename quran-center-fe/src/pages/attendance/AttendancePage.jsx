import { useState, useEffect } from 'react'
import { Card, Select, DatePicker, Button, Table, Tag, Space, message, Radio } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { getAllHalqas } from '../../api/halqaApi'
import { getStudentsByHalqa } from '../../api/studentApi'
import { getAllSheikhs } from '../../api/sheikhApi'
import { recordAttendance } from '../../api/attendanceApi'
import dayjs from 'dayjs'

const AttendancePage = () => {
    const [halqas, setHalqas] = useState([])
    const [sheikhs, setSheikhs] = useState([])
    const [students, setStudents] = useState([])
    const [selectedHalqa, setSelectedHalqa] = useState(null)
    const [selectedSheikh, setSelectedSheikh] = useState(null)
    const [sessionDate, setSessionDate] = useState(dayjs())
    const [attendanceMap, setAttendanceMap] = useState({})
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [halqasRes, sheikhsRes] = await Promise.all([
                    getAllHalqas(),
                    getAllSheikhs()
                ])
                setHalqas(halqasRes.data)
                setSheikhs(sheikhsRes.data)
            } catch {
                message.error('Failed to load data')
            }
        }
        fetchData()
    }, [])

    const handleHalqaChange = async (halqaId) => {
        setSelectedHalqa(halqaId)
        setAttendanceMap({})
        setLoading(true)
        try {
            const res = await getStudentsByHalqa(halqaId)
            setStudents(res.data)
            // Default all students to PRESENT
            const defaultMap = {}
            res.data.forEach(s => { defaultMap[s.id] = 'PRESENT' })
            setAttendanceMap(defaultMap)
        } catch {
            message.error('Failed to load students')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = (studentId, status) => {
        setAttendanceMap(prev => ({ ...prev, [studentId]: status }))
    }

    const handleSubmit = async () => {
        if (!selectedHalqa) {
            message.warning('Please select a halqa first')
            return
        }
        if (!selectedSheikh) {
            message.warning('Please select a sheikh first')
            return
        }
        if (students.length === 0) {
            message.warning('No students in this halqa')
            return
        }

        setSubmitting(true)
        try {
            const payload = {
                sheikhId: selectedSheikh,
                sessionDate: sessionDate.format('YYYY-MM-DD'),
                attendances: students.map(s => ({
                    studentId: s.id,
                    status: attendanceMap[s.id] || 'PRESENT',
                    notes: null
                }))
            }
            await recordAttendance(payload)
            message.success('Attendance recorded successfully!')
        } catch (error) {
            message.error(error.response?.data?.message || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    const statusOptions = [
        { label: '✅ Present', value: 'PRESENT' },
        { label: '❌ Absent', value: 'ABSENT' },
        { label: '🕐 Late', value: 'LATE' },
        { label: '📋 Excused', value: 'EXCUSED' },
    ]

    const statusColors = {
        PRESENT: 'green',
        ABSENT: 'red',
        LATE: 'orange',
        EXCUSED: 'blue'
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Student Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (name) => <strong>{name}</strong>
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <Radio.Group
                    value={attendanceMap[record.id] || 'PRESENT'}
                    onChange={(e) => handleStatusChange(record.id, e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                    size="small"
                >
                    {statusOptions.map(opt => (
                        <Radio.Button
                            key={opt.value}
                            value={opt.value}
                            style={{
                                backgroundColor: attendanceMap[record.id] === opt.value
                                    ? undefined : 'white'
                            }}
                        >
                            {opt.label}
                        </Radio.Button>
                    ))}
                </Radio.Group>
            )
        },
    ]

    // Summary counts
    const summary = {
        PRESENT: Object.values(attendanceMap).filter(s => s === 'PRESENT').length,
        ABSENT: Object.values(attendanceMap).filter(s => s === 'ABSENT').length,
        LATE: Object.values(attendanceMap).filter(s => s === 'LATE').length,
        EXCUSED: Object.values(attendanceMap).filter(s => s === 'EXCUSED').length,
    }

    return (
        <div>
            {/* Page header */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>Attendance</h2>
                <p style={{ margin: 0, color: '#888' }}>Record attendance for a halqa session</p>
            </div>

            {/* Controls */}
            <Card style={{ marginBottom: '24px' }}>
                <Space wrap size="large">
                    <div>
                        <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Halqa</div>
                        <Select
                            placeholder="Select halqa"
                            style={{ width: 200 }}
                            onChange={handleHalqaChange}
                            options={halqas.map(h => ({
                                value: h.id,
                                label: h.name
                            }))}
                        />
                    </div>

                    <div>
                        <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Sheikh</div>
                        <Select
                            placeholder="Select sheikh"
                            style={{ width: 200 }}
                            onChange={setSelectedSheikh}
                            options={sheikhs.map(s => ({
                                value: s.id,
                                label: s.fullName
                            }))}
                        />
                    </div>

                    <div>
                        <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>Session Date</div>
                        <DatePicker
                            value={sessionDate}
                            onChange={setSessionDate}
                            style={{ width: 200 }}
                        />
                    </div>
                </Space>
            </Card>

            {/* Summary tags */}
            {students.length > 0 && (
                <Space style={{ marginBottom: '16px' }}>
                    <Tag color="green">✅ Present: {summary.PRESENT}</Tag>
                    <Tag color="red">❌ Absent: {summary.ABSENT}</Tag>
                    <Tag color="orange">🕐 Late: {summary.LATE}</Tag>
                    <Tag color="blue">📋 Excused: {summary.EXCUSED}</Tag>
                </Space>
            )}

            {/* Students table */}
            {selectedHalqa && (
                <Card>
                    <Table
                        columns={columns}
                        dataSource={students}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                        locale={{ emptyText: 'No students in this halqa' }}
                    />

                    {students.length > 0 && (
                        <div style={{ textAlign: 'right', marginTop: '16px' }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<CheckOutlined />}
                                loading={submitting}
                                onClick={handleSubmit}
                            >
                                Save Attendance
                            </Button>
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}

export default AttendancePage