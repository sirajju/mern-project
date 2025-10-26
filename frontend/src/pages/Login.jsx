import React, { useState, useCallback, useMemo, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { AuthLayout, FormInput, Button, ButtonGroup } from "../components/ui";
import "../styles/animations.css";

const Login = memo(() => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = useCallback(async (data) => {
    setLoading(true);

    try {
      const { authAPI, adminAPI, setAuthToken, setAdminToken } = await import(
        "../utils/api"
      );
      const isAdminAttempt =
        data.email.includes("admin") || data.email === "admin@example.com";

      let response;
      if (isAdminAttempt) {
        response = await adminAPI.login({
          email: data.email,
          password: data.password,
        });
        setAdminToken(response.data.token);
      } else {
        response = await authAPI.login({
          email: data.email,
          password: data.password,
        });
        setAuthToken(response.data.token);
      }
      const userData = response.data.user || response.data.admin;
      
      const user = {
        id: userData.id || userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role || (isAdminAttempt ? "admin" : "user"),
        avatar: userData.avatar || null,
      };

      login(user);
      toast.success(`Welcome back, ${userData.name || "User"}!`);
      
      setTimeout(() => {
        if (user.role === "admin" || isAdminAttempt) {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 100);
    } catch (err) {
      console.error("Login error:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.error?.message
        err.message ||
        "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [navigate, login]);

  const loginButtons = useMemo(() => [
    {
      key: false,
      label: 'User Login',
      icon: 'bi bi-person',
      variant: 'outline-primary'
    },
    {
      key: true,
      label: 'Admin Login',
      icon: 'bi bi-shield-lock',
      variant: 'outline-warning'
    }
  ], []);

  const handleAdminToggle = useCallback((value) => {
    setIsAdminLogin(value);
  }, []);

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Please sign in to continue."
    >
      <ButtonGroup
        className="mb-4"
        buttons={loginButtons}
        activeKey={isAdminLogin}
        onSelect={handleAdminToggle}
      />

      <div className="text-center mb-4">
        <small className="text-muted">Or sign in with your account</small>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <FormInput
          label="Email Address"
          type="email"
          icon="bi bi-envelope"
          placeholder="Enter your email"
          {...register("email")}
          required
        />

        <FormInput
          label="Password"
          type="password"
          icon="bi bi-lock"
          placeholder="Enter your password"
          {...register("password")}
          required
        />

        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
              {...register("remember")}
            />
            <label className="form-check-label" htmlFor="remember">
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-decoration-none">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          loading={loading}
          icon="bi bi-box-arrow-in-right"
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="text-center mt-4">
        <p className="mb-0">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-decoration-none fw-semibold"
          >
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-4">
        <div className="text-center mb-3">
          <small className="text-muted">Or continue with</small>
        </div>
        <div className="row g-2">
          <div className="col-6">
            <Button variant="outline-secondary" size="sm" block>
              <i className="bi bi-google me-2"></i>
              Google
            </Button>
          </div>
          <div className="col-6">
            <Button variant="outline-secondary" size="sm" block>
              <i className="bi bi-github me-2"></i>
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
});

Login.displayName = 'Login';

export default Login;
