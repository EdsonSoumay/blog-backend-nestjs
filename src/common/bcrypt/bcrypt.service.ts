import { Injectable } from '@nestjs/common';
import bcrypt from "bcrypt";

@Injectable()
export class BcryptService {
    constructor(){}
    async PasswordHashing (password: string): Promise<string> {
        const result = await bcrypt.hash(password, 10);
        return result;
    };

    async PasswordCompare (password: string, passwordHash: string): Promise<boolean> {
        const matched = await bcrypt.compare(password, passwordHash);
        return matched;
    };
}
