import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons'
import { getAllHalqas, deleteHalqa } from '../../api/halqaApi'
import HalqaForm from './HalqaForm'

const HalqasPage = () => {
    const [halqas, setHalqas] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedHalqa, setSelectedHalqa] = useState(null)
    const navigate = useNavigate()

    const fetchHalqas = async () => {
        setLoading(true)
        try {
            const response = await getAllHalqas()
            setHalqas(response.data)
        } catch (error) {
            message.error('Failed to load halqas')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchHalqas() }, [])

    const handleEdit = (halqa) => {
        setSelectedHalqa(halqa)
        setModalOpen(true)
    }

    const handleAdd = () => {
        setSelectedHalqa(null)
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        try {
            await deleteHalqa(id)
            message.success('Halqa deleted successfully')
            fetchHalqas()
        } catch (error) {
            message.error('Failed to delete halqa')
        }
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 60,
        },
        {
            title: 'Halqa Name',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <a

                    onClick={() => navigate(`/halqas/${record.id}`)}
                    style={{ fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {name}
                </a>
            )
        },
        {
            title: 'Sheikh',
            dataIndex: 'sheikhName',
            key: 'sheikhName',
            render: (name) => name || '—'
        },
        {
            title: 'Schedule',
            dataIndex: 'schedule',
            key: 'schedule',
            render: (schedule) => schedule || '—'
        },
        {
            title: 'Students',
            key: 'students',
            render: (_, record) => (
                <Tag icon={<TeamOutlined />} color="blue">
                    {record.currentStudents} / {record.maxStudents || '∞'}
                </Tag>
            )
        },
        {
            title: 'Status',
            dataIndex: 'active',
            key: 'active',
            render: (active) => (
                <Tag color={active ? 'green' : 'red'}>
                    {active ? 'Active' : 'Inactive'}
                </Tag>
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
                        title="Delete Halqa"
                        description="Are you sure? This will affect assigned students."
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
                    <h2 style={{ margin: 0 }}>Halqas</h2>
                    <p style={{ margin: 0, color: '#888' }}>Manage all Quran circles</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
                    Add Halqa
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={halqas}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <HalqaForm
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={() => { setModalOpen(false); fetchHalqas() }}
                halqa={selectedHalqa}
            />
        </div>
    )
}

export default HalqasPage