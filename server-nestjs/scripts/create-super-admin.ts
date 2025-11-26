// server-nestjs/scripts/create-super-admin.ts
// 최상위 관리자 계정 생성 스크립트
// 사용법: npm run create-super-admin

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../src/users/schemas/user.schema';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function createSuperAdmin() {
  try {
    console.log('🔐 최상위 관리자 계정 생성 스크립트\n');

    // NestJS 애플리케이션 컨텍스트 생성
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    const userModel = app.get(getModelToken(User.name));

    // 입력 받기
    const email = await question('이메일을 입력하세요: ');
    const name = await question('이름을 입력하세요: ');
    const password = await question('비밀번호를 입력하세요 (최소 4자): ');
    const department = await question('소속을 입력하세요 (대외협력부/총기획단/기획부/컴페티션부/홍보부): ');
    const position = await question('직책을 입력하세요 (대외협력부장/단장/부단장/기획부장/컴페티션부장/홍보부장/부원): ');

    // 기존 사용자 확인
    const existingUser = await usersService.findByEmail(email);
    if (existingUser) {
      console.log('\n⚠️  이미 존재하는 이메일입니다.');
      const update = await question('최상위 관리자 권한을 부여하시겠습니까? (y/n): ');
      if (update.toLowerCase() === 'y') {
        await userModel.findByIdAndUpdate(existingUser._id, { isSuperAdmin: true });
        console.log('✅ 최상위 관리자 권한이 부여되었습니다.');
      } else {
        console.log('❌ 취소되었습니다.');
      }
      await app.close();
      rl.close();
      process.exit(0);
    }

    // 새 사용자 생성
    const user = await usersService.create({
      email,
      password,
      name,
      department,
      position,
    });

    // 최상위 관리자 권한 부여
    await userModel.findByIdAndUpdate(user._id, { isSuperAdmin: true });

    console.log('\n✅ 최상위 관리자 계정이 생성되었습니다!');
    console.log(`   이메일: ${email}`);
    console.log(`   이름: ${name}`);
    console.log(`   소속: ${department}`);
    console.log(`   직책: ${position}`);
    console.log(`   권한: 최상위 관리자\n`);

    await app.close();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    rl.close();
    process.exit(1);
  }
}

createSuperAdmin();

