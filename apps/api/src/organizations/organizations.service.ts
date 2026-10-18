import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.organization.create({
      data: {
        ...data,
        members: {
          create: { userId, role: 'OWNER' },
        },
      },
    });
  }

  async getCatalog(orgId: string) {
    return this.prisma.book.findMany({
      where: { organizationId: orgId },
      include: {
        owner: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });
  }

  async issueMembershipCard(adminId: string, orgId: string, userId: string) {
    // 1. Verify admin role
    const admin = await this.prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId: adminId } },
    });
    if (!admin || admin.role === 'STAFF') throw new ForbiddenException('Admin access required');

    // 2. Issue card
    return this.prisma.organizationMembershipCard.create({
      data: {
        organizationId: orgId,
        userId,
        cardNumber: `CARD-${orgId.substring(0, 4).toUpperCase()}-${Date.now()}`,
      },
    });
  }
}
