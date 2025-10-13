const Camp = require('../models/Camp');
const fs = require('fs').promises;
const path = require('path');

// 캠프 전체 목록 조회
exports.getAllCamps = async (req, res) => {
  try {
    const camps = await Camp.find().sort({ year: -1 });
    res.status(200).json(camps);
  } catch (error) {
    res.status(500).json({ message: '캠프 불러오기 실패', error });
  }
};

// 캠프 생성
exports.createCamp = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '포스터 이미지는 필수입니다.' });
    }

    const { year, topic, timeline, description, location, participants } = req.body;
    
    // timeline 데이터가 문자열로 왔다면 파싱
    const parsedTimeline = typeof timeline === 'string' ? JSON.parse(timeline) : timeline;

    const newCamp = new Camp({
      year: parseInt(year),
      topic,
      posterImage: `/uploads/camp-posters/${req.file.filename}`,
      timeline: parsedTimeline,
      description,
      location,
      participants: parseInt(participants)
    });

    const savedCamp = await newCamp.save();
    res.status(201).json(savedCamp);
  } catch (error) {
    // 에러 발생 시 업로드된 이미지 삭제
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ message: '캠프 등록 실패', error });
  }
};

// 캠프 상세 조회
exports.getCampById = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: '해당 캠프를 찾을 수 없습니다.' });
    }
    res.status(200).json(camp);
  } catch (error) {
    res.status(500).json({ message: '캠프 상세 조회 실패', error });
  }
};

// 캠프 수정
exports.updateCamp = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.file) {
      // 기존 이미지 삭제
      const camp = await Camp.findById(id);
      if (camp && camp.posterImage) {
        const oldImagePath = path.join(__dirname, '..', camp.posterImage);
        await fs.unlink(oldImagePath).catch(console.error);
      }
      updateData.posterImage = `/uploads/camp-posters/${req.file.filename}`;
    }

    if (updateData.timeline && typeof updateData.timeline === 'string') {
      updateData.timeline = JSON.parse(updateData.timeline);
    }

    const updatedCamp = await Camp.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCamp) {
      return res.status(404).json({ message: '해당 캠프를 찾을 수 없습니다.' });
    }

    res.status(200).json(updatedCamp);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(500).json({ message: '캠프 수정 실패', error });
  }
};

// 캠프 삭제
exports.deleteCamp = async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: '삭제할 캠프를 찾을 수 없습니다.' });
    }

    // 이미지 파일 삭제
    if (camp.posterImage) {
      const imagePath = path.join(__dirname, '..', camp.posterImage);
      await fs.unlink(imagePath).catch(console.error);
    }

    await camp.deleteOne();
    res.status(200).json({ message: '캠프 삭제 완료' });
  } catch (error) {
    res.status(500).json({ message: '캠프 삭제 실패', error });
  }
};

