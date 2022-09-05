import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [img, setImg] = useState("");

  useEffect(() => {
      axios.get('http://127.0.0.1:5000/img')
        .then(response => {
          setImg(response.data);
          console.log(response.data);
        })
  }, []);

  return (
    // <div>Hello World</div>
    <div>
      <img src={img}></img>
    </div>
  );
}

export default App;
