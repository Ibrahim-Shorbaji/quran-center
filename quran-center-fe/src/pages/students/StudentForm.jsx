import { useEffect, useState } from 'react'
import { Modal, Form, Input, InputNumber, Select, DatePicker, Button, message } from 'antd'
import dayjs from 'dayjs'
import { createStudent, updateStudent } from '../../api/studentApi'
import { getAllHalqas } from '../../api/halqaApi'

const StudentForm = ({ open, onClose, onSuccess, student }) => {
    const [form] = Form.useForm()
    const [halqas, setHalqas] = useState([])
    const isEdit = !!student

    useEffect(() => {
        const fetchHalqas = async () => {
            try {
                const response = await getAllHalqas()
                setHalqas(response.data)
            } catch {
                message.error('Failed to load halqas')
            }
        }
        fetchHalqas()
    }, [])

    useEffect(() => {
        if (student) {
            form.setFieldsValue({
                fullName: student.fullName,
                phone: student.phone,
                age: student.age,
                dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,
                address: student.address,
                guardianName: student.guardianName,
                guardianPhone: student.guardianPhone,
                halqaId: student.halqaId,
                enrollmentStatus: student.enrollmentStatus,
            })
        } else {
            form.resetFields()
        }
    }, [student, form])

    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                dateOfBirth: values.dateOfBirth
                    ? values.dateOfBirth.format('YYYY-MM-DD')
                    : null,
            }

            if (isEdit) {
                await updateStudent(student.id, payload)
                message.success('Student updated successfully')
            } else {
                await createStudent(payload)
                message.success('Student created successfully')
            }
            form.resetFields()
            onSuccess()
        } catch (error) {
            message.error(error.response?.data?.message || 'Something went wrong')
        }
    }

    return (
        <Modal
            title={isEdit ? 'Edit Student' : 'Add New Student'}
            open={open}
            onCancel={() => { form.resetFields(); onClose() }}
            footer={null}
            width={600}
        >
            <Form form={form} layout="vertical" onFinish={onFinish} style={{ marginTop: '16px' }}>

                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please enter full name' }]}
                >
                    <Input placeholder="e.g. Ahmad Mohammad" />
                </Form.Item>

                {!isEdit && (
                    <>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please enter username' }]}
                        >
                            <Input placeholder="e.g. ahmad_m" />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter password' }]}
                        >
                            <Input.Password placeholder="Enter password" />
                        </Form.Item>
                    </>
                )}

                <Form.Item label="Phone" name="phone">
                    <Input placeholder="e.g. 0599999999" />
                </Form.Item>

                <Form.Item label="Age" name="age">
                    <InputNumber min={3} max={100} style={{ width: '100%' }} placeholder="e.g. 12" />
                </Form.Item>

                <Form.Item label="Date of Birth" name="dateOfBirth">
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item label="Address" name="address">
                    <Input placeholder="e.g. Amman, Jordan" />
                </Form.Item>

                <Form.Item label="Guardian Name" name="guardianName">
                    <Input placeholder="e.g. Mohammad Ahmad" />
                </Form.Item>

                <Form.Item label="Guardian Phone" name="guardianPhone">
                    <Input placeholder="e.g. 0599999998" />
                </Form.Item>

                <Form.Item label="Halqa" name="halqaId">
                    <Select
                        placeholder="Select a halqa"
                        allowClear
                        options={halqas.map(h => ({
                            value: h.id,
                            label: h.name
                        }))}
                    />
                </Form.Item>

                <Form.Item label="Enrollment Status" name="enrollmentStatus">
                    <Select
                        placeholder="Select status"
                        options={[
                            { value: 'ACTIVE', label: 'Active' },
                            { value: 'INACTIVE', label: 'Inactive' },
                            { value: 'SUSPENDED', label: 'Suspended' },
                        ]}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: '8px' }}>Cancel</Button>
                    <Button type="primary" htmlType="submit">
                        {isEdit ? 'Save Changes' : 'Add Student'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default StudentForm