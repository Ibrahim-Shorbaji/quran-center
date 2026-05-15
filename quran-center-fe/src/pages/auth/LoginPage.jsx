import { Form, Input, Button, Alert } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/authStore.jsx'
import { loginApi } from '../../api/authApi'
import logo from '../../assets/logo.png'

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const { login } = useAuth()
    const navigate = useNavigate()

    const onFinish = async (values) => {
        setLoading(true)
        setError(null)
        try {
            const response = await loginApi({
                username: values.username,
                password: values.password,
            })
            const { token, id, username, role } = response.data
            login({ id, username, role }, token)
            navigate('/dashboard')
        } catch (err) {
            const data = err.response?.data
            setError(data?.message || 'Invalid username or password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            fontFamily: "'Georgia', serif",
        }}>
            {/* ── Left Panel — Dark ── */}
            <div style={{
                width: '45%',
                background: 'linear-gradient(160deg, #1a1a0e 0%, #2c2c1a 50%, #1a1a0e 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '40px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{
                    position: 'absolute',
                    top: '-100px',
                    right: '-100px',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    border: '1px solid rgba(212, 175, 55, 0.1)',
                    pointerEvents: 'none',
                }} />

                {/* Logo + Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        background: 'rgba(212, 175, 55, 0.15)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                    }}>
                        <img src={logo} alt="logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                    </div>
                    <div>
                        <div style={{
                            color: '#d4af37',
                            fontSize: '16px',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            fontFamily: "'Georgia', serif",
                        }}>
                            نور القرآن
                        </div>
                        <div style={{
                            color: 'rgba(212, 175, 55, 0.6)',
                            fontSize: '10px',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                        }}>
                            AL-HAFETH AL_MOTAMIEZ
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{
                    borderTop: '1px dashed rgba(212, 175, 55, 0.2)',
                }} />

                {/* Arabic Ayah */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '36px',
                        lineHeight: '1.8',
                        textAlign: 'right',
                        fontFamily: "'Georgia', serif",
                        marginBottom: '24px',
                        direction: 'rtl',
                    }}>
                        خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
                    </div>
                    <div style={{
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '14px',
                        fontStyle: 'italic',
                        lineHeight: '1.6',
                    }}>
                        "The best of you are those who learn<br />
                        the Qur'an and teach it."
                    </div>
                    <div style={{
                        color: '#d4af37',
                        fontSize: '11px',
                        letterSpacing: '2px',
                        marginTop: '8px',
                        textTransform: 'uppercase',
                    }}>
                        — SAHIH AL-BUKHARI, 5027
                    </div>
                </div>
            </div>

            {/* ── Right Panel — Light ── */}
            <div style={{
                flex: 1,
                background: '#f5f0e8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>

                    {/* Sign in label */}
                    <div style={{
                        fontSize: '11px',
                        letterSpacing: '3px',
                        textTransform: 'uppercase',
                        color: '#888',
                        marginBottom: '12px',
                    }}>
                        SIGN IN
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '400',
                        color: '#1a1a0e',
                        margin: '0 0 8px 0',
                        fontFamily: "'Georgia', serif",
                        lineHeight: '1.2',
                    }}>
                        Welcome back
                    </h1>
                    <p style={{
                        color: '#888',
                        fontSize: '15px',
                        margin: '0 0 40px 0',
                    }}>
                        Sign in to continue managing your halqas.
                    </p>

                    {/* Error */}
                    {error && (
                        <Alert
                            message={error}
                            type="error"
                            showIcon
                            style={{ marginBottom: '24px', borderRadius: '8px' }}
                        />
                    )}

                    {/* Form */}
                    <Form
                        name="login"
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <Form.Item
                            label={
                                <span style={{
                                    fontSize: '11px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#555',
                                }}>
                                    USERNAME
                                </span>
                            }
                            name="username"
                            rules={[{ required: true, message: 'Please enter your username' }]}
                        >
                            <Input
                                size="large"
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    background: '#fff',
                                    height: '52px',
                                    fontSize: '16px',
                                }}
                                placeholder="e.g. abu.yusuf"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <span style={{
                                    fontSize: '11px',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#555',
                                }}>
                                    PASSWORD
                                </span>
                            }
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input.Password
                                size="large"
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    background: '#fff',
                                    height: '52px',
                                    fontSize: '16px',
                                }}
                            />
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, marginTop: '8px' }}>
                            <Button
                                htmlType="submit"
                                loading={loading}
                                block
                                style={{
                                    height: '56px',
                                    borderRadius: '100px',
                                    background: '#1a1a0e',
                                    border: 'none',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontFamily: "'Georgia', serif",
                                    cursor: 'pointer',
                                }}
                            >
                                {loading ? 'Signing in...' : 'Sign in →'}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage