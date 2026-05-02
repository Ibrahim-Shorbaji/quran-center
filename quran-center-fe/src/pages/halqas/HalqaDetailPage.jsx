import { useState, useEffect } from 'react'
import { Table, Button, Tag, Card, Descriptions, Space, message } from 'antd'
import { ArrowLeftOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { getHalqaById } from '../../api/halqaApi'
import { getStudentsByHalqa } from '../../api/studentApi'

const HalqaDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [halqa, setHalqa] = useState(null)
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [halqaRes, studentsRes] = await Promise.all([
                    getHalqaById(id),
                    getStudentsByHalqa(id)
                ])
                setHalqa(halqaRes.data)
                setStudents(studentsRes.data)
            } catch (error) {
                message.error('Failed to load halqa details')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const statusColors = {
        ACTIVE: 'green',
        INACTIVE: 'red',
        SUSPENDED: 'orange'
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            render: (name, record) => (
                <a
                    onClick={() => navigate(`/students/${record.id}`)}
                    style={{ fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {name}
                </a>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => phone || '—'
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            render: (age) => age || '—'
        },
        {
            title: 'Guardian',
            dataIndex: 'guardianName',
            key: 'guardianName',
            render: (name) => name || '—'
        },
        {
            title: 'Status',
            dataIndex: 'enrollmentStatus',
            key: 'enrollmentStatus',
            render: (status) => (
                <Tag color={statusColors[status]}>{status}</Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<UserOutlined />}
                    onClick={() => navigate(`/students/${record.id}`)}
                >
                    View Profile
                </Button>
            )
        }
    ]

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
                    onClick={() => navigate('/halqas')}
                >
                    Back to Halqas
                </Button>
                <div>
                    <h2 style={{ margin: 0 }}>{halqa?.name}</h2>
                    <p style={{ margin: 0, color: '#888' }}>Halqa Details</p>
                </div>
            </div>

            {/* Halqa info card */}
            <Card style={{ marginBottom: '24px' }}>
                <Descriptions column={3}>
                    <Descriptions.Item label="Sheikh">
                        {halqa?.sheikhName || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Schedule">
                        {halqa?.schedule || '—'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Capacity">
                        <Tag icon={<TeamOutlined />} color="blue">
                            {halqa?.currentStudents} / {halqa?.maxStudents || '∞'} Students
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={halqa?.active ? 'green' : 'red'}>
                            {halqa?.active ? 'Active' : 'Inactive'}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Students table */}
            <Card
                title={
                    <Space>
                        <TeamOutlined />
                        <span>Students in this Halqa</span>
                        <Tag color="blue">{students.length} students</Tag>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={students}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No students in this halqa yet' }}
                />
            </Card>
        </div>
    )
}

export default HalqaDetailPage