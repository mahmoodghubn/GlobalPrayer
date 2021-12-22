import React, {useState, useEffect} from 'react';

const buildUrl = () => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    // TODO - fix url
    // TODO - change the time
    // TODO - gets the location

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const url2 = `https://api.aladhan.com/v1/calendar?latitude=51.508515&longitude=-0.1254872&method=2&month=${month}&year=${year}`;
    setUrl(url2);
  }, []);

  return url;
};
export default buildUrl;
