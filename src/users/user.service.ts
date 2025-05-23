import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async isUserIdTaken(user_id: string): Promise<boolean> {
        return !!(await this.userModel.findOne({ user_id }));
    }

    async isNicknameTaken(nickname: string): Promise<boolean> {
        return !!(await this.userModel.findOne({ nickname }));
    }

    async createUser(user_id: string, password: string, nickname: string): Promise<User> {
        try {
            if (await this.isUserIdTaken(user_id)) {
                throw new ConflictException('user_id already exists');
            }
            if (await this.isNicknameTaken(nickname)) {
                throw new ConflictException('nickname already exists');
            }

            // user의 password를 평문으로 저장하면안됨
            const hash = crypto.createHash('sha256').update(user_id + Date.now().toString()).digest('hex');
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

            const createdUser = new this.userModel({
                user_id,
                password: hashedPassword,
                nickname,
                hash,
                role: 'user'
            });

            let savedUser = await createdUser.save();
            savedUser = JSON.parse(JSON.stringify(savedUser));
            delete savedUser.hash;

            return savedUser;
        } catch (error) {
            throw error;
        }
    }

    async findAllUsers(): Promise<Partial<User>[]> {
        const users = await this.userModel.find({}, { password: 0, hash: 0 }).lean();
        return users;
    }

    async findByUserId(id: string): Promise<User | undefined> {
        return this.userModel.findOne({ user_id: id }).lean();
    }

    async updateUserRole(id: string, role: string): Promise<User> {
        return this.userModel.findOneAndUpdate(
            { _id: id },
            { role },
            { new: true }
        ).lean();
    }

    async createAdminUser() {
        try {
            const adminExists = await this.isUserIdTaken('admin');
            if (adminExists) {
                console.log('Admin user already exists');
                return;
            }

            const hash = crypto.createHash('sha256').update('admin' + Date.now().toString()).digest('hex');
            const hashedPassword = crypto.createHash('sha256').update('1234').digest('hex');

            const adminUser = new this.userModel({
                user_id: 'admin',
                password: hashedPassword,
                nickname: 'admin',
                hash,
                role: 'admin'
            });

            const savedUser = await adminUser.save();
            console.log('Admin user created successfully');
            return savedUser;
        } catch (error) {
            console.error('Failed to create admin user:', error);
            throw error;
        }
    }

    async updateRole(id: string, role: string): Promise<User> {
        return this.userModel.findOneAndUpdate(
            { user_id: id },
            { role },
            { new: true }
        ).lean();
    }
}
