import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    // Eksplisit membuang data sensitif
    const { passwordHash, cityId, districtId, ...result } = user;
    return result;
  }

  // ... sisanya tidak berubah
}
