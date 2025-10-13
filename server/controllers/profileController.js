const Profile = require('../models/Profile');

// 전체 프로필 목록 조회
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ message: '프로필 목록 조회 실패', error: err });
  }
};

// 프로필 등록
exports.createProfile = async (req, res) => {
  try {
    const { name, role, photo, description } = req.body;

    const newProfile = new Profile({ name, role, photo, description });
    const saved = await newProfile.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: '프로필 등록 실패', error: err });
  }
};

// 프로필 삭제
exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Profile.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: '삭제할 프로필을 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '프로필 삭제 완료' });
  } catch (err) {
    res.status(500).json({ message: '프로필 삭제 실패', error: err });
  }
};
