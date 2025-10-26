import React, { memo, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { PageHeader, StatsGrid, ActionCard, CallToAction } from '../components/ui';

const Home = memo(() => {
  const { user } = useAuth();
  const { connected } = useSocket();

  const welcomeTitle = useMemo(() => 
    `Welcome, ${user?.name || 'Friend'}!`,
    [user?.name]
  );

  const memberSinceValue = useMemo(() => 
    user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Today',
    [user?.joinedAt]
  );

  const stats = useMemo(() => [
    {
      id: 'greeting',
      icon: 'bi bi-person-check',
      iconColor: 'primary',
      title: `Hello, ${user?.name || 'User'}`,
      value: 'Welcome back!'
    },
    {
      id: 'status',
      icon: 'bi bi-shield-check',
      iconColor: 'success',
      title: 'Account Status',
      value: 'Active & Secure'
    },
    {
      id: 'connection',
      icon: connected ? 'bi bi-wifi' : 'bi bi-wifi-off',
      iconColor: connected ? 'success' : 'danger',
      title: 'Connection',
      value: connected ? 'Online' : 'Offline'
    },
    {
      id: 'member-since',
      icon: 'bi bi-calendar-check',
      iconColor: 'info',
      title: 'Member Since',
      value: memberSinceValue
    }
  ], [user?.name, connected, memberSinceValue]);

  const actions = useMemo(() => [
    {
      id: 'profile',
      icon: 'bi bi-person-gear',
      title: 'My Profile',
      description: 'Update your information',
      buttonText: 'View Profile',
      href: '/profile',
      buttonVariant: 'primary'
    },
    {
      id: 'dashboard',
      icon: 'bi bi-kanban',
      title: 'Dashboard',
      description: 'View your projects',
      buttonText: 'Go to Dashboard',
      href: '/dashboard',
      buttonVariant: 'success'
    },
    {
      id: 'settings',
      icon: 'bi bi-gear',
      title: 'Settings',
      description: 'Manage preferences',
      buttonText: 'Settings',
      href: '/settings',
      buttonVariant: 'warning'
    }
  ], []);

  const actionButtons = useMemo(() => ({
    primaryButton: {
      text: 'Go to Dashboard',
      icon: 'bi bi-speedometer2',
      href: '/dashboard',
      variant: 'light'
    },
    secondaryButton: {
      text: 'My Profile',
      icon: 'bi bi-person',
      href: '/profile',
      variant: 'light'
    }
  }), []);

  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-5">
        <PageHeader
          title={welcomeTitle}
          subtitle="Your personal workspace is ready. Manage your projects and track progress."
          icon="bi bi-house-heart"
          variant="hero"
          className="mb-5"
        />

        <StatsGrid 
          stats={stats} 
          columns={4} 
          className="mb-5" 
        />

        <div className="row g-4 mb-5">
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              className="col-md-4"
              {...action}
            />
          ))}
        </div>

        <CallToAction
          title="Ready to get started?"
          subtitle="Explore your workspace and manage projects efficiently."
          primaryButton={actionButtons.primaryButton}
          secondaryButton={actionButtons.secondaryButton}
        />
        
      </div>
    </div>
  );
});

Home.displayName = 'Home';

export default Home;
