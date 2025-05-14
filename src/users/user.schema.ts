import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as crypto from 'crypto';
import { ConflictException } from '@nestjs/common';


export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    user_id: string;

    @Prop({ required: true, unique: true })
    nickname: string;

    @Prop({ required: true })
    hash: string;

    @Prop({ required: true })
    password: string;
}


export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ user_id: 1 });
UserSchema.index({ nickname: 1 });