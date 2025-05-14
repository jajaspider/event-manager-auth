import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async validateUser(user_id: string, password: string): Promise<any> {
        const user = await this.userService.findByUserId(user_id);
        if (!user) {
            return null;
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (user.password !== hashedPassword) {
            return null;
        }

        const { password: _, ...result } = user;
        return result;
    }

    async login(user_id: string, password: string) {
        const user = await this.validateUser(user_id, password);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.user_id,
            user_id: user.user_id,
            role: user.role
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                user_id: user.user_id,
                nickname: user.nickname,
                role: user.role
            }
        };
    }
} 