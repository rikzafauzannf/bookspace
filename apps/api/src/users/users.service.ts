import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { passwordHash, ...result } = user;
    return result;
  }

  async update(id: string, data: any) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  // Follow logic
  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new BadRequestException('You cannot follow yourself');

    const existing = await this.prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      await this.prisma.follow.delete({ where: { id: existing.id } });
      return { following: false };
    } else {
      await this.prisma.follow.create({ data: { followerId, followingId } });
      return { following: true };
    }
  }

  async getFollowers(userId: string) {
    return this.prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: { select: { id: true, fullName: true, avatarUrl: true } } },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: { select: { id: true, fullName: true, avatarUrl: true } } },
    });
  }
}
