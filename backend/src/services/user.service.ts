import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError, BadRequestError } from '../utils/AppError.js';
import { Prisma } from '../generated/prisma/index.js';

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
}

export const userService = new UserService();
