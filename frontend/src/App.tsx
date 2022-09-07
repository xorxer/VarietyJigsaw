import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Piece from './Piece';
import $ from 'jquery';

const ROW = 3;
const COL = 3;
const width = window.innerWidth;
const height = window.innerHeight;
const pieces = [] as Piece[];

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
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      let img = new Image() as HTMLImageElement;
      img.src = imgSrc;
      img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.clientWidth * 1, canvas.clientHeight * 1);
      }
  });

  // Essentially makes a grid of Piece objects based
  // on the specified rows and cols
  const createPieces = () => {
      for(let row = 0; row < ROW; row++)
      {
          for(let col = 0; col < COL; col++)
          {
              pieces.push(new Piece(row, col));
          } 
      }
  }

  // Loops through all the pieces 
  // and calls a piece's draw function
  const drawPieces = (ctx: any) => {
    for(let index = 0; index < pieces.length; index++)
    {
        pieces[index].draw(ctx);
    }
  }

  return (
    <div>
      <canvas id='canvas' width={width} height={height}></canvas>
    </div>
  );
}

export default App;
