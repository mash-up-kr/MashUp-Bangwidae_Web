
import styled from 'styled-components';
import styles from '../styles/Home.module.css';

const Home = () => {
  return <div className={styles.container}></div>;
};

export default Home;

const TestDiv = styled.div`
  height: 100vh;
  width: 100%;
  // style lint formatOnSave도 안되네 
  
  position: absolute;
`
