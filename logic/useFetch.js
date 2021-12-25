import React, {useState, useEffect} from 'react';

const useFetch = url => {
  const [loading, setLoading] = useState(true);
  const [monthData, setMonthData] = useState('');
  const getPrayingTime = async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      const {data} = await {...json};
      console.log(data);
      setMonthData(data);
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };
  useEffect(() => {
    getPrayingTime();
  }, [url]);
  return {loading, monthData};
};

export default useFetch;
