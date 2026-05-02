import { useState, useEffect } from 'react'
import {
    Table, Button, Tag, Space, Popconfirm, message,
    Modal, Form, Input, DatePicker, Select
} from 'antd'
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import {
    getHomeworkByStudent, createHomework,
    markAsReviewed, deleteHomework
} from '../../../api/homeworkApi'
import { getAllSheikhs } from '../../../api/sheikhApi'
import dayjs from 'dayjs'

const HomeworkTab = ({ studentId }) => {
    const [homeworks, setHomeworks] = useState([])
    const [sheikhs, setSheikhs] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [form] = Form.useForm()

    const fetchHomework = async () => {
        setLoading(true)
        try {
            const res = await getHomeworkByStudent(studentId)
            setHomeworks(res.data)
        } catch {
            message.error('Failed to load homework')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHomework()
        const fetchSheikhs = async () => {
            try {
                const res = await getAllSheikhs()
                setSheikhs(res.data)
            } catch {
                message.error('Failed to load sheikhs')
            }
        }
        fetchSheikhs()
    }, [studentId])

    const handleMarkReviewed = async (id) => {
        try {
            await markAsReviewed(id)
            message.success('Marked as reviewed!')
            fetchHomework()
        } catch {
            message.error('Failed to update homework')
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteHomework(id)
            message.success('Homework deleted')
            fetchHomework()
        } catch {
            message.error('Failed to delete homework')
        }
    }

    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                studentId: parseInt(studentId),
                assignedDate: values.assignedDate
                    ? values.assignedDate.format('YYYY-MM-DD') : null,
                dueDate: values.dueDate
                    ? values.dueDate.format('YYYY-MM-DD') : null,
            }
            await createHomework(payload)
            message.success('Homework assigned!')
            form.resetFields()
            setModalOpen(false)
            fetchHomework()
        } catch (error) {
            message.error(error.response?.data?.message || 'Something went wrong')
        }
    }

    const columns = [
        {
            title: 'Assigned',
            dataIndex: 'assignedDate',
            key: 'assignedDate',
            render: (date) => date || '—'
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => date || '—'
        },
        {
            title: 'Sheikh',
            dataIndex: 'sheikhName',
            key: 'sheikhName',
        },
        {
            title: 'Memorize',
            key: 'memorize',
            render: (_, record) => (
                <span>
                    {record.fromSurah} ({record.fromAyah}) →{' '}
                    {record.toSurah} ({record.toAyah})
                </span>
            )
        },
        {
            title: 'Instructions',
            dataIndex: 'instructions',
            key: 'instructions',
            render: (text) => text || '—'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'REVIEWED' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === 'PENDING' && (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            size="small"
                            onClick={() => handleMarkReviewed(record.id)}
                        >
                            Mark Reviewed
                        </Button>
                    )}
                    <Popconfirm
                        title="Delete this homework?"
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
            )
        }
    ]

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <span style={{ fontWeight: 'bold' }}>
                    {homeworks.filter(h => h.status === 'PENDING').length} Pending
                    {' / '}
                    {homeworks.length} Total
                </span>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalOpen(true)}
                >
                    Assign Homework
                </Button>
            </div>

            {/* Homework table */}
            <Table
                columns={columns}
                dataSource={homeworks}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: 'No homework assigned yet' }}
            />

            {/* Assign modal */}
            <Modal
                title="Assign Homework"
                open={modalOpen}
                onCancel={() => { form.resetFields(); setModalOpen(false) }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}
                    style={{ marginTop: '16px' }}>

                    <Form.Item
                        label="Sheikh"
                        name="sheikhId"
                        rules={[{ required: true, message: 'Please select a sheikh' }]}
                    >
                        <Select
                            placeholder="Select sheikh"
                            showSearch
                            optionFilterProp="label"
                            options={sheikhs.map(s => ({
                                value: s.id,
                                label: s.fullName
                            }))}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item
                            label="From Surah"
                            name="fromSurah"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="e.g. Al-Fatiha" />
                        </Form.Item>
                        <Form.Item
                            label="From Ayah"
                            name="fromAyah"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input type="number" min={1} placeholder="e.g. 1" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item
                            label="To Surah"
                            name="toSurah"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input placeholder="e.g. Al-Baqarah" />
                        </Form.Item>
                        <Form.Item
                            label="To Ayah"
                            name="toAyah"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <Input type="number" min={1} placeholder="e.g. 5" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Form.Item
                            label="Assigned Date"
                            name="assignedDate"
                            style={{ flex: 1 }}
                        >
                            <DatePicker style={{ width: '100%' }} defaultValue={dayjs()} />
                        </Form.Item>
                        <Form.Item
                            label="Due Date"
                            name="dueDate"
                            style={{ flex: 1 }}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item label="Instructions" name="instructions">
                        <Input.TextArea rows={3}
                            placeholder="Any specific instructions..." />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Button onClick={() => setModalOpen(false)}
                            style={{ marginRight: '8px' }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Assign
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default HomeworkTab