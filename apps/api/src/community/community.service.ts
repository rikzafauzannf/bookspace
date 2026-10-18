import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async setReadingChallenge(userId: string, targetCount: number, year: number) {
    return this.prisma.readingChallenge.upsert({
      where: { userId_year: { userId, year } },
      update: { targetCount },
      create: { userId, targetCount, year },
    });
  }

  async createReadingList(userId: string, data: any) {
    return this.prisma.readingList.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        isPublic: data.isPublic ?? true,
        items: {
          createMany: {
            data: data.items || [],
          },
        },
      },
      include: { items: true },
    });
  }

  async getPublicReadingLists() {
    return this.prisma.readingList.findMany({
      where: { isPublic: true },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
