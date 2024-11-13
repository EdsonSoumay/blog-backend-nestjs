import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UserRequest } from 'src/model/user.model';



@Injectable()
export class JwtService {
  private readonly jwtSecretKey: string;
  private readonly jwtRefreshTokenSecretKey: string;

  constructor(private configService: ConfigService) {
    // Memuat secret key untuk token dan refresh token dari config
    this.jwtSecretKey = this.configService.get<string>('JWT_TOKEN_KEY');
    this.jwtRefreshTokenSecretKey = this.configService.get<string>('JWT_REFRESH_TOKEN_KEY');
  }

  // Method untuk menghasilkan token JWT (access token)
  generateToken(data: any): string {
    return jwt.sign(data, this.jwtSecretKey, { expiresIn: '1d' });  // Kedaluwarsa default 1 hari
  }

  // Method untuk menghasilkan refresh token
  generateRefreshToken(data: any): string {
    return jwt.sign(data, this.jwtRefreshTokenSecretKey, { expiresIn: '2d' });  // Kedaluwarsa default 2 hari
  }

  // Method untuk mengekstrak data dari token biasa
  extractToken(token: string): UserRequest | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecretKey);
      return decoded as UserRequest;  // Cast ke tipe UserData
    } catch (error) {
      return null;  // Mengembalikan null jika verifikasi gagal
    }
  }

  // Method untuk mengekstrak data dari refresh token
  extractRefreshToken(token: string): UserRequest | null {
    try {
      const decoded = jwt.verify(token, this.jwtRefreshTokenSecretKey);
      return decoded as UserRequest;  // Cast ke tipe UserData
    } catch (error) {
      return null;  // Mengembalikan null jika verifikasi gagal
    }
  }
}
