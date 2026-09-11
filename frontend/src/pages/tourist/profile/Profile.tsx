import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, User as UserIcon, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../services/api';
import Input from '../../../components/forms/Input';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import SecondaryButton from '../../../components/buttons/SecondaryButton';
import '../../../styles/pages/DashboardSubpages.css';
import '../../../styles/pages/Dashboard.css';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Endpoint to update tourist profile
      const response = await api.patch('/auth/profile', {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber
      });
      if (response.data.success) {
        toast.success('Profile updated successfully');
        // Update user inside context
        login({
          ...user!,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber
        });
        setIsEditing(false);
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
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
            backgroundColor: 'rgba(46, 117, 89, 0.1)',
            color: '#2E7559',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserIcon size={32} />
          </div>
          <div>
            <h1 className="dashboard-header-title">My Profile</h1>
            <p className="dashboard-header-subtitle">Manage your personal details and contact info</p>
          </div>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="dashboard-page-btn" style={{ backgroundColor: '#C19A5B', boxShadow: 'none' }}>
            Edit Profile
          </button>
        )}
      </div>

      <div className="dashboard-page-content">
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-cols-2" style={{ display: 'grid', gap: '1rem' }}>
            <Input
              label="First Name *"
              error={errors.firstName?.message}
              disabled={!isEditing}
              {...register('firstName')}
            />

            <Input
              label="Last Name *"
              error={errors.lastName?.message}
              disabled={!isEditing}
              {...register('lastName')}
            />
          </div>

          <div className="grid-cols-2" style={{ display: 'grid', gap: '1rem' }}>
            <Input
              label="Email Address (Disabled)"
              type="email"
              disabled={true}
              icon={<Mail size={16} />}
              style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              {...register('email')}
            />

            <Input
              label="Phone Number"
              type="tel"
              disabled={!isEditing}
              icon={<Phone size={16} />}
              placeholder="+91"
              {...register('phoneNumber')}
            />
          </div>

          {isEditing && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <SecondaryButton
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
                size="sm"
                variant="outline"
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                disabled={isSubmitting}
                size="sm"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </PrimaryButton>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
