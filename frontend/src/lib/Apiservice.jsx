import axios from '../api/axios';

export async function CampApi() {
  try {
    const response = await axios.get('/api/camps');
    return response.data;
  } catch (error) {
    console.error('캠프 데이터 조회 실패:', error);
    throw error;
  }
}

export async function NewsApi(selectCategory) {
  try {
    const response = await axios.get(`/api/news?category=${selectCategory}`);
    return response.data;
  } catch (error) {
    console.error('뉴스 데이터 조회 실패:', error);
    throw error;
  }
}

export async function NewsDetailApi(id) {
  try {
    const response = await axios.get(`/api/news/${id}`);
    return response.data;
  } catch (error) {
    console.error('뉴스 상세 조회 실패:', error);
    throw error;
  }
}

export async function ReviewApi() {
  try {
    const response = await axios.get('/api/reviews');
    return response.data;
  } catch (error) {
    console.error('리뷰 데이터 조회 실패:', error);
    throw error;
  }
}

export async function ProfileApi() {
  try {
    const response = await axios.get('/api/profiles');
    return response.data;
  } catch (error) {
    console.error('프로필 데이터 조회 실패:', error);
    throw error;
  }
}

export async function DepartmentApi() {
  try {
    const response = await axios.get('/api/departments');
    return response.data;
  } catch (error) {
    console.error('부서 데이터 조회 실패:', error);
    throw error;
  }
}

export async function LoadDateData() {
  try {
    console.log('모집 일정 데이터 요청 시작');
    const response = await axios.get('/api/recruit/active');
    console.log('모집 일정 데이터 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('모집 일정 데이터 조회 실패:', error);
    throw error;
  }
}