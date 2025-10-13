const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, department, position, password } = req.body;

    // 사용자 찾기
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 업데이트할 필드 설정
    const updateFields = {};
    
    if (name !== undefined) {
      updateFields.name = name;
    }

    if (department !== undefined) {
      updateFields.department = department;
    }
    
    if (position !== undefined) {
      updateFields.position = position;
      // 직책 변경 시 관리자 권한 재설정
      updateFields.isAdmin = position.includes('부장') || position === '단장' || position === '부단장';
    }

    // 비밀번호 변경
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    // 사용자 정보 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    ).select('-password -activeToken');

    res.status(200).json({
      message: '프로필이 성공적으로 업데이트되었습니다.',
      user: {
        email: updatedUser.email,
        name: updatedUser.name,
        department: updatedUser.department,
        position: updatedUser.position,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    console.error('프로필 업데이트 에러:', error);
    res.status(500).json({ message: '프로필 업데이트 중 오류가 발생했습니다.' });
  }
}; 