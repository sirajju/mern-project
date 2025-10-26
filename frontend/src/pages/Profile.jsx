import React, { useState, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { PageHeader, Card, FormInput, Button } from '../components/ui'
import '../styles/animations.css'

const Profile = React.memo(() => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    phone: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }, [])

  const handleProfileUpdate = useCallback((e) => {
    e.preventDefault()
    toast.success('Profile updated successfully!')
  }, [])

  const handlePasswordChange = useCallback((e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    toast.success('Password changed successfully!')
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }))
  }, [formData.newPassword, formData.confirmPassword])

  const tabItems = useMemo(() => [
    { id: 'profile', label: 'Profile Information', icon: 'bi bi-person' },
    { id: 'security', label: 'Security', icon: 'bi bi-shield-lock' },
    { id: 'notifications', label: 'Notifications', icon: 'bi bi-bell' }
  ], [])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <PageHeader
            title="Profile Settings"
            subtitle="Manage your account settings and preferences"
            icon="bi bi-person-gear"
          />

          <div className="row">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body text-center">
                  <div className="avatar-lg mx-auto mb-3">
                    <div
                      className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                      style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  </div>
                  <h5 className="mb-1">{user?.name}</h5>
                  <p className="text-muted">{user?.email}</p>
                </div>
              </div>

              <div className="card mt-3">
                <div className="card-body p-0">
                  <div className="list-group list-group-flush">
                    {tabItems.map(tab => (
                      <button
                        key={tab.id}
                        className={`list-group-item list-group-item-action ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <i className={`${tab.icon} me-2`}></i>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-9">
              {activeTab === 'profile' && (
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Profile Information</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleProfileUpdate}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Company</label>
                          <input
                            type="text"
                            className="form-control"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Bio</label>
                          <textarea
                            className="form-control"
                            name="bio"
                            rows="3"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself..."
                          ></textarea>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary">
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Change Password</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handlePasswordChange}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            className="form-control"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Confirm New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary">
                            Change Password
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="card">
                  <div className="card-header">
                    <h5 className="mb-0">Notification Preferences</h5>
                  </div>
                  <div className="card-body">
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                      <label className="form-check-label" htmlFor="emailNotifications">
                        Email notifications
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" id="taskDeadlines" defaultChecked />
                      <label className="form-check-label" htmlFor="taskDeadlines">
                        Task deadline reminders
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" id="projectUpdates" defaultChecked />
                      <label className="form-check-label" htmlFor="projectUpdates">
                        Project updates
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input className="form-check-input" type="checkbox" id="teamInvites" defaultChecked />
                      <label className="form-check-label" htmlFor="teamInvites">
                        Team invitations
                      </label>
                    </div>
                    <button className="btn btn-primary">Save Preferences</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Profile