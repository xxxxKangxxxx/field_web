import {Route, Routes} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from './api/axios';
import { setCredentials, logout } from './redux/authSlice';
import Layout from './layout/Layout';
import GlobalStyle from './GlobalStyle';
import './index.css';
import AboutPage from './pages/AboutPage';
import CampPage from './pages/CampPage';
import ContactPage from './pages/ContactPage';
import MainPage from './pages/MainPage';
import RecruitPage from './pages/RecruitPage';
import NewsList from './pages/News/NewsList';
import NewsDetail from './pages/News/NewsDetail';
import NewsEditor from './pages/News/NewsEditor';
import theme from './theme';
import NotFound from './pages/NotFound';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileManager from './pages/admin/ProfileManager';
import MyPage from './pages/MyPage';
import InquiryPage from './pages/InquiryPage';
import InquiryManagePage from './pages/admin/InquiryManagePage';
import PrivateRoute from './components/PrivateRoute';
import RecruitManager from './pages/admin/RecruitManager';
import UserManager from './pages/admin/UserManager';

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
`;

const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await api.get('/api/auth/me');
        dispatch(setCredentials({
          user: response.data,
          token
        }));
      } catch (error) {
        localStorage.removeItem('token');
        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <LoadingSpinner>Loading...</LoadingSpinner>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/camp" element={<CampPage />} />
          <Route path="/recruit" element={<RecruitPage />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/news/create" element={
            <PrivateRoute requireManager>
              <NewsEditor />
            </PrivateRoute>
          } />
          <Route path="/news/edit/:id" element={
            <PrivateRoute requireManager>
              <NewsEditor />
            </PrivateRoute>
          } />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mypage" element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          } />
          <Route path="/inquiries" element={
            <PrivateRoute>
              <InquiryPage />
            </PrivateRoute>
          } />
          
          {/* 관리자 전용 라우트 */}
          <Route path="/admin/profiles" element={
            <PrivateRoute requireManager>
              <ProfileManager />
            </PrivateRoute>
          } />
          <Route path="/admin/inquiries" element={
            <PrivateRoute requireManager>
              <InquiryManagePage />
            </PrivateRoute>
          } />

          <Route path="/admin/recruit" element={
            <PrivateRoute requireManager>
              <RecruitManager />
            </PrivateRoute>
          } />

          <Route path="/admin/users" element={
            <PrivateRoute requireSuperAdmin>
              <UserManager />
            </PrivateRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
