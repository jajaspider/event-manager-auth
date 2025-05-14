import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UsersModule implements OnModuleInit {
    constructor(private userService: UserService) { }

    async onModuleInit() {
        // 켜지면서 admin 사용자 생성
        try {
            await this.userService.createAdminUser();
        } catch (error) {
            console.error('Failed to initialize admin user:', error);
        }
    }
} 