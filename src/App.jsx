import { useEffect, useState } from 'react';
import './App.css'
import axios from 'axios';
function App() {
  const [data,setData]=useState('');
  useEffect(()=>{
    const getHelloWorld = async()=>{
      let res = await axios.get( `${import.meta.env.VITE_LOCAL_SERVER_ADDRESS}`)
      setData(res.data);
    }
    getHelloWorld();
  },[]);
  return (
    <>
    {data}
    </>
  )
}

export default App
