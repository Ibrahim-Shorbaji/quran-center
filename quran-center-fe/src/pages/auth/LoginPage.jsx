import { Form, Input, Button, Card, Typography, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/authStore.jsx'
import { loginApi } from '../../api/authApi'
import logo from '../../assets/logo.png'

const { Title, Text } = Typography

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    const onFinish = async (values) => {
        setLoading(true)
        setError(null)
        try {
            // Call Spring Boot login endpoint
            const response = await loginApi({
                username: values.username,
                password: values.password,
            })

            const { token, id, username, role } = response.data

            // Save user info globally
            login({ id, username, role }, token)

            // Go to dashboard
            navigate('/dashboard')

        } catch (err) {
            setError('Invalid username or password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
        }}>
            <Card
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                }}
            >
                {/* Logo + Title */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <img
                        src={logo}
                        alt="Quran Center"
                        style={{ width: '80px', marginBottom: '16px' }}
                    />
                    <Title level={3} style={{ margin: 0, color: '#1a1a2e' }}>
                        Quran Center
                    </Title>
                    <Text type="secondary">Management System</Text>
                </div>

                {/* Error message */}
                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: '24px' }}
                    />
                )}

                {/* Login form */}
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username' }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#bbb' }} />}
                            placeholder="Username"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#bbb' }} />}
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            style={{
                                height: '48px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                fontSize: '16px',
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default LoginPage