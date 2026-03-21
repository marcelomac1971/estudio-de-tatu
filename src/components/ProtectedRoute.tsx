import { Navigate, Outlet } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAppStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
