import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserAttributes } from 'src/utils/model/user.model';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findUserByIdRepository(id: number): Promise<any> {
    return await this.prismaService.users.findUnique({ where: { id } });
  }

  async updateUserRepository(userId: number,  value: UserAttributes ): Promise<void> {
     await this.prismaService.users.update({
      where: {id:userId},
      data: {
        password: value.password,
        first_name: value.first_name,
        last_name: value.last_name,	
        email: value.email
      },
    });
  }

  async deleteUserRepository(userId: number): Promise<void>{
    await this.prismaService.users.delete({where:{id:userId}})
  }
}
