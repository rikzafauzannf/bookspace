import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Any authenticated user can submit a report
  @Post('reports')
  @ApiOperation({ summary: 'Submit a report against user/content' })
  createReport(@Request() req, @Body() body: any) {
    return this.adminService.createReport(req.user.id, body);
  }

  // Admin Only Endpoints
  @UseGuards(RolesGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @UseGuards(RolesGuard)
  @Get('reports')
  @ApiOperation({ summary: 'Get all reports' })
  getReports() {
    return this.adminService.getReports();
  }

  @UseGuards(RolesGuard)
  @Patch('users/:id/toggle-block')
  @ApiOperation({ summary: 'Block or unblock a user' })
  toggleBlock(@Request() req, @Param('id') userId: string) {
    return this.adminService.toggleBlockUser(req.user.id, userId);
  }

  @UseGuards(RolesGuard)
  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs of admin actions' })
  getAuditLogs() {
    return this.adminService.getAuditLogs();
  }
}
