import { useMemo } from 'react'

export const useFilteredUsers = (
  users = [], 
  searchTerm = '', 
  statusFilter = 'all', 
  roleFilter = 'all', 
  sortBy = 'name', 
  sortOrder = 'asc'
) => {
  return useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      
      return matchesSearch && matchesStatus && matchesRole
    })

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [users, searchTerm, statusFilter, roleFilter, sortBy, sortOrder])
}