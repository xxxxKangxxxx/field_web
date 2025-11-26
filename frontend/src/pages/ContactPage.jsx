import styled from 'styled-components';
import ContactForm from '../components/contact/ContactForm';
import theme from '../theme';

const ContactMain = styled.main`
  margin: 0 auto 2rem auto !important;
  padding-left: 7.5% !important;
  padding-right: 7.5% !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;

  ${theme.media.tablet} {
    padding-left: 5% !important;
    padding-right: 5% !important;
  }

  ${theme.media.mobile} {
    padding-left: 3% !important;
    padding-right: 3% !important;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin: 3rem 0;
  font-family: 'ChosunKm';
  color: ${props => props.theme.colors.white};
  text-transform: uppercase;
  letter-spacing: 2px;

  ${props => props.theme.media.tablet} {
    font-size: 2rem;
    margin: 2.5rem 0;
  }

  ${props => props.theme.media.mobile} {
    font-size: 1.5rem;
    margin: 2rem 0;
    letter-spacing: 1px;
  }
`;

export default function ContactPage() {
  return (
    <ContactMain>
      <Title>CONTACT</Title>
      <ContactForm />
    </ContactMain>
  );
}
