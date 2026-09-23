import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';
import { Prisma } from '../generated/prisma/index.js';
import { prisma } from '../config/db.js';
import { notificationService } from './notification.service.js';

export class UserService {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const { password, deletedAt, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers() {
    return userRepository.findAll();
  }

  async updateProfile(userId: string, data: any) {
    const updateData: Prisma.UserUpdateInput = { ...data };
    if (data.phoneNumber && !data.phone) {
      updateData.phone = data.phoneNumber;
      delete (updateData as any).phoneNumber;
    }
    const updatedUser = await userRepository.update(userId, updateData);
    const { password, deletedAt, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async changePassword(userId: string, data: any) {
    const { currentPassword, newPassword } = data;

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify current password
    if (!user.password) {
      throw new BadRequestError('Account uses Google Sign-In, cannot change password this way');
    }
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new BadRequestError('Incorrect current password');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    await userRepository.update(userId, { password: hashedNewPassword });

    return { message: 'Password updated successfully' };
  }

  async updateUserRole(userId: string, newRole: any) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await userRepository.update(userId, { role: newRole });

    if (newRole === 'BUSINESS_PARTNER') {
      // If user has a pending KYC, update it to verified
      await prisma.partnerKyc.updateMany({
        where: { userId },
        data: { status: 'KYC_VERIFIED', verifiedAt: new Date() },
      }).catch(() => {});

      // Send approval notification to the user
      await notificationService.createNotification({
        userId,
        title: 'Business Partner Application Approved!',
        message: 'Congratulations! Your request to become a Business Partner on WildConnect has been approved by the Administrator. You now have full access to the Partner Dashboard.',
        type: 'KYC_VERIFIED' as any,
        referenceId: userId,
      }).catch(() => {});
    }

    const { password, deletedAt, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}

export const userService = new UserService();
