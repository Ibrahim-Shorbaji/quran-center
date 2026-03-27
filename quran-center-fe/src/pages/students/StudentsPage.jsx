import { useState, useEffect } from 'react'
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getAllStudents, deleteStudent } from '../../api/studentApi'
import StudentForm from './StudentForm'

const StudentsPage = () => {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const response = await getAllStudents()
            setStudents(response.data)
        } catch (error) {
            message.error('Failed to load students')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchStudents() }, [])

    const handleEdit = (student) => {
        setSelectedStudent(student)
        setModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedStudent(null)
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        try {
            await deleteStudent(id)
            message.success('Student deleted successfully')
            fetchStudents()
        } catch (error) {
            message.error('Failed to delete student')
        }
    }

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
            render: (name) => <strong>{name}</strong>
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
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
            title: 'Halqa',
            dataIndex: 'halqaName',
            key: 'halqaName',
            render: (name) => name
                ? <Tag color="blue">{name}</Tag>
                : <Tag color="default">No Halqa</Tag>
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
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Student"
                        description="Are you sure you want to delete this student?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button danger icon={<DeleteOutlined />} size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <div>
                    <h2 style={{ margin: 0 }}>Students</h2>
                    <p style={{ margin: 0, color: '#888' }}>Manage all students in the center</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
                    Add Student
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={students}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <StudentForm
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={() => { setModalOpen(false); fetchStudents() }}
                student={selectedStudent}
            />
        </div>
    )
}

export default StudentsPage