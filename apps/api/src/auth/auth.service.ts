import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

import { generateRefreshToken, hashRefreshToken } from './token.util.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async issueTokens(user: { id: string; email: string }) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    const refreshToken = generateRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashRefreshToken(refreshToken),
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const passwordHash = await argon2.hash(dto.password, {
      type: argon2.argon2id,
    });

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          phone: dto.phone?.trim(),
        },
      });

      const tokens = await this.issueTokens(user);

      return {
        message: 'Registration successful',
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already registered');
      }

      throw error;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.issueTokens(user);

    return {
      message: 'Login successful',
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refresh(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);
    const now = new Date();

    const result = await this.prisma.$transaction(async (tx) => {
      const storedToken = await tx.refreshToken.findUnique({
        where: { tokenHash },
      });

      if (!storedToken) {
        return { invalid: true as const };
      }

      // Reuse of a revoked token: revoke all active sessions.
      if (storedToken.revokedAt) {
        await tx.refreshToken.updateMany({
          where: {
            userId: storedToken.userId,
            revokedAt: null,
          },
          data: { revokedAt: now },
        });

        return { reused: true as const };
      }

      if (storedToken.expiresAt <= now) {
        await tx.refreshToken.updateMany({
          where: {
            id: storedToken.id,
            revokedAt: null,
          },
          data: { revokedAt: now },
        });

        return { invalid: true as const };
      }

      const user = await tx.user.findUnique({
        where: { id: storedToken.userId },
      });

      if (!user || !user.isActive) {
        return { invalid: true as const };
      }

      // Atomically consume the old refresh token.
      const consumed = await tx.refreshToken.updateMany({
        where: {
          id: storedToken.id,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: { revokedAt: now },
      });

      if (consumed.count !== 1) {
        await tx.refreshToken.updateMany({
          where: {
            userId: storedToken.userId,
            revokedAt: null,
          },
          data: { revokedAt: now },
        });

        return { reused: true as const };
      }

      const newRefreshToken = generateRefreshToken();
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 30);

      await tx.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: hashRefreshToken(newRefreshToken),
          expiresAt: newExpiry,
        },
      });

      return {
        accessToken: await this.jwtService.signAsync({
          sub: user.id,
          email: user.email,
        }),
        refreshToken: newRefreshToken,
        expiresIn: 900,
      };
    });

    if ('invalid' in result) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if ('reused' in result) {
      throw new UnauthorizedException(
        'Refresh token reuse detected. Please log in again.',
      );
    }

    return {
      message: 'Tokens refreshed successfully',
      ...result,
    };
  }

  async logout(refreshToken: string) {
    const tokenHash = hashRefreshToken(refreshToken);

    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return { message: 'Logout successful' };
  }
}
