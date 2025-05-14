import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type UserDocument = User & Document;
export const TIMESTAMP_OPTIONS = {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}

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

    @Prop({ required: true, default: 'user', enum: ['user', 'operator', 'auditor', 'admin'] })
    role: string;
}


export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('timestamps', TIMESTAMP_OPTIONS);
UserSchema.set('versionKey', false);
UserSchema.index({ user_id: 1 });
UserSchema.index({ nickname: 1 });