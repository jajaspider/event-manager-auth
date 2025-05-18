import { Body, Controller, Get, HttpException, Post, Query, Version, Request, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ErrorCodes } from '../constants';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('')
    @Version('0')
    async listUsers() {
        return await this.userService.findAllUsers();
    }

    @Post('')
    @Version('0')
    async register(
        @Body('user_id') user_id: string,
        @Body('password') password: string,
        @Body('nickname') nickname: string,
    ) {
        // 유저 생성 전 필수값과 string으로 입력되었는지 확인
        if (!user_id) {
            throw new HttpException(ErrorCodes.USER.ID_REQUIRED, ErrorCodes.USER.ID_REQUIRED.status);
        }
        if (!password) {
            throw new HttpException(ErrorCodes.USER.PASSWORD_REQUIRED, ErrorCodes.USER.PASSWORD_REQUIRED.status);
        }
        if (!nickname) {
            throw new HttpException(ErrorCodes.USER.NICKNAME_REQUIRED, ErrorCodes.USER.NICKNAME_REQUIRED.status);
        }

        if (typeof user_id !== 'string') {
            throw new HttpException(
                { ...ErrorCodes.USER.ID_REQUIRED, message: 'user_id must be a string' },
                ErrorCodes.USER.ID_REQUIRED.status
            );
        }
        if (typeof password !== 'string') {
            throw new HttpException(
                { ...ErrorCodes.USER.PASSWORD_REQUIRED, message: 'password must be a string' },
                ErrorCodes.USER.PASSWORD_REQUIRED.status
            );
        }
        if (typeof nickname !== 'string') {
            throw new HttpException(
                { ...ErrorCodes.USER.NICKNAME_REQUIRED, message: 'nickname must be a string' },
                ErrorCodes.USER.NICKNAME_REQUIRED.status
            );
        }

        const user = await this.userService.createUser(user_id, password, nickname);
        return user;
    }

    @Get('GetUserId')
    @Version('0')
    async checkUserId(@Query('user_id') user_id: string) {
        if (!user_id) {
            throw new HttpException(
                ErrorCodes.USER.ID_REQUIRED,
                ErrorCodes.USER.ID_REQUIRED.status
            );
        }

        const isTaken = await this.userService.isUserIdTaken(user_id);

        if (isTaken) {
            throw new HttpException(
                { ...ErrorCodes.USER.USER_ID_TAKEN, message: 'user_id already exists' },
                ErrorCodes.USER.USER_ID_TAKEN.status
            );
        }

        return { user_id: user_id };
    }

    @Get('GetNickname')
    @Version('0')
    async checkNickname(@Query('nickname') nickname: string) {
        if (!nickname) {
            throw new HttpException(
                ErrorCodes.USER.NICKNAME_REQUIRED,
                ErrorCodes.USER.NICKNAME_REQUIRED.status
            );
        }

        const isTaken = await this.userService.isNicknameTaken(nickname);

        if (isTaken) {
            throw new HttpException(
                { ...ErrorCodes.USER.NICKNAME_TAKEN, message: 'nickname already exists' },
                ErrorCodes.USER.NICKNAME_TAKEN.status
            );
        }

        return { nickname: nickname };
    }

    @Patch('/:id/role')
    @Version('0')
    async updateUser(
        @Request() req,
        @Body('role') role: string
    ) {
        const id = req.params.id;

        const updatedUser = await this.userService.updateRole(id, role);

        return {
            user_id: updatedUser.user_id,
            nickname: updatedUser.nickname,
            role: updatedUser.role
        };
    }
}