import { useEffect, useState } from 'react'
import { useAuth } from '../../store/authStore.jsx'
import AdminDashboard from './AdminDashboard'
import SheikhDashboard from './SheikhDashboard'
import StudentDashboard from './StudentDashboard'

const DashboardPage = () => {
    const { user } = useAuth()

    if (user?.role === 'ADMIN') return <AdminDashboard />
    if (user?.role === 'SHEIKH') return <SheikhDashboard />
    if (user?.role === 'STUDENT') return <StudentDashboard />

    return null
}

export default DashboardPage