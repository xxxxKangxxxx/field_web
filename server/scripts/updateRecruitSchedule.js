require('dotenv').config();
const mongoose = require('mongoose');
const Recruit = require('../models/Recruit');

// 수정하고 싶은 일정의 ID를 여기에 입력하세요
const scheduleId = '여기에_일정_ID를_입력하세요';

const updatedData = {
  year: 2024,
  season: '하반기',
  isActive: true,
  schedules: [
    {
      title: '서류 접수',
      date: '2024.07.15 ~ 2024.07.31'
    },
    {
      title: '1차 서류 전형 합격자 발표',
      date: '2024.08.02'
    },
    {
      title: '2차 면접',
      date: '2024.08.05 ~ 2024.08.09'
    },
    {
      title: '최종 합격자 발표',
      date: '2024.08.12'
    }
  ]
};

async function updateRecruitSchedule() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB 연결 성공');

    // 수정하려는 일정이 활성화 상태가 될 경우, 다른 일정들은 비활성화
    if (updatedData.isActive) {
      await Recruit.updateMany(
        { _id: { $ne: scheduleId } },
        { isActive: false }
      );
    }

    // 일정 수정
    const updatedSchedule = await Recruit.findByIdAndUpdate(
      scheduleId,
      updatedData,
      { new: true }
    );

    if (!updatedSchedule) {
      console.log('해당 ID의 일정을 찾을 수 없습니다.');
    } else {
      console.log('일정이 성공적으로 수정되었습니다.');
      console.log('수정된 일정:', updatedSchedule);
    }

    process.exit(0);
  } catch (error) {
    console.error('에러 발생:', error);
    process.exit(1);
  }
}

// 먼저 현재 등록된 모든 일정을 조회합니다
async function listAllSchedules() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB 연결 성공');

    const schedules = await Recruit.find().select('_id year season isActive');
    console.log('\n현재 등록된 일정 목록:');
    schedules.forEach(schedule => {
      console.log(`ID: ${schedule._id}`);
      console.log(`연도: ${schedule.year}`);
      console.log(`시즌: ${schedule.season}`);
      console.log(`활성화 상태: ${schedule.isActive}`);
      console.log('------------------------');
    });

    process.exit(0);
  } catch (error) {
    console.error('에러 발생:', error);
    process.exit(1);
  }
}

// 인자로 'list'가 전달되면 목록만 조회하고, 그렇지 않으면 수정을 실행합니다
if (process.argv[2] === 'list') {
  listAllSchedules();
} else {
  if (scheduleId === '여기에_일정_ID를_입력하세요') {
    console.log('먼저 일정 목록을 조회하려면 다음 명령어를 실행하세요:');
    console.log('node scripts/updateRecruitSchedule.js list');
    process.exit(1);
  }
  updateRecruitSchedule();
} 