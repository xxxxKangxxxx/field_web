import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { updateProfile, addProfile, deleteProfile } from '../../redux/profileSlice';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ProfileList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProfileCard = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
`;

function ProfileManager() {
  const dispatch = useDispatch();
  const profiles = useSelector(state => state.profile.profiles);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [formData, setFormData] = useState({
    photo: '',
    department: '',
    name: '',
    introTitle: '',
    intro: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 실제 프로덕션에서는 이미지를 서버에 업로드하고 URL을 받아와야 합니다
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProfile) {
      dispatch(updateProfile({ id: selectedProfile.id, updates: formData }));
    } else {
      dispatch(addProfile(formData));
    }
    setSelectedProfile(null);
    setFormData({ photo: '', department: '', name: '', introTitle: '', intro: '' });
  };

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setFormData(profile);
  };

  const handleDelete = (id) => {
    if (window.confirm('정말로 이 프로필을 삭제하시겠습니까?')) {
      dispatch(deleteProfile(id));
    }
  };

  return (
    <Container>
      <h1>프로필 관리</h1>
      <ProfileForm onSubmit={handleSubmit}>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <Input
          type="text"
          name="department"
          placeholder="부서"
          value={formData.department}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="name"
          placeholder="이름"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="introTitle"
          placeholder="소개 제목"
          value={formData.introTitle}
          onChange={handleInputChange}
          required
        />
        <TextArea
          name="intro"
          placeholder="소개 내용"
          value={formData.intro}
          onChange={handleInputChange}
          required
        />
        <Button type="submit">
          {selectedProfile ? '프로필 수정' : '프로필 추가'}
        </Button>
      </ProfileForm>

      <ProfileList>
        {profiles.map(profile => (
          <ProfileCard key={profile.id}>
            <ProfileImage src={profile.photo} alt={profile.name} />
            <h3>{profile.name}</h3>
            <p>{profile.department}</p>
            <p>{profile.introTitle}</p>
            <p>{profile.intro}</p>
            <Button onClick={() => handleEdit(profile)}>수정</Button>
            <Button onClick={() => handleDelete(profile.id)}>삭제</Button>
          </ProfileCard>
        ))}
      </ProfileList>
    </Container>
  );
}

export default ProfileManager; 