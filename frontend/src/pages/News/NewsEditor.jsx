import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../api/axios';
import { useSelector } from 'react-redux';

const EditorContainer = styled.div`
  padding: 2rem 5%;
  min-height: calc(100vh - 58px);
  color: ${props => props.theme.colors.white};
  background: ${props => props.theme.colors.background};
  max-width: 1000px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 2rem 3%;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  color: ${props => props.theme.colors.white};

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${props => props.theme.colors.white};
  margin-bottom: 0.5rem;
  display: block;
`;

const Input = styled.input`
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: ${props => props.theme.colors.white};
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${props => props.theme.colors.gray300};
  }

  &:focus {
    outline: none;
    border-color: #FFD700;
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.875rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: ${props => props.theme.colors.white};
  font-size: 0.8rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='white' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  padding-right: 2.5rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #FFD700;
    background-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }

  option {
    background: #1a1a1a;
    color: ${props => props.theme.colors.white};
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: ${props => props.theme.colors.white};
  font-size: 0.875rem;
  min-height: 450px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${props => props.theme.colors.gray300};
  }

  &:focus {
    outline: none;
    border-color: #FFD700;
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
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
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px dashed rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.gray300};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  font-weight: 500;

  &:hover {
    border-color: #FFD700;
    background: rgba(255, 255, 255, 0.08);
    color: ${props => props.theme.colors.white};
  }
`;

const ImagePreview = styled.img`
  max-width: 300px;
  max-height: 300px;
  margin-top: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FilePreview = styled.div`
  margin-top: 1.5rem;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const FileIcon = styled.div`
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
`;

const FileInfo = styled.div`
  flex: 1;
  
  .file-name {
    color: ${props => props.theme.colors.white};
    font-size: 0.9375rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
    word-break: break-word;
  }
  
  .file-size {
    color: ${props => props.theme.colors.gray300};
    font-size: 0.8125rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  background-color: #FFD700;
  color: #000;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 1.5rem auto 0;
  display: block;
  min-width: 150px;

  &:hover:not(:disabled) {
    background-color: #ffed4e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: ${props => props.theme.colors.white};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateX(-2px);
  }

  &:active {
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    padding: 0.45rem 0.875rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  z-index: 1001;
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.white};
  margin-bottom: 1rem;
`;

const ModalMessage = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme.colors.gray300};
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  ${props => props.$variant === 'primary' 
    ? `
      background: #FFD700;
      color: #000;
      &:hover {
        background: #ffed4e;
      }
    `
    : `
      background: rgba(255, 255, 255, 0.1);
      color: ${props.theme.colors.white};
      &:hover {
        background: rgba(255, 255, 255, 0.15);
      }
    `
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
  const [showExitModal, setShowExitModal] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);

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
          const initialData = {
            title: news.title,
            content: news.content,
            category: news.category || 'monthly',
          };
          setFormData(initialData);
          setInitialFormData(initialData);
          if (news.imageUrl) {
            setPreviewUrl(news.imageUrl);
          }
        } catch (error) {
          navigate('/news');
        }
      };
      fetchNews();
    } else {
      const initialData = {
        title: '',
        content: '',
        category: 'monthly',
      };
      setInitialFormData(initialData);
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

  const hasChanges = () => {
    if (!initialFormData) return false;
    
    const formChanged = 
      formData.title !== initialFormData.title ||
      formData.content !== initialFormData.content ||
      formData.category !== initialFormData.category;
    
    const fileChanged = selectedFile !== null;
    
    return formChanged || fileChanged;
  };

  const handleBack = () => {
    if (hasChanges()) {
      setShowExitModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    navigate(-1);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
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
      
      console.log('선택된 파일:', selectedFile);
      if (selectedFile) {
        console.log('파일 정보:', {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        });
        formDataToSend.append('file', selectedFile);
        console.log('FormData에 파일 추가됨');
      } else {
        console.log('파일이 선택되지 않음');
      }

      // FormData 내용 확인
      console.log('FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      // 토큰 가져오기 (redux state 또는 localStorage)
      const token = auth?.token || localStorage.getItem('token');

      // FormData를 보낼 때는 Content-Type을 설정하지 않음 (브라우저가 자동으로 설정)
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      if (id) {
        await api.put(`/api/news/${id}`, formDataToSend, {
          headers,
        });
      } else {
        await api.post('/api/news', formDataToSend, {
          headers,
        });
      }
      navigate('/news');
    } catch (error) {
      console.error('저장 실패:', error);
      const errorMessage = error.response?.data?.message || error.message || '저장에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EditorContainer>
      <BackButton onClick={handleBack}>
        <span>←</span>
        <span>뒤로</span>
      </BackButton>
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

      {showExitModal && (
        <ModalOverlay onClick={handleCancelExit}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>작성 중인 내용이 저장되지 않습니다</ModalTitle>
            <ModalMessage>
              페이지를 나가시면 작성 중인 내용이 저장되지 않습니다.
              <br />
              정말 나가시겠습니까?
            </ModalMessage>
            <ModalButtons>
              <ModalButton onClick={handleCancelExit}>취소</ModalButton>
              <ModalButton $variant="primary" onClick={handleConfirmExit}>
                나가기
              </ModalButton>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </EditorContainer>
  );
};

export default NewsEditor; 