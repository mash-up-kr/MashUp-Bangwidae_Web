import { useEffect, useState } from 'react';

function Home() {
  const [cookie, setCookie] = useState('');

  useEffect(() => {
    setCookie(document.cookie);
  }, []);

  return <div>Cookie is {cookie || 'empty.'}</div>;
}

export default Home;
