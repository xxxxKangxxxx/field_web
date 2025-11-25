import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api/axios';
import { useSelector } from 'react-redux';

const EditorContainer = styled.div`
  padding: 2rem 10%;
  min-height: calc(100vh - 58px);
  color: ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.background};

  @media (max-width: 768px) {
    padding: 2rem 5%;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.white};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ShortInputGroup = styled(InputGroup)`
  max-width: 400px;
`;

const CategoryInputGroup = styled(InputGroup)`
  max-width: 140px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.white};
`;

const Input = styled.input`
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.white};
  font-size: 0.825rem;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.white};
  font-size: 0.825rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }

  option {
    background: #1a1a1a;
    color: ${props => props.theme.colors.white};
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.colors.white};
  font-size: 0.825rem;
  min-height: 450px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
`;

const FileInput = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputLabel = styled.div`
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.gray300};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.825rem;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin-top: 1rem;
  border-radius: 4px;
`;

const FilePreview = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FileIcon = styled.div`
  font-size: 2rem;
`;

const FileInfo = styled.div`
  flex: 1;
  
  .file-name {
    color: ${props => props.theme.colors.white};
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
  
  .file-size {
    color: ${props => props.theme.colors.gray300};
    font-size: 0.75rem;
  }
`;

const Button = styled.button`
  padding: 0.6rem 1.5rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;
  margin: 1rem auto 0;
  display: block;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const NewsEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'monthly',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'monthly', name: '월간필드' },
    { id: 'career', name: '취업/진로' },
    { id: 'notice', name: '공지사항' }
  ];

  useEffect(() => {
    if (!auth?.user?.isAdmin) {
      navigate('/news');
      return;
    }

    if (id) {
      const fetchNews = async () => {
        try {
          const response = await api.get(`/api/news/${id}`);
          const news = response.data;
          setFormData({
            title: news.title,
            content: news.content,
            category: news.category || 'monthly',
          });
          if (news.imageUrl) {
            setPreviewUrl(news.imageUrl);
          }
        } catch (error) {
          console.error('뉴스를 불러오는데 실패했습니다:', error);
          navigate('/news');
        }
      };
      fetchNews();
    }
  }, [id, navigate, auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // 이미지 파일인 경우에만 미리보기 생성
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        // 이미지가 아닌 경우 미리보기 URL 초기화
        setPreviewUrl('');
      }
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📊';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📈';
    if (fileType.includes('zip') || fileType.includes('rar')) return '🗂️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('category', formData.category);
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      // 토큰 가져오기 (redux state 또는 localStorage)
      const token = auth?.token || localStorage.getItem('token');

      if (id) {
        await api.put(`/api/news/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
      } else {
        await api.post('/api/news', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
      }
      navigate('/news');
    } catch (error) {
      console.error('뉴스 저장에 실패했습니다:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EditorContainer>
      <Title>{id ? '뉴스 수정' : '새 뉴스 작성'}</Title>
      <Form onSubmit={handleSubmit}>
        <CategoryInputGroup>
          <Label htmlFor="category">카테고리</Label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </CategoryInputGroup>

        <ShortInputGroup>
          <Label htmlFor="title">제목</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="제목을 입력하세요"
          />
        </ShortInputGroup>

        <InputGroup>
          <Label htmlFor="content">내용</Label>
          <TextArea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            placeholder="내용을 입력하세요"
          />
        </InputGroup>

        <InputGroup>
          <Label>파일 첨부</Label>
          <FileInputWrapper>
            <FileInputLabel>
              {selectedFile ? selectedFile.name : '파일을 선택하거나 이곳에 드래그하세요'}
            </FileInputLabel>
            <FileInput
              type="file"
              onChange={handleFileChange}
            />
          </FileInputWrapper>
          {selectedFile && (
            <>
              {previewUrl && selectedFile.type.startsWith('image/') ? (
                <ImagePreview src={previewUrl} alt="미리보기" />
              ) : selectedFile ? (
                <FilePreview>
                  <FileIcon>{getFileIcon(selectedFile.type)}</FileIcon>
                  <FileInfo>
                    <div className="file-name">{selectedFile.name}</div>
                    <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                  </FileInfo>
                </FilePreview>
              ) : null}
            </>
          )}
        </InputGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '저장 중...' : (id ? '수정하기' : '작성하기')}
        </Button>
      </Form>
    </EditorContainer>
  );
};

export default NewsEditor; 