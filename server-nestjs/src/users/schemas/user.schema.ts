// server-nestjs/src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document & {
    _id: Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
};

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, '이메일은 필수 입력 항목입니다.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      '올바른 이메일 형식이 아닙니다.',
    ],
    sparse: true,
  })
  email: string;

  @Prop({
    required: [true, '이름은 필수 입력 항목입니다.'],
    trim: true,
  })
  name: string;

  @Prop({
    required: [true, '비밀번호는 필수 입력 항목입니다.'],
    minlength: [4, '비밀번호는 최소 4자 이상이어야 합니다.'],
  })
  password: string;

  @Prop({
    required: [true, '회원 유형은 필수 입력 항목입니다.'],
    enum: {
      values: ['FIELD', 'GENERAL'],
      message: '유효하지 않은 회원 유형입니다.',
    },
  })
  memberType: string;

  @Prop({
    required: false,
    min: [1, '기수는 1 이상이어야 합니다.'],
    max: [18, '기수는 18 이하여야 합니다.'],
  })
  generation?: number;

  @Prop({
    required: false,
    enum: {
      values: ['대외협력부', '총기획단', '기획부', '컴페티션부', '홍보부'],
      message: '유효하지 않은 소속입니다.',
    },
  })
  department?: string;

  @Prop({
    required: false,
    enum: {
      values: [
        '대외협력부장',
        '단장',
        '부단장',
        '기획부장',
        '컴페티션부장',
        '홍보부장',
        '부원',
      ],
      message: '유효하지 않은 직책입니다.',
    },
  })
  position?: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop({ default: false })
  isSuperAdmin: boolean;

  @Prop({ default: null })
  activeToken: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// 비밀번호 해싱 (저장 전)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 비밀번호 비교 메서드
UserSchema.methods.comparePassword = function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 이메일로 사용자 찾기 (정적 메서드)
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};