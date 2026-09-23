import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  User,
  Mail,
  Lock,
  Phone,
  Trees,
  Compass,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../hooks/useAuth";

import { authService } from "../../services/auth.service";

import "../../styles/auth/Register.css";

/* ==========================================================
   Validation Schema
========================================================== */

const registerSchema = z
  .object({
    role: z.enum(["TOURIST", "BUSINESS_PARTNER"]),

    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be under 50 characters"),

    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be under 50 characters"),

    email: z.string().email("Please enter a valid email address"),

    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val),
        "Please enter a valid phone number"
      ),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"TOURIST" | "BUSINESS_PARTNER">("TOURIST");

  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "TOURIST",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRoleSelect = (role: "TOURIST" | "BUSINESS_PARTNER") => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
  };

  /* ==========================================================
     Register Submit
  ========================================================== */

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const { confirmPassword: _confirmPassword, ...registerData } = data;

      const response = await authService.register(registerData);

      if (response.success) {
        if (data.role === "BUSINESS_PARTNER") {
          toast.success(
            "Partner application submitted! An admin will review and approve your account shortly.",
            { duration: 6000 }
          );
        } else {
          toast.success("Account created successfully! Please sign in.");
        }

        navigate("/login");
      } else {
        toast.error(response.message || "Registration failed.");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Registration failed. Please check your details."
      );
    }
  };

  const onGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const response = await authService.googleLogin(credentialResponse.credential, selectedRole);
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
            {selectedRole === "BUSINESS_PARTNER"
              ? "Join as a partner to list your safari stays, gypsies, or gear."
              : "Join WildConnect and start planning unforgettable wildlife adventures."}
          </p>
        </div>

        {/* Role / Account Type Selector */}
        <div className="register-role-selector">
          <label className="register-label">I want to register as</label>
          <div className="role-options-grid">
            <button
              type="button"
              className={`role-option-card ${selectedRole === "TOURIST" ? "active" : ""}`}
              onClick={() => handleRoleSelect("TOURIST")}
            >
              <div className="role-option-header">
                <Compass size={20} className="role-icon" />
                <span className="role-name">Traveler / Tourist</span>
                {selectedRole === "TOURIST" && <CheckCircle2 size={16} className="role-check" />}
              </div>
              <p className="role-desc">Explore parks, book resorts, and request custom safari trips.</p>
            </button>

            <button
              type="button"
              className={`role-option-card ${selectedRole === "BUSINESS_PARTNER" ? "active" : ""}`}
              onClick={() => handleRoleSelect("BUSINESS_PARTNER")}
            >
              <div className="role-option-header">
                <Briefcase size={20} className="role-icon" />
                <span className="role-name">Business Partner</span>
                {selectedRole === "BUSINESS_PARTNER" && <CheckCircle2 size={16} className="role-check" />}
              </div>
              <p className="role-desc">List resorts, safari cabs, camera gear, and manage bookings.</p>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          {/* Hidden Role Input */}
          <input type="hidden" {...register("role")} />

          {/* First + Last Name */}
          <div className="register-grid">
            <div>
              <label className="register-label">First Name *</label>
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
                <p className="register-error">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="register-label">Last Name *</label>
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
                <p className="register-error">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="register-label">Email Address *</label>
            <div className="register-input">
              <Mail size={18} />
              <input
                type="email"
                placeholder={selectedRole === "BUSINESS_PARTNER" ? "partner@business.com" : "name@example.com"}
                className="input-field"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="register-error">{errors.email.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="register-label">
              Phone Number {selectedRole === "BUSINESS_PARTNER" ? "(Recommended)" : "(Optional)"}
            </label>
            <div className="register-input">
              <Phone size={18} />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="input-field"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="register-error">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="register-label">Password * (Min 8 chars, letter + number)</label>
            <div className="register-input">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Create secure password"
                className="input-field"
                {...register("password")}
              />
            </div>
            {errors.password && (
              <p className="register-error">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="register-label">Confirm Password *</label>
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
              <p className="register-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="register-btn-submit"
          >
            {isSubmitting
              ? "Creating Account..."
              : selectedRole === "BUSINESS_PARTNER"
              ? "Register as Partner"
              : "Create Traveler Account"}
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
            <Link to="/login" className="register-link">
              Sign In
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;