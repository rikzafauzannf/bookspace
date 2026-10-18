import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  async createClub(userId: string, data: any) {
    const club = await this.prisma.club.create({
      data: {
        ...data,
        ownerId: userId,
        members: {
          create: {
            userId,
            isAdmin: true,
          },
        },
      },
      include: { members: true },
    });
    return club;
  }

  async joinClub(userId: string, clubId: string) {
    const existing = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    });

    if (existing) throw new BadRequestException('Already a member of this club');

    return this.prisma.clubMember.create({
      data: { clubId, userId },
    });
  }

  async getClubDetails(clubId: string) {
    const club = await this.prisma.club.findUnique({
      where: { id: clubId },
      include: {
        owner: { select: { id: true, fullName: true, avatarUrl: true } },
        members: { include: { user: { select: { id: true, fullName: true, avatarUrl: true } } } },
        booksOfMonth: true,
        discussions: { include: { user: { select: { id: true, fullName: true, avatarUrl: true } } } },
      },
    });
    if (!club) throw new NotFoundException('Club not found');
    return club;
  }

  async addDiscussion(userId: string, clubId: string, data: any) {
    const member = await this.prisma.clubMember.findUnique({
      where: { clubId_userId: { clubId, userId } },
    });
    if (!member) throw new BadRequestException('Must be a club member to post discussions');

    return this.prisma.discussion.create({
      data: {
        clubId,
        userId,
        ...data,
      },
    });
  }
}
