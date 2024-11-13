import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findUserById(id: number): Promise<any> {
    return this.prismaService.users.findUnique({ where: { id } });
  }
}
