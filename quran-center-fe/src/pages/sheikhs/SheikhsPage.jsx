import { useState, useEffect } from 'react'
import { Table, Button, Space, Popconfirm, message, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { getAllSheikhs, deleteSheikh } from '../../api/sheikhApi'
import SheikhForm from './SheikhForm'

const SheikhsPage = () => {
    const [sheikhs, setSheikhs] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedSheikh, setSelectedSheikh] = useState(null)

    // Load all sheikhs when page opens
    const fetchSheikhs = async () => {
        setLoading(true)
        try {
            const response = await getAllSheikhs()
            setSheikhs(response.data)
        } catch (error) {
            message.error('Failed to load sheikhs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSheikhs()
    }, [])

    // Open modal for editing
    const handleEdit = (sheikh) => {
        setSelectedSheikh(sheikh)
        setModalOpen(true)
    }

    // Open modal for adding
    const handleAdd = () => {
        setSelectedSheikh(null)
        setModalOpen(true)
    }

    // Delete sheikh
    const handleDelete = async (id) => {
        try {
            await deleteSheikh(id)
            message.success('Sheikh deleted successfully')
            fetchSheikhs()
        } catch (error) {
            message.error('Failed to delete sheikh')
        }
    }

    // Called when form is submitted successfully
    const handleFormSuccess = () => {
        setModalOpen(false)
        fetchSheikhs()
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
            render: (phone) => phone || '—',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => email || '—',
        },
        {
            title: 'Halqas',
            dataIndex: 'halqaCount',
            key: 'halqaCount',
            render: (count) => <Tag color="blue">{count} Halqa(s)</Tag>,
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
                        title="Delete Sheikh"
                        description="Are you sure you want to delete this sheikh?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div>
            {/* Page header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px'
            }}>
                <div>
                    <h2 style={{ margin: 0 }}>Sheikhs</h2>
                    <p style={{ margin: 0, color: '#888' }}>Manage all sheikhs in the center</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                    size="large"
                >
                    Add Sheikh
                </Button>
            </div>

            {/* Sheikhs table */}
            <Table
                columns={columns}
                dataSource={sheikhs}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Add/Edit modal */}
            <SheikhForm
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleFormSuccess}
                sheikh={selectedSheikh}
            />
        </div>
    )
}

export default SheikhsPage