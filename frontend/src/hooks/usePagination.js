import { useMemo } from 'react'

export const usePagination = (items = [], currentPage = 1, itemsPerPage = 10) => {
  return useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage)
    
    return {
      paginatedItems,
      totalPages,
      totalItems: items.length,
      startIndex: startIndex + 1,
      endIndex: Math.min(startIndex + itemsPerPage, items.length)
    }
  }, [items, currentPage, itemsPerPage])
}