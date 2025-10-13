require('dotenv').config();
const mongoose = require('mongoose');
const Recruit = require('../models/Recruit');

const recruitData = {
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

async function createRecruitSchedule() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB 연결 성공');

    // 기존의 활성화된 일정이 있다면 비활성화
    await Recruit.updateMany({}, { isActive: false });

    // 새로운 일정 생성
    const newSchedule = new Recruit(recruitData);
    await newSchedule.save();
    
    console.log('모집 일정이 성공적으로 생성되었습니다.');
    console.log('생성된 일정:', newSchedule);

    process.exit(0);
  } catch (error) {
    console.error('에러 발생:', error);
    process.exit(1);
  }
}

createRecruitSchedule(); 