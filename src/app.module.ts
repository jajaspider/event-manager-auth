import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/user.schema';
import { UserService } from './users/user.service';
import { UserController } from './users/user.controller';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

// config/auth.yaml에서 MongoDB 연결 정보 읽기
const config = yaml.load(fs.readFileSync('config/auth.yaml', 'utf8')) as any;
const mongo = config.mongo;
const mongoUri = `mongodb://${mongo.ip}:${mongo.port}/${mongo.database}`;

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule { }
