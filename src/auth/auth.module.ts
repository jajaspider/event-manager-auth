import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

const config = yaml.load(fs.readFileSync('config/auth.yaml', 'utf8')) as any;
const jwtSecret = config.jwt?.secret || 'rainbow';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: jwtSecret,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule { } 