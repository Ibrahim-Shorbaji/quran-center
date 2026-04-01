import { useEffect } from 'react'
import { Modal, Form, Input, Button, message } from 'antd'
import { createSheikh, updateSheikh } from '../../api/sheikhApi'

const SheikhForm = ({ open, onClose, onSuccess, sheikh }) => {
    const [form] = Form.useForm()
    const isEdit = !!sheikh

    // Fill form when editing
    useEffect(() => {
        if (sheikh) {
            form.setFieldsValue({
                fullName: sheikh.fullName,
                phone: sheikh.phone,
                email: sheikh.email,
            })
        } else {
            form.resetFields()
        }
    }, [sheikh, form])

    const onFinish = async (values) => {
        try {
            if (isEdit) {
                await updateSheikh(sheikh.id, values)
                message.success('Sheikh updated successfully')
            } else {
                await createSheikh(values)
                message.success('Sheikh created successfully')
            }
            form.resetFields()
            onSuccess()
        } catch (error) {
            const data = error.response?.data
            if (data?.fields) {
                const fieldErrors = Object.entries(data.fields).map(([name, message]) => ({
                    name,
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
            title={isEdit ? 'Edit Sheikh' : 'Add New Sheikh'}
            open={open}
            onCancel={() => {
                form.resetFields()
                onClose()
            }}
            footer={null}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ marginTop: '16px' }}
            >
                <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: 'Please enter full name' }]}
                >
                    <Input placeholder="e.g. Sheikh Ahmad Al-Mansour" />
                </Form.Item>

                {/* Username and Password only shown when adding */}
                {!isEdit && (
                    <>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please enter username' }]}
                        >
                            <Input placeholder="e.g. sheikh_ahmad" />
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

                <Form.Item label="Email" name="email">
                    <Input placeholder="e.g. sheikh@center.com" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button onClick={onClose} style={{ marginRight: '8px' }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {isEdit ? 'Save Changes' : 'Add Sheikh'}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default SheikhForm