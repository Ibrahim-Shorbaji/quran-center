import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Select, Button, message } from 'antd'
import { createHalqa, updateHalqa } from '../../api/halqaApi'
import { getAllSheikhs } from '../../api/sheikhApi'

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
            form.setFieldsValue({
                name: halqa.name,
                schedule: halqa.schedule,
                maxStudents: halqa.maxStudents,
                sheikhId: halqa.sheikhId,
            })
        } else {
            form.resetFields()
        }
    }, [halqa, form])

    const onFinish = async (values) => {
        try {
            if (isEdit) {
                await updateHalqa(halqa.id, values)
                message.success('Halqa updated successfully')
            } else {
                await createHalqa(values)
                message.success('Halqa created successfully')
            }
            form.resetFields()
            onSuccess()
        } catch (error) {
            message.error(error.response?.data?.message || 'Something went wrong')
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

                <Form.Item label="Schedule" name="schedule">
                    <Input placeholder="e.g. Sat, Mon, Wed - 8:00 AM" />
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