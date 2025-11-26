import styled from 'styled-components';
import {useState, useEffect, useRef} from 'react';
import theme from '../../theme';
import MenuBurgur from './MenuBurgur';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import fieldLogo from '../../assets/fieldLogo.png';
import { FaUserCircle } from 'react-icons/fa';
import api from '../../api/axios';

const MenuBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 9999;
  background: ${props => {
    if (props.$isTransparentHeader) {
      return props.$isScrolled 
        ? 'rgba(20, 20, 20, 0.8)' 
        : 'rgba(20, 20, 20, 0.05)';
    }
    return '#141414';
  }};
  backdrop-filter: ${props => 
    props.$isTransparentHeader && props.$isScrolled ? 'blur(5px)' : 'none'};
  transition: all 0.3s ease;

  &:hover {
    background: ${props => {
      if (props.$isTransparentHeader && !props.$isScrolled) {
        return 'rgba(20, 20, 20, 0.2)';
      }
      return props.$isTransparentHeader ? 'rgba(20, 20, 20, 0.8)' : '#141414';
    }};
  }
`;

const MainHeaderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 58px;
  padding: 0 10%;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  gap: 1rem;

  ${theme.media.tablet} {
    padding: 0 7.5%;
  }

  ${theme.media.mobile} {
    padding: 0 7.5%;
  }

  ${theme.media.desktop} {
    gap: 2rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const RightSection = styled.div`
  display: none;

  ${theme.media.desktop} {
  display: flex;
  align-items: center;
    gap: 3.5rem;
    flex: 1;
    justify-content: flex-end;
  }
`;

const Navigation = styled.nav`
  display: none;
  
  ${theme.media.desktop} {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    
    a {
      color: ${theme.colors.white};
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      margin-right: 3.5rem;
      white-space: nowrap;

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        opacity: 0.7;
      }

      &.active {
        color: #FFD700;
        opacity: 1;
      }
    }
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  top: 58px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.$isOpen ? '9998' : '-1'};
  display: ${props => props.$isOpen ? 'block' : 'none'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  ${theme.media.desktop} {
    display: none;
  }
`;

const MobileNavigationWrapper = styled.div`
  position: fixed;
  top: 58px;
  left: 0;
  right: 0;
  background: #141414;
  padding: 2rem;
  transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  z-index: ${props => props.$isOpen ? '10000' : '-1'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  max-height: calc(100vh - 58px);
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  ${theme.media.desktop} {
    display: none;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1.5rem;
    
    a {
      color: ${theme.colors.white};
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s ease;
      min-height: 40px;
      display: flex;
      align-items: center;
      padding: 0.3rem 0;

      &:hover {
        opacity: 0.7;
      }

      &.active {
        color: #FFD700;
        opacity: 1;
      }
    }
  }

  /* 모바일 메뉴 안의 AuthButtons와 UserSection 강제 표시 */
  > div:last-child {
    margin-top: 0.8rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex !important;
    flex-direction: column;
    width: 100%;
    gap: 0.8rem;

    /* AuthButtons 스타일 */
    a.auth-btn {
      min-height: 40px;
      display: flex !important;
      align-items: center;
      justify-content: center;
      width: 100%;
      font-size: 14px;
      font-weight: 600;
      color: ${theme.colors.white};
      text-decoration: none;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.7;
      }
    }

    .divider {
      display: none !important;
    }

    /* UserSection 스타일 */
    .user-menu-container {
      display: flex !important;
      flex-direction: column;
      width: 100%;
      gap: 0;
      position: relative;
    }

    /* 모바일 메뉴 내 프로필 드롭다운이 제대로 보이도록 */
    .user-menu-container .user-menu-container {
      gap: 0;
    }
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${theme.colors.white};
`;

const HomeFigure = styled.figure`
  display: flex;
  align-items: center;
`;

const HomeLogo = styled.img`
  height: 30px;
  flex-shrink: 0;

  ${theme.media.mobile} {
    height: 26px;
  }
`;

const HomeTitle = styled.figcaption`
  margin: 0.1rem 0 0 0.4rem;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0;
  color: ${theme.colors.white};
  white-space: nowrap;

  ${theme.media.mobile} {
    font-size: 20px;
    margin: 0.1rem 0 0 0.3rem;
  }
`;

const MenuButton = styled.button`
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-size: 0;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }

  ${theme.media.desktop} {
    display: none;
  }
`;

const AuthButtons = styled.div`
  display: none;

  ${theme.media.desktop} {
  display: flex;
  align-items: center;
  gap: 0.8rem;
    flex-shrink: 0;
  }

  .auth-btn {
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    color: ${theme.colors.white};
    transition: opacity 0.2s ease;
    white-space: nowrap;

    &:hover {
      opacity: 0.7;
    }
  }

  .divider {
    color: ${theme.colors.white};
    opacity: 0.4;
  }
`;

const UserIconWrapper = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.white};
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  width: 100%;
  padding: 0.5rem 0;
  min-height: 44px;

  ${theme.media.mobile} {
    font-size: 14px;
    gap: 0.4rem;
  }

  &:hover {
    opacity: 0.7;
  }

  /* 모바일/태블릿용 터치 영역 확대 */
  ${theme.media.tablet} {
    width: 100%;
    justify-content: flex-start;
    
    &:active {
      opacity: 0.8;
    }
  }

  ${theme.media.mobile} {
    width: 100%;
    justify-content: flex-start;
    
    &:active {
      opacity: 0.8;
    }
  }
`;

const UserIcon = styled(FaUserCircle)`
  font-size: 24px;
  color: ${theme.colors.white};
  transition: opacity 0.2s ease;
`;

const MyPageMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 150px;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10001;

  /* 모바일/태블릿용 세로 레이아웃 */
  ${theme.media.tablet} {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    margin-top: 0.5rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0;
  }

  ${theme.media.mobile} {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    margin-top: 0.5rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: none;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0;
  }
`;

const MenuItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: ${theme.colors.white};
  transition: background-color 0.2s;
  font-size: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${props => props.$isAdmin && `
    color: ${theme.colors.yellow};
  `}

  /* 모바일/태블릿용 스타일 */
  ${theme.media.tablet} {
    padding: 0.4rem 1rem;
    font-size: 0.875rem;
    min-height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:active {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }

  ${theme.media.mobile} {
    padding: 0.4rem 1rem;
    font-size: 0.875rem;
    min-height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:active {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
`;

const UserSection = styled.div`
  display: none;

  ${theme.media.desktop} {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
    flex-shrink: 0;
  }
`;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  
  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;
  
  const isSuperAdmin = user?.isSuperAdmin === true;
  const isAdmin = isSuperAdmin || 
                 user?.isAdmin || 
                 user?.position === '단장' || 
                 user?.position === '부단장' || 
                 (user?.position && user.position.includes('부장'));
  const menuRef = useRef(null);
  const myPageRef = useRef(null);
  const scrollPositionRef = useRef(0);
  
  const transparentHeaderPages = ['/about', '/camp', '/recruit'];
  const isTransparentHeader = transparentHeaderPages.includes(location.pathname);

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    if (!isTransparentHeader) return;
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isTransparentHeader]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= parseInt(theme.breakpoints.desktop)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 햄버거 메뉴가 열릴 때 메인 화면 스크롤 막기 (모바일/태블릿만)
  useEffect(() => {
    // 데스크톱에서는 적용하지 않음
    const isDesktop = window.innerWidth >= parseInt(theme.breakpoints.desktop);
    if (isDesktop) {
      return;
    }

    if (isMenuOpen) {
      // 메뉴가 열릴 때: 현재 스크롤 위치 저장하고 body 스크롤 막기
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // 메뉴가 닫힐 때: body 스크롤 복구
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // 저장된 스크롤 위치로 복원
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      // cleanup: 컴포넌트 언마운트 시 스크롤 복구
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (!isMenuOpen) {
        window.scrollTo(0, scrollPositionRef.current);
      }
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // 모바일/태블릿에서는 모바일 메뉴가 열려있을 때는 클릭 외부 처리를 다르게
      if (window.innerWidth >= parseInt(theme.breakpoints.desktop)) {
        // 데스크톱에서만 외부 클릭 감지
        if (isMyPageOpen && !event.target.closest('.user-menu-container')) {
          setIsMyPageOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMyPageOpen]);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      dispatch(logout());
      setIsMyPageOpen(false);
      navigate('/');
    } catch (error) {
      dispatch(logout());
      setIsMyPageOpen(false);
      navigate('/');
    }
  };

  const handleMyPageClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setIsMyPageOpen(!isMyPageOpen);
  };

  const handleMenuItemClick = (callback) => {
    setIsMyPageOpen(false);
    setIsMenuOpen(false); // 모바일 메뉴도 닫기
    callback();
  };

  const HomeDirection = (
    <StyledLink to='/'>
      <HomeFigure>
        <HomeLogo src={fieldLogo} alt='fieldLogo' />
        <HomeTitle>FIELD</HomeTitle>
      </HomeFigure>
    </StyledLink>
  );

  const NavigationLinks = (
    <nav>
      <Link 
        to="/about" 
        className={isActivePath('/about') ? 'active' : ''}
        onClick={() => setIsMenuOpen(false)}
      >
        ABOUT FIELD
      </Link>
      <Link 
        to="/camp" 
        className={isActivePath('/camp') ? 'active' : ''}
        onClick={() => setIsMenuOpen(false)}
      >
        FIELD CAMP
      </Link>
      <Link 
        to="/news" 
        className={isActivePath('/news') ? 'active' : ''}
        onClick={() => setIsMenuOpen(false)}
      >
        NEWS
      </Link>
      <Link 
        to="/contact" 
        className={isActivePath('/contact') ? 'active' : ''}
        onClick={() => setIsMenuOpen(false)}
      >
        CONTACT
      </Link>
      <Link 
        to="/recruit" 
        className={isActivePath('/recruit') ? 'active' : ''}
        onClick={() => setIsMenuOpen(false)}
      >
        RECRUIT
      </Link>
    </nav>
  );

  const renderAuthSection = () => {
    if (isAuthenticated && user) {
      return (
        <UserSection className="user-menu-container">
          <UserIconWrapper onClick={handleMyPageClick}>
            <UserIcon />
            <span>{user.name || '사용자'}</span>
          </UserIconWrapper>
          <MyPageMenu $isOpen={isMyPageOpen}>
            <MenuItem onClick={() => {
              handleMenuItemClick(() => navigate('/mypage'));
            }}>
              내 정보
            </MenuItem>
            {!isAdmin && (
              <MenuItem onClick={() => {
                handleMenuItemClick(() => navigate('/inquiries'));
              }}>
                문의사항 확인
              </MenuItem>
            )}
            {isAdmin && (
              <MenuItem 
                $isAdmin 
                onClick={() => {
                  handleMenuItemClick(() => navigate('/admin/inquiries'));
                }}
              >
                문의사항 관리
              </MenuItem>
            )}
            {isSuperAdmin && (
              <MenuItem 
                $isAdmin 
                onClick={() => {
                  handleMenuItemClick(() => navigate('/admin/users'));
                }}
              >
                사용자 관리
              </MenuItem>
            )}
            <MenuItem onClick={() => {
              setIsMyPageOpen(false);
              setIsMenuOpen(false);
              handleLogout();
            }}>
              로그아웃
            </MenuItem>
          </MyPageMenu>
        </UserSection>
      );
    }

    return (
      <AuthButtons>
        <Link 
          to="/login" 
          className="auth-btn"
          onClick={() => setIsMenuOpen(false)}
        >
          로그인
        </Link>
        <span className="divider">|</span>
        <Link 
          to="/signup" 
          className="auth-btn"
          onClick={() => setIsMenuOpen(false)}
        >
          회원가입
        </Link>
      </AuthButtons>
    );
  };

  return (
    <MenuBar as="header" $isTransparentHeader={isTransparentHeader} $isScrolled={isScrolled}>
      <MainHeaderWrapper>
        {HomeDirection}
        <MenuButton aria-label='MenuButton' onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <MenuBurgur $open={isMenuOpen} />
        </MenuButton>
        <RightSection>
          <Navigation>
            {NavigationLinks}
          </Navigation>
          {renderAuthSection()}
        </RightSection>
      </MainHeaderWrapper>
      <MobileOverlay $isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />
      <MobileNavigationWrapper $isOpen={isMenuOpen}>
        {NavigationLinks}
        {renderAuthSection()}
      </MobileNavigationWrapper>
    </MenuBar>
  );
}
