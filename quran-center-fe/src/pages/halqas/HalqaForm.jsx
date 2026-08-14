import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Select, Button, message } from 'antd'
import { createHalqa, updateHalqa } from '../../api/halqaApi'
import { getAllSheikhs } from '../../api/sheikhApi'
import { DAY_OPTIONS, TIME_OPTIONS, buildSchedule, parseSchedule } from '../../constants/halqaSchedule'

const HalqaForm = ({ open, onClose, onSuccess, halqa }) => {
    const [form] = Form.useForm()
    const [sheikhs, setSheikhs] = useState([])
    const isEdit = !!halqa

    // Load sheikhs for the dropdown
    useEffect(() => {
        const fetchSheikhs = async () => {
            try {
                const response = await getAllSheikhs()
                setSheikhs(response.data)
            } catch {
                message.error('Failed to load sheikhs')
            }
        }
        fetchSheikhs()
    }, [])

    // Fill form when editing
    useEffect(() => {
        if (halqa) {
            const { days, time } = parseSchedule(halqa.schedule)
            form.setFieldsValue({
                name: halqa.name,
                scheduleDays: days,
                scheduleTime: time,
                maxStudents: halqa.maxStudents,
                sheikhId: halqa.sheikhId,
            })
        } else {
            form.resetFields()
        }
    }, [halqa, form])

    const onFinish = async ({ scheduleDays, scheduleTime, ...values }) => {
        const payload = { ...values, schedule: buildSchedule(scheduleDays, scheduleTime) }
        try {
            if (isEdit) {
                await updateHalqa(halqa.id, payload)
                message.success('Halqa updated successfully')
            } else {
                await createHalqa(payload)
                message.success('Halqa created successfully')
            }
            form.resetFields()
            onSuccess()
        } catch (error) {
            const data = error.response?.data
            if (data?.fields) {
                const fieldErrors = Object.entries(data.fields).map(([name, message]) => ({
                    // the schedule string is built from two form fields
                    name: name === 'schedule' ? 'scheduleDays' : name,
                    errors: [message]
                }))
                form.setFields(fieldErrors)
            } else {
                message.error(data?.message || 'Something went wrong')
            }
        }
    }

    return (
        <Modal
            title={isEdit ? 'Edit Halqa' : 'Add New Halqa'}
            open={open}
            onCancel={() => { form.resetFields(); onClose() }}
            footer={null}
            width={500}
        >
            <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: '16px' }}>
                <Form.Item
                    label="Halqa Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter halqa name' }]}
                >
                    <Input placeholder="e.g. Halqa Fajr" />
                </Form.Item>

                <Form.Item
                    label="Sheikh"
                    name="sheikhId"
                    rules={[{ required: true, message: 'Please select a sheikh' }]}
                >
                    <Select
                        placeholder="Select a sheikh"
                        options={sheikhs.map(s => ({
                            value: s.id,
                            label: s.fullName
                        }))}
                    />
                </Form.Item>

                <Form.Item label="Days" name="scheduleDays">
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Select days"
                        options={DAY_OPTIONS}
                    />
                </Form.Item>

                <Form.Item label="Time" name="scheduleTime">
                    <Select
                        allowClear
                        showSearch
                        placeholder="Select a time"
                        options={TIME_OPTIONS}
                    />
                </Form.Item>

                <Form.Item label="Max Students" name="maxStudents">
                    <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="e.g. 15" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: '8px' }}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                        {isEdit ? 'Save Changes' : 'Add Halqa'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default HalqaForm