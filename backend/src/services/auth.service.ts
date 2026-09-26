import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { userRepository } from '../repositories/user.repository.js';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/AppError.js';
import { signToken } from '../utils/jwt.js';
import { Prisma } from '../generated/prisma/index.js';
import { prisma } from '../config/db.js';
import { notificationService } from './notification.service.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  async register(data: Prisma.UserCreateInput) {
    // Check if email is already in use
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already in use');
    }

    // Hash password
    const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : undefined;
    const requestedRole = data.role;

    // Partner accounts start as TOURIST with pending partner approval
    const initialRole = requestedRole === 'BUSINESS_PARTNER' ? 'TOURIST' : (data.role || 'TOURIST');

    // Create user
    const newUser = await userRepository.create({
      ...data,
      password: hashedPassword,
      role: initialRole,
    });

    if (requestedRole === 'BUSINESS_PARTNER') {
      // Find admin users to notify
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN', deletedAt: null },
      });

      for (const admin of admins) {
        await notificationService.createNotification({
          userId: admin.id,
          title: 'New Partner Registration Request',
          message: `${newUser.firstName} ${newUser.lastName} (${newUser.email}) has requested to register as a Business Partner.`,
          type: 'BUSINESS_PENDING' as any,
          referenceId: newUser.id,
        }).catch(() => {});
      }
    }

    // Generate token
    const token = signToken({ id: newUser.id, role: newUser.role });

    // Remove password from response
    const { password, deletedAt, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token,
      isPendingPartnerApproval: requestedRole === 'BUSINESS_PARTNER',
    };
  }

  async login(data: any) {
    const { email, password: plainPassword, role: expectedRole } = data;

    // Check if user exists
    const user = await userRepository.findByEmail(email);
    if (!user || user.deletedAt) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check password
    if (!user.password) {
      throw new UnauthorizedError('Please sign in with Google');
    }
    const isPasswordCorrect = await bcrypt.compare(plainPassword, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check role consistency if a specific role was selected (ADMIN can sign in from anywhere)
    if (expectedRole && user.role !== 'ADMIN' && user.role !== expectedRole) {
      const actualRoleLabel = user.role === 'TOURIST' ? 'User / Traveller' : 'Business Partner';
      throw new UnauthorizedError(
        `This account is registered as a ${actualRoleLabel}. Please select ${actualRoleLabel} to sign in.`
      );
    }

    // Generate token with persistent database role
    const token = signToken({ id: user.id, role: user.role });

    // Remove password from response
    const { password, deletedAt, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async googleLogin(credential: string, role?: 'TOURIST' | 'BUSINESS_PARTNER') {
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (error) {
      throw new UnauthorizedError('Invalid Google token');
    }

    if (!payload || !payload.email) {
      throw new UnauthorizedError('Invalid Google token payload');
    }

    if (!payload.email_verified) {
      throw new UnauthorizedError('Google email is not verified');
    }

    const email = payload.email;
    let user = await userRepository.findByEmail(email);

    if (user && user.deletedAt) {
      throw new UnauthorizedError('Account is disabled');
    }

    if (!user) {
      const assignedRole = role === 'BUSINESS_PARTNER' ? 'BUSINESS_PARTNER' : 'TOURIST';
      user = await userRepository.create({
        firstName: payload.given_name || 'User',
        lastName: payload.family_name || '',
        email: email,
        googleId: payload.sub,
        avatar: payload.picture,
        role: assignedRole,
      });
    } else {
      // Check role consistency if an existing non-admin user chose a different role portal
      if (role && user.role !== 'ADMIN' && user.role !== role) {
        const actualRoleLabel = user.role === 'TOURIST' ? 'User / Traveller' : 'Business Partner';
        throw new UnauthorizedError(
          `This Google account is registered as a ${actualRoleLabel}. Please choose ${actualRoleLabel}.`
        );
      }

      if (!user.googleId) {
        user = await userRepository.update(user.id, {
          googleId: payload.sub,
          avatar: user.avatar || payload.picture,
        });
      }
    }

    const token = signToken({ id: user.id, role: user.role });
    const { password, deletedAt, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}

export const authService = new AuthService();
