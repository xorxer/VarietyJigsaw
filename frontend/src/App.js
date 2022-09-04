import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [img, setImg] = useState();

  useEffect(() => {
      axios.get('http://127.0.0.1:5000/img')
        .then(response => {
          setImg(response.data);
          // console.log(response);
        })
  }, []);

  return (
    <div>Hello World</div>
    // <div>{parse({img})}</div>
  );
}

export default App;
