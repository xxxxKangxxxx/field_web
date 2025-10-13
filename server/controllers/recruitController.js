const Recruit = require('../models/Recruit');

// 모든 모집 일정 조회
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Recruit.find()
      .sort({ year: -1, season: -1 })
      .select('-__v');
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: '모집 일정 조회 중 오류가 발생했습니다.' });
  }
};

// 활성화된 모집 일정만 조회
exports.getActiveSchedule = async (req, res) => {
  try {
    const schedule = await Recruit.findOne({ isActive: true })
      .sort({ year: -1, season: -1 })
      .select('-__v');
    
    if (!schedule) {
      return res.status(404).json({ message: '현재 진행 중인 모집이 없습니다.' });
    }
    
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: '모집 일정 조회 중 오류가 발생했습니다.' });
  }
};

// 모집 일정 생성 (관리자용)
exports.createSchedule = async (req, res) => {
  try {
    const { year, season, schedules } = req.body;

    // 새로운 일정을 활성화할 경우, 기존의 활성화된 일정을 비활성화
    if (req.body.isActive) {
      await Recruit.updateMany({}, { isActive: false });
    }

    const newSchedule = new Recruit({
      year,
      season,
      schedules,
      isActive: req.body.isActive || false
    });

    await newSchedule.save();
    res.status(201).json({ message: '모집 일정이 성공적으로 등록되었습니다.' });
  } catch (error) {
    res.status(400).json({ message: '모집 일정 등록 중 오류가 발생했습니다.' });
  }
};

// 모집 일정 수정 (관리자용)
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 이 일정을 활성화할 경우, 다른 모든 일정을 비활성화
    if (updateData.isActive) {
      await Recruit.updateMany({ _id: { $ne: id } }, { isActive: false });
    }

    const schedule = await Recruit.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: '해당 모집 일정을 찾을 수 없습니다.' });
    }

    res.json(schedule);
  } catch (error) {
    res.status(400).json({ message: '모집 일정 수정 중 오류가 발생했습니다.' });
  }
};

// 모집 일정 삭제 (관리자용)
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Recruit.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({ message: '해당 모집 일정을 찾을 수 없습니다.' });
    }

    res.json({ message: '모집 일정이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '모집 일정 삭제 중 오류가 발생했습니다.' });
  }
};
