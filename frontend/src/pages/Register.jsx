import '../styles/animations.css'
import React, { useState, useCallback, useMemo, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { AuthLayout, FormInput, Button, FeatureList } from '../components/ui'

const Register = memo(() => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    }
  })

  const onSubmit = useCallback(async (data) => {
    setLoading(true)
    
    try {
      const { authAPI, setAuthToken } = await import('../utils/api')
      
      if (data.password !== data.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }
      
      const response = await authAPI.register({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
      })

      setAuthToken(response.data.token)
      
      const user = {
        id: response.data.user.id || response.data.user._id,
        name: response.data.user.name,
        email: response.data.user.email,
        role: response.data.user.role || 'user',
        avatar: response.data.user.avatar || null
      };
      
      login(user);
      toast.success('Registration successful! Welcome to the platform.');
      
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Registration error:', err)
      const message = err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [navigate, login])

  const features = useMemo(() => [
    { id: 'secure', icon: 'bi bi-shield-check', title: 'Secure', description: 'Enterprise-grade security' },
    { id: 'fast', icon: 'bi bi-lightning', title: 'Fast', description: 'Lightning-fast performance' },
    { id: 'reliable', icon: 'bi bi-heart', title: 'Reliable', description: 'Always available when you need it' }
  ], [])

  const leftContent = useMemo(() => (
    <div className="text-center p-5 animate-slide-in-left">
      <h2 className="fw-bold mb-3">Join TaskFlow Today</h2>
      <p className="opacity-90">Create your account and start managing projects efficiently</p>
    </div>
  ), [])

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join thousands of users who trust TaskFlow"
      leftContent={leftContent}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-2">
          <div className="col-6">
            <FormInput
              label="First Name"
              placeholder="First name"
              {...register('firstName')}
              required
            />
          </div>
          <div className="col-6">
            <FormInput
              label="Last Name"
              placeholder="Last name"
              {...register('lastName')}
              required
            />
          </div>
        </div>

        <FormInput
          label="Email Address"
          type="email"
          icon="bi bi-envelope"
          placeholder="Enter your email"
          {...register('email')}
          required
        />

        <FormInput
          label="Password"
          type="password"
          icon="bi bi-lock"
          placeholder="Create password"
          helpText="Must be at least 6 characters"
          {...register('password')}
          required
        />

        <FormInput
          label="Confirm Password"
          type="password"
          icon="bi bi-lock-fill"
          placeholder="Confirm password"
          {...register('confirmPassword')}
          required
        />

        <div className="mb-4">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="agreeToTerms"
              {...register('agreeToTerms')}
              required
            />
            <label className="form-check-label" htmlFor="agreeToTerms">
              I agree to the{' '}
              <Link to="/terms" className="text-decoration-none">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          loading={loading}
          icon="bi bi-person-plus"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="text-center mt-4">
        <span className="text-muted">Already have an account? </span>
        <Link to="/login" className="text-decoration-none fw-medium">
          Sign in here
        </Link>
      </div>

      <div className="mt-5">
        <FeatureList features={features} variant="horizontal" />
      </div>
    </AuthLayout>
  );
});

Register.displayName = 'Register';

export default Register;