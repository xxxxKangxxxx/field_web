import axios from '../api/axios';

export async function CampApi() {
  try {
    const response = await axios.get('/api/camps');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function NewsApi(selectCategory) {
  try {
    const response = await axios.get(`/api/news?category=${selectCategory}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function NewsDetailApi(id) {
  try {
    const response = await axios.get(`/api/news/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function ReviewApi() {
  try {
    const response = await axios.get('/api/reviews');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function ProfileApi() {
  try {
    const response = await axios.get('/api/profiles');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function DepartmentApi() {
  try {
    const response = await axios.get('/api/departments');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function LoadDateData() {
  try {
    const response = await axios.get('/api/recruit/active');
    return response.data;
  } catch (error) {
    // 404 에러는 "활성 모집이 없음"을 의미하므로 정상적인 경우로 처리
    if (error.response?.status === 404) {
      return null; // 또는 빈 객체 { schedules: [] }
    }
    throw error;
  }
}