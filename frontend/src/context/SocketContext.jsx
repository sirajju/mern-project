import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated && user) {

      const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken')
      
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token: token,
          userId: user.id,
          userEmail: user.email
        }
      })

      newSocket.on('connect', () => {
        setConnected(true)
        console.log('Connected to server')
      })

      newSocket.on('disconnect', () => {
        setConnected(false)
        console.log('Disconnected from server')
      })

      newSocket.on('user_banned', (data) => {
        if (data.userId === user.id) {
          toast.error('Your account has been banned. You will be logged out.', {
            autoClose: 2000
          })
          
          setTimeout(() => {
            logout()
            window.location.href = '/login'
          }, 2000)
        }
      })

      newSocket.on('force_logout', (data) => {
        if (data.userId === user.id) {
          toast.warning('You have been logged out by an administrator.', {
            autoClose: 1500
          })
          
          setTimeout(() => {
            logout()
            window.location.href = '/login'
          }, 1500)
        }
      })

      newSocket.on('admin_message', (data) => {
        toast.info(data.message, {
          autoClose: 5000
        })
      })

      socketRef.current = newSocket
      setSocket(newSocket)

      return () => {
        newSocket.close()
        setSocket(null)
        setConnected(false)
      }
    }
  }, [isAuthenticated, user, logout])

  const emitUserAction = useCallback((action, data) => {
    if (socketRef.current && connected) {
      socketRef.current.emit(action, data)
    }
  }, [connected])

  const banUserRealtime = useCallback((userId, reason) => {
    emitUserAction('admin_ban_user', { userId, reason, adminId: user?.id })
  }, [emitUserAction, user?.id])

  const unbanUserRealtime = useCallback((userId) => {
    emitUserAction('admin_unban_user', { userId, adminId: user?.id })
  }, [emitUserAction, user?.id])

  const forceLogoutUser = useCallback((userId) => {
    emitUserAction('admin_force_logout', { userId, adminId: user?.id })
  }, [emitUserAction, user?.id])

  const sendAdminMessage = useCallback((message, targetUserId = null) => {
    emitUserAction('admin_broadcast', { 
      message, 
      targetUserId, 
      adminId: user?.id 
    })
  }, [emitUserAction, user?.id])

  const value = useMemo(() => ({
    socket,
    connected,
    banUserRealtime,
    unbanUserRealtime,
    forceLogoutUser,
    sendAdminMessage,
    emitUserAction
  }), [socket, connected, banUserRealtime, unbanUserRealtime, forceLogoutUser, sendAdminMessage, emitUserAction])

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}