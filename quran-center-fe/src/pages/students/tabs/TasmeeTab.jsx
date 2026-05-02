import { useState } from 'react'
import {
    Table, Button, Tag, Space, Popconfirm, message, Modal,
    Form, Input, InputNumber, DatePicker, Select
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { createReport, deleteReport } from '../../../api/tasmeeApi'
import { getAllSheikhs } from '../../../api/sheikhApi'
import { useEffect } from 'react'
import { useAuth } from '../../../store/authStore.jsx'
import dayjs from 'dayjs'

const TasmeeTab = ({ studentId, reports, currentUserInfo, onReportCreated, onReportDeleted }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [sheikhs, setSheikhs] = useState([])
    const [form] = Form.useForm()
    const { user } = useAuth()

    useEffect(() => {
        const fetchSheikhs = async () => {
            try {
                const res = await getAllSheikhs()
                setSheikhs(res.data)
            } catch {
                message.error('Failed to load sheikhs')
            }
        }
        fetchSheikhs()
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

    const handleDelete = async (id) => {
        try {
            await deleteReport(id)
            message.success('Report deleted')
            onReportDeleted()
        } catch {
            message.error('Failed to delete report')
        }
    }

    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                studentId: parseInt(studentId),
                sessionDate: values.sessionDate.format('YYYY-MM-DD')
            }
            await createReport(payload)
            message.success('Tasmee report recorded!')
            form.resetFields()
            setModalOpen(false)
            onReportCreated()
        } catch (error) {
            message.error(error.response?.data?.message || 'Something went wrong')
        }
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
            title: 'Recited',
            key: 'recited',
            render: (_, record) => (
                <span>
                    {record.fromSurah} ({record.fromAyah}) → {record.toSurah} ({record.toAyah})
                </span>
            )
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
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Popconfirm
                    title="Delete this report?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                >
                    <Button danger icon={<DeleteOutlined />} size="small">
                        Delete
                    </Button>
                </Popconfirm>
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
                    {reports.length} Session(s) recorded
                </span>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalOpen(true)}
                >
                    Record Session
                </Button>
            </div>

            {/* Reports table */}
            <Table
                columns={columns}
                dataSource={reports}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                locale={{ emptyText: 'No tasmee sessions recorded yet' }}
            />

            {/* Record session modal */}
            <Modal
                title="Record Tasmee Session"
                open={modalOpen}
                onCancel={() => { form.resetFields(); setModalOpen(false) }}
                footer={null}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: '16px' }}>

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

                    <Form.Item
                        label="Session Date"
                        name="sessionDate"
                        rules={[{ required: true, message: 'Please select date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} defaultValue={dayjs()} />
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
                            <InputNumber min={1} style={{ width: '100%' }} />
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
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Grade (0 - 10)"
                        name="grade"
                        rules={[{ required: true, message: 'Please enter grade' }]}
                    >
                        <InputNumber min={0} max={10} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Mistakes" name="mistakes">
                        <Input.TextArea rows={3} placeholder="Describe any mistakes..." />
                    </Form.Item>

                    <Form.Item label="Sheikh Notes" name="sheikhNotes">
                        <Input.TextArea rows={3} placeholder="Any advice or notes..." />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Button onClick={() => setModalOpen(false)} style={{ marginRight: '8px' }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Record Session
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default TasmeeTab