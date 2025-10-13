import styled, {keyframes} from 'styled-components';
import {Link, useLocation} from 'react-router-dom';
import theme from '../../theme';

const slideDownAnimation = keyframes`
  0% {
    transform-origin: 0 0;
    transform: translateY(-100%);
  }

  100% {
    transform-origin: 0 0;
    transform: translateY(0%);
  }
`;

const HeaderContentSection = styled.div`
  position: fixed;
  top: 57px;
  height: 100vh;
  left: 0px;
  width: 100vw;
  background: rgba(0, 0, 0, 0.5);
  z-index: -2;
  display: ${props => (props.$isOpen ? 'block' : 'none')};

  @media (min-width: 1024px) {
    position: inherit;
    display: inline;
    width: auto;
    padding: 0 15% 0 0;
    height: auto;
    background: none;
    z-index: 10;
  }
`;

const HeaderContent = styled.nav`
  width: 100%;
  background: #141414;
  animation: ${slideDownAnimation} 0.3s ease-in-out;
  padding: 5px 0;

  @media (min-width: 1024px) {
    background: none;
    height: 58px;
    padding: 0;
    animation: none;
  }
`;

const MenuContainer = styled.ul`
  ${props =>
    props.className &&
    `
    li a[name="${props.className}"] {
      color: ${theme.colors.black};
      background: ${theme.colors.gray};
    }

    @media (min-width: 1024px) {
      li a[name="${props.className}"] {
      color: ${theme.colors.yellow};
      background:none;
    }
    }
  `}

  @media (min-width: 1024px) {
    display: flex;

    li::before {
      content: '';
      position: absolute;
      width: calc(100% + 4px);
      height: 1.5px;
      bottom: 8px;
      left: -2px;
      background-color: ${theme.colors.white};
      transform: scaleX(0);
      transform-origin: left center;
      transition: transform 0.3s ease;
    }

    li:hover::before {
      transform: scaleX(1);
      background-color: white;
    }
  }
`;

const OneMenu = styled.li`
  position: relative;
  height: 50px;

  a {
    font-family: 'Goblin One';
    display: flex;
    align-items: center;
    height: inherit;
    font-size: 20px;
    text-decoration: none;
    color: ${theme.colors.white};
    padding: 0 0 0 7.5%;
    background: none;
  }

  @media (min-width: 1024px) {
    margin: 0 0 0 20px;
    a {
      padding: 8px 0 0 0;
      font-size: 12px;
      white-space: nowrap;
    }
  }
`;

export default function MenuContent(props) {
  const {onClose, isOpen} = props;
  const Menus = [
  { title: 'ABOUT FIELD', link: 'about' },
  { title: 'FIELD CAMP', link: 'camp' },
  { title: 'NEWS', link: 'news' },
  { title: 'CONTACT', link: 'contact' },
  { title: 'RECRUIT', link: 'recruit' },
];

  const location = useLocation();
  const category = location.pathname.split('/')[1];

  return (
    <HeaderContentSection $isOpen={isOpen} onClick={onClose}>
      <HeaderContent>
        <MenuContainer className={category}>
          {Menus.map(Menu => (
            <OneMenu key={Menu.title}>
              <Link name={Menu.link} to={`/${Menu.link}`}>
                {Menu.title}
              </Link>
            </OneMenu>
          ))}
        </MenuContainer>
      </HeaderContent>
    </HeaderContentSection>
  );
}
