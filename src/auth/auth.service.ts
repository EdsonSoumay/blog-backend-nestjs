import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginUserAttributes, RegisterUserAttributes } from '../utils/model/user.model';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';
import { ValidationService } from 'src/common/validation/validation.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserValidation } from '../utils/helpers/validationSchema.helpers';
import { JwtService } from 'src/common/jwt/jwt.service';
import { handleValidationError } from 'src/utils/helpers/validationException.helpers';

@Injectable()
export class AuthService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private readonly jwtService: JwtService, // use the custom JwtService
  ) {}

  async register(request: RegisterUserAttributes): Promise<void> {
    try {
      this.logger.debug(`Register new user ${JSON.stringify(request)}`);
      const registerRequest: RegisterUserAttributes = this.validationService.validate(UserValidation.registerSchema, request);
  
      // Periksa apakah username atau email sudah ada
      const totalUserWithSameUsernameAndEmail = await this.prismaService.users.count({
        where: {
          OR: [
            { username: registerRequest.username },
            { email: registerRequest.email },
          ],
        },
      });
  
      if (totalUserWithSameUsernameAndEmail > 0) {
        throw new HttpException({ message: 'Duplicate user or email'}, HttpStatus.CONFLICT);
      }
  
      registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
  
      await this.prismaService.users.create({
        data: registerRequest,
      });
    } catch (err) {
      // Handle Yup validation errors
      handleValidationError(err)
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(request: LoginUserAttributes): Promise<any> {
    try {
      const loginRequest: LoginUserAttributes = this.validationService.validate(UserValidation.loginSchema, request);

      const { username, password } = loginRequest;

      // Check if user exists
      const user = await this.prismaService.users.findFirst({where: { username }});
      if (!user) {
        throw new HttpException({ message: 'User not found' }, HttpStatus.NOT_FOUND);
      }

      // Compare passwords
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new HttpException({ message: 'Wrong credentials!' }, HttpStatus.UNAUTHORIZED);
      }

      const payload = {id: user.id, username: user.username};
      
      // Use your custom JwtService to sign the token
      const token = this.jwtService.generateToken(payload);
      const refreshToken = this.jwtService.generateRefreshToken(payload);

      return { 
        token, 
        refreshToken,
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email 
        }
      };
    } catch (err) {
      handleValidationError(err)
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async refetch(refreshToken: string): Promise<{ user: any, newToken: string }> {
    try {
      // Verifikasi refresh token menggunakan JwtService
      const decoded = this.jwtService.extractRefreshToken(refreshToken);

      // Temukan pengguna berdasarkan ID yang terdapat dalam refresh token
      const user = await this.prismaService.users.findUnique({ where: { id: decoded.id } });
      if (!user) {
        throw new HttpException({message:'User not found!'}, 404);
      }

      // Siapkan data user yang ingin dikirimkan dan generate token baru
      const dataUser = { id: user.id, username: user.username };
      const newToken = this.jwtService.generateToken(dataUser);

      return { user: dataUser, newToken };
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
