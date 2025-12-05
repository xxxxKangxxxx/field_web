// server-nestjs/scripts/create-test-user.ts
// 테스트용 일반 회원 계정 생성 스크립트
// 사용법: npm run create-test-user

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
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

async function createTestUser() {
  try {
    console.log('👤 테스트용 일반 회원 계정 생성 스크립트\n');

    // NestJS 애플리케이션 컨텍스트 생성
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    // 입력 받기
    const email = await question('이메일을 입력하세요: ');
    const name = await question('이름을 입력하세요: ');
    const password = await question('비밀번호를 입력하세요 (최소 4자): ');
    const generationStr = await question('기수를 입력하세요 (1-18): ');
    const generation = parseInt(generationStr, 10);
    const department = await question('소속을 입력하세요 (대외협력부/총기획단/기획부/컴페티션부/홍보부): ');
    const position = await question('직책을 입력하세요 (대외협력부장/단장/부단장/기획부장/컴페티션부장/홍보부장/부원): ');

    // 기존 사용자 확인
    const existingUser = await usersService.findByEmail(email);
    if (existingUser) {
      console.log('\n⚠️  이미 존재하는 이메일입니다.');
      console.log('   기존 계정을 사용하거나 다른 이메일을 입력하세요.');
      await app.close();
      rl.close();
      process.exit(0);
    }

    // 새 사용자 생성 (일반 사용자로 생성, isSuperAdmin은 false)
    const user = await usersService.create({
      email,
      password,
      name,
      memberType: 'FIELD',
      generation,
      department,
      position,
    });

    console.log('\n✅ 테스트 계정이 생성되었습니다!');
    console.log(`   이메일: ${email}`);
    console.log(`   이름: ${name}`);
    console.log(`   회원 유형: FIELD`);
    console.log(`   기수: ${generation}`);
    console.log(`   소속: ${department}`);
    console.log(`   직책: ${position}`);
    console.log(`   권한: 일반 사용자 (isSuperAdmin: false)\n`);
    console.log('💡 이제 이 계정으로 로그인하여 테스트할 수 있습니다.\n');

    await app.close();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    rl.close();
    process.exit(1);
  }
}

createTestUser();

