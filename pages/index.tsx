import { useEffect, useState } from 'react';

function Home() {
  const [cookie, setCookie] = useState('');

  useEffect(() => {
    setCookie(document.cookie);
  }, []);

  return (
    <>
      <div>Cookie is {cookie || 'empty.'}</div>
      <div>Env is {process.env.NEXT_PUBLIC_BASE_URL}</div>
    </>
  );
}

export default Home;
