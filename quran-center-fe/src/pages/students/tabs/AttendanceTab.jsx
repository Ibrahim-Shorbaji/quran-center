import { useState, useEffect } from 'react'
import { Table, Tag, message } from 'antd'
import { getAttendanceByStudent } from '../../../api/attendanceApi'

const AttendanceTab = ({ studentId }) => {
    const [attendance, setAttendance] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true)
            try {
                const res = await getAttendanceByStudent(studentId)
                setAttendance(res.data)
            } catch {
                message.error('Failed to load attendance')
            } finally {
                setLoading(false)
            }
        }
        fetchAttendance()
    }, [studentId])

    const statusColors = {
        PRESENT: 'green',
        ABSENT: 'red',
        LATE: 'orange',
        EXCUSED: 'blue'
    }

    const statusIcons = {
        PRESENT: '✅',
        ABSENT: '❌',
        LATE: '🕐',
        EXCUSED: '📋'
    }

    const columns = [
        {
            title: 'Date',
            dataIndex: 'sessionDate',
            key: 'sessionDate',
        },
        {
            title: 'Sheikh',
            dataIndex: 'sheikhName',
            key: 'sheikhName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={statusColors[status]}>
                    {statusIcons[status]} {status}
                </Tag>
            )
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            render: (notes) => notes || '—'
        }
    ]

    const presentCount = attendance.filter(a => a.status === 'PRESENT').length
    const totalCount = attendance.length
    const percentage = totalCount > 0
        ? Math.round((presentCount / totalCount) * 100)
        : 0

    return (
        <div>
            {/* Attendance summary */}
            {totalCount > 0 && (
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
                        color: percentage >= 75 ? 'green' : 'red',
                        fontWeight: 'bold',
                        fontSize: '16px'
                    }}>
                        {percentage}%
                    </span>
                    <span style={{ color: '#888', marginLeft: '8px' }}>
                        ({presentCount} / {totalCount} sessions)
                    </span>
                </div>
            )}

            <Table
                columns={columns}
                dataSource={attendance}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No attendance records yet' }}
            />
        </div>
    )
}

export default AttendanceTab