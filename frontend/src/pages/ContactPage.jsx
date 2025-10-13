import styled from 'styled-components';
import ContactForm from '../components/contact/ContactForm';

const ContactMain = styled.main`
  margin: 0 7.5% 2rem 7.5%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin: 3rem 0;
  font-family: 'ChosunKm';
  color: ${props => props.theme.colors.white};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

export default function ContactPage() {
  return (
    <ContactMain>
      <Title>CONTACT</Title>
      <ContactForm />
    </ContactMain>
  );
}
