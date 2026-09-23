import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../../hooks/useAuth';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import Input from '../../../components/forms/Input';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import SecondaryButton from '../../../components/buttons/SecondaryButton';
import '../../../styles/tourist/DashboardSubpages.css';
import '../../../styles/tourist/Dashboard.css';

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const Settings = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await api.patch('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response.data.success) {
        toast.success('Password updated successfully');
        reset();
      } else {
        toast.error(response.data.message || 'Failed to update password');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <Link
        to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'}
        className="back-link"
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
      </Link>

      <div className="dashboard-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            backgroundColor: 'rgba(217, 107, 39, 0.1)',
            color: '#D96B27',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={32} />
          </div>
          <div>
            <h1 className="dashboard-header-title">Security Settings</h1>
            <p className="dashboard-header-subtitle">Update your security credentials</p>
          </div>
        </div>
      </div>

      <div className="dashboard-page-content" style={{ maxWidth: '42rem' }}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label="Current Password"
                type="password"
                error={errors.currentPassword?.message}
                icon={<Lock size={16} />}
                {...register('currentPassword')}
              />

              <Input
                label="New Password"
                type="password"
                error={errors.newPassword?.message}
                icon={<Lock size={16} />}
                {...register('newPassword')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                error={errors.confirmPassword?.message}
                icon={<Lock size={16} />}
                {...register('confirmPassword')}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '1rem' }}>
                <SecondaryButton type="button" onClick={() => reset()} disabled={isSubmitting} size="sm" variant="outline">
                  Reset
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={isSubmitting} size="sm">
                  {isSubmitting ? 'Saving...' : 'Update Password'}
                </PrimaryButton>
              </div>
            </form>
      </div>
    </div>
  );
};

export default Settings;
