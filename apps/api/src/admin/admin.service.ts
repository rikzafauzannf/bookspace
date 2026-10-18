import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Dashboard Stats
  async getDashboardStats() {
    const [totalUsers, totalBooks, totalTransactions, activeLoans] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.book.count(),
      this.prisma.transaction.count({ where: { status: 'COMPLETED' } }),
      this.prisma.transaction.count({ where: { status: 'HANDED_OVER' } }),
    ]);

    return {
      totalUsers,
      totalBooks,
      totalTransactions,
      activeLoans,
    };
  }

  // Reports Management
  async getReports() {
    return this.prisma.report.findMany({
      include: {
        reporter: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReport(reporterId: string, data: any) {
    return this.prisma.report.create({
      data: {
        reporterId,
        targetType: data.targetType,
        targetId: data.targetId,
        reason: data.reason,
      },
    });
  }

  // User Management
  async toggleBlockUser(adminId: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });

    // Audit Log
    await this.logAdminAction(adminId, 'TOGGLE_USER_BLOCK', userId, {
      previousState: user.isActive,
      newState: updated.isActive,
    });

    return updated;
  }

  // Audit Logs
  private async logAdminAction(adminId: string, action: string, targetId: string, details: any) {
    await this.prisma.adminAuditLog.create({
      data: {
        adminId,
        action,
        targetId,
        details,
      },
    });
  }

  async getAuditLogs() {
    return this.prisma.adminAuditLog.findMany({
      include: {
        admin: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
