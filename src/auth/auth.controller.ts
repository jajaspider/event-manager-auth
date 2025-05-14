import { Controller, Post, Body, HttpException, HttpStatus, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ErrorCodes } from '../constants';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @Version('0')
    async login(
        @Body('user_id') user_id: string,
        @Body('password') password: string,
    ) {
        // 필수 입력값 검증
        if (!user_id) {
            throw new HttpException(
                ErrorCodes.USER.ID_REQUIRED,
                ErrorCodes.USER.ID_REQUIRED.status
            );
        }
        if (!password) {
            throw new HttpException(
                ErrorCodes.USER.PASSWORD_REQUIRED,
                ErrorCodes.USER.PASSWORD_REQUIRED.status
            );
        }

        try {
            return await this.authService.login(user_id, password);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                ErrorCodes.AUTH.INVALID_CREDENTIALS,
                ErrorCodes.AUTH.INVALID_CREDENTIALS.status
            );
        }
    }
} 