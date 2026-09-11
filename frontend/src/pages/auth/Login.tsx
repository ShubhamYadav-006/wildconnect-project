import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Trees } from "lucide-react";
import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";

import "../../styles/pages/Login.css";

/* ==========================================================
   Validation Schema
========================================================== */

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  /* ==========================================================
     Login Submit
  ========================================================== */

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await authService.login(data);

      if (response.success) {
        const loggedInUser = response.data.user;
        login(loggedInUser);

        toast.success("Welcome back!");

        let targetPath = from;
        if (from === "/dashboard") {
          if (loggedInUser.role === 'ADMIN') targetPath = "/admin";
          else if (loggedInUser.role === 'BUSINESS_PARTNER') targetPath = "/partner";
        }
        navigate(targetPath, { replace: true });
      } else {
        toast.error(response.message || "Login failed.");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  const onGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const response = await authService.googleLogin(credentialResponse.credential);
        if (response.success) {
          const loggedInUser = response.data.user;
          login(loggedInUser);
          toast.success("Welcome back!");
          let targetPath = from;
          if (from === "/dashboard") {
            if (loggedInUser.role === 'ADMIN') targetPath = "/admin";
            else if (loggedInUser.role === 'BUSINESS_PARTNER') targetPath = "/partner";
          }
          navigate(targetPath, { replace: true });
        } else {
          toast.error(response.message || "Google Login failed.");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Google Login failed.");
      }
    }
  };

  return (
    <main className="login-page">
      {/* Centered Login Card */}
      <section className="login-card">
        {/* Brand Logo */}
        <div className="login-logo-container">
          <Link to="/" className="login-logo-link">
            <Trees size={36} className="login-logo-icon" />
            <span>WildConnect</span>
          </Link>
        </div>

        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">
            Welcome Back
          </h1>
          <p className="login-subtitle">
            Sign in to continue planning your next wildlife adventure.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="login-form"
        >
          {/* Email */}
          <div>
            <label className="login-label">
              Email Address
            </label>
            <div className="login-input">
              <Mail size={18} />
              <input
                type="email"
                className="input-field"
                placeholder="Enter your email"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="login-error">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="login-label">
              Password
            </label>
            <div className="login-input">
              <Lock size={18} />
              <input
                type="password"
                className="input-field"
                placeholder="Enter your password"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="login-error">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember */}
          <div className="login-options">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="login-btn-submit"
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ margin: '0 10px', color: '#64748b', fontSize: '0.875rem' }}>Or continue with</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={() => {
                toast.error("Google Sign-In was unsuccessful.");
              }}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>
            Don't have an account?
            <Link
              to="/register"
              className="login-link"
            >
              Create Account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;