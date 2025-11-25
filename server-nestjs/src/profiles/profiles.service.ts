// server-nestjs/src/profiles/profiles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private uploadService: UploadService,
  ) {}

  async findAll(): Promise<any[]> {
    const profiles = await this.profileModel.find().sort({ createdAt: -1 }).exec();

    return profiles.map((profile) => ({
      _id: profile._id,
      name: profile.name,
      role: profile.role,
      photo: profile.photoKey ? this.uploadService.getFileUrl(profile.photoKey) : null,
      description: profile.description,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    }));
  }

  async create(
    createProfileDto: CreateProfileDto,
    photo?: Express.Multer.File,
  ): Promise<any> {
    let photoKey: string | null = null;

    if (photo) {
      const { key } = await this.uploadService.uploadFile(photo, 'profiles');
      photoKey = key;
    }

    try {
      const newProfile = new this.profileModel({
        ...createProfileDto,
        photoKey,
      });

      const saved = await newProfile.save();

      return {
        _id: saved._id,
        name: saved.name,
        role: saved.role,
        photo: photoKey ? this.uploadService.getFileUrl(photoKey) : null,
        description: saved.description,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      };
    } catch (error) {
      if (photoKey) {
        await this.uploadService.deleteFile(photoKey);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const profile = await this.profileModel.findById(id).exec();

    if (!profile) {
      throw new NotFoundException('삭제할 프로필을 찾을 수 없습니다.');
    }

    if (profile.photoKey) {
      await this.uploadService.deleteFile(profile.photoKey);
    }

    await profile.deleteOne();
  }
}