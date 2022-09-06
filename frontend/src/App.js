import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Piece from './Piece';

const ROW = 3;
const COL = 3;
const WIDTH = 0;
const HEIGHT = 0;
const pieces = [];


const App = () => {
  const [imgSrc, setImgSrc] = useState("");

  // Initially getting the image from the backend
  useEffect(() => {
      axios.get('http://127.0.0.1:5000/img')
        .then(response => {
          setImgSrc(response.data);
        })
  }, []);

  // Logic for the game
  useEffect(() => {
      createPieces();
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
  })

  // Essentially makes a grid of Piece objects based
  // on the specified rows and cols
  const createPieces = () => {
      for(let row = 0; row < ROW; row++)
      {
          for(let col = 0; col < col; col++)
          {
              pieces.push(new Piece(row, col));
          } 
      }
  }

  return (
    <div>
      <img src={imgSrc} id='img'></img>
      <canvas id='canvas'></canvas>
    </div>
  );
}

export default App;
