
import styled from 'styled-components';
import styles from '../styles/Home.module.css';

const Home = () => {
  return <TestDiv className={styles.container}></TestDiv>;
};

export default Home;

const TestDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100vh;
`
