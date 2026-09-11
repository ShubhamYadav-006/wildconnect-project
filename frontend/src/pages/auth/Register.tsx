import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  User,
  Mail,
  Lock,
  Trees,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../hooks/useAuth";

import { authService } from "../../services/auth.service";

import "../../styles/pages/Register.css";

/* ==========================================================
   Validation Schema
========================================================== */

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),

    lastName: z.string().min(2, "Last name is required"),

    email: z.string().email("Invalid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  /* ==========================================================
     Register
  ========================================================== */

  const onSubmit = async (
    data: RegisterFormValues
  ) => {
    try {
      const { confirmPassword: _confirmPassword, ...registerData } = data;

      const response =
        await authService.register(registerData);

      if (response.success) {
        toast.success(
          "Registration successful!"
        );

        navigate("/login");
      } else {
        toast.error(
          response.message ||
          "Registration failed."
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Registration failed."
      );
    }
  };

  const onGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const response = await authService.googleLogin(credentialResponse.credential);
        if (response.success) {
          const loggedInUser = response.data.user;
          login(loggedInUser);
          toast.success("Welcome! Account created successfully.");
          let targetPath = "/dashboard";
          if (loggedInUser.role === 'ADMIN') targetPath = "/admin";
          else if (loggedInUser.role === 'BUSINESS_PARTNER') targetPath = "/partner";
          navigate(targetPath, { replace: true });
        } else {
          toast.error(response.message || "Google Sign-Up failed.");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Google Sign-Up failed.");
      }
    }
  };

  return (
    <main className="register-page">
      {/* Centered Register Card */}
      <section className="register-card">
        {/* Brand Logo */}
        <div className="register-logo-container">
          <Link to="/" className="register-logo-link">
            <Trees size={36} className="register-logo-icon" />
            <span>WildConnect</span>
          </Link>
        </div>

        {/* Header */}
        <div className="register-header">
          <h1 className="register-title">
            Create Account
          </h1>
          <p className="register-subtitle">
            Join WildConnect and start planning unforgettable wildlife adventures.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="register-form"
        >
          {/* First + Last Name */}
          <div className="register-grid">
            <div>
              <label className="register-label">
                First Name
              </label>
              <div className="register-input">
                <User size={18} />
                <input
                  type="text"
                  placeholder="First Name"
                  className="input-field"
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && (
                <p className="register-error">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="register-label">
                Last Name
              </label>
              <div className="register-input">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input-field"
                  {...register("lastName")}
                />
              </div>
              {errors.lastName && (
                <p className="register-error">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="register-label">
              Email Address
            </label>
            <div className="register-input">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Enter your email"
                className="input-field"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="register-error">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="register-label">
              Password
            </label>
            <div className="register-input">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Create password"
                className="input-field"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="register-error">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="register-label">
              Confirm Password
            </label>
            <div className="register-input">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Confirm password"
                className="input-field"
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && (
              <p className="register-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="register-btn-submit"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
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
                toast.error("Google Sign-Up was unsuccessful.");
              }}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="register-footer">
          <p>
            Already have an account?
            <Link
              to="/login"
              className="register-link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;