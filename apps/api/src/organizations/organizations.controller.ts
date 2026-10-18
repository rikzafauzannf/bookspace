import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an organization account' })
  create(@Request() req, @Body() body: any) {
    return this.orgService.create(req.user.id, body);
  }

  @Get(':id/catalog')
  @ApiOperation({ summary: 'Get organization book catalog' })
  getCatalog(@Param('id') id: string) {
    return this.orgService.getCatalog(id);
  }

  @Post(':id/issue-card')
  @ApiOperation({ summary: 'Issue membership card' })
  issueCard(@Request() req, @Param('id') id: string, @Body('userId') userId: string) {
    return this.orgService.issueMembershipCard(req.user.id, id, userId);
  }
}
