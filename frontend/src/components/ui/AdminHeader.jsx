import React from 'react'
import StatusBadge from './StatusBadge'

const AdminHeader = ({ 
  title, 
  user, 
  stats, 
  connected, 
  onRefresh,
  children 
}) => {
  return (
    <div className="card border-0 shadow-lg glass-card hover-lift">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2
              className="mb-1 fw-bold"
              style={{
                color: "#2c3e50",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <i className="bi bi-speedometer2 me-3"></i>
              {title}
            </h2>
            <p className="mb-0 text-muted fs-5">
              Welcome back,{" "}
              <strong className="text-primary">{user?.name}</strong>!
              Manage {stats?.total || 0} users and monitor system activity
            </p>
          </div>
          <div className="d-flex gap-4 align-items-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHeader