import { useMemo } from 'react'

export const useDashboardStats = (users = []) => {
  return useMemo(() => {
    const total = users.length
    const active = users.filter(u => u.status === 'active' && !u.isBanned).length
    const inactive = users.filter(u => u.status === 'inactive' && !u.isBanned).length
    const banned = users.filter(u => u.status === 'banned').length
    
    const now = new Date()
    const newThisMonth = users.filter(u => {
      const userDate = new Date(u.createdAt)
      return (
        userDate.getMonth() === now.getMonth() &&
        userDate.getFullYear() === now.getFullYear()
      )
    }).length

    return { 
      total, 
      active, 
      inactive, 
      banned, 
      newThisMonth 
    }
  }, [users])
}