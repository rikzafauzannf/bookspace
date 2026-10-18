import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { RegisterInput, LoginInput, AuthResponse } from '@app/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterInput): Promise<AuthResponse> {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash,
      },
    });

    return this.createAuthResponse(user);
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return this.createAuthResponse(user);
  }

  private async createAuthResponse(user: any): Promise<AuthResponse> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '1h' });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    // Save refresh token to DB
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return {
      user: {
        ...userWithoutPassword,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      },
    };
  }

  async refreshToken(token: string): Promise<any> {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke old token and issue new ones
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { isRevoked: true },
    });

    return this.createAuthResponse(storedToken.user);
  }
}
