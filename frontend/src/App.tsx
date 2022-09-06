import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Piece from './Piece';

const ROW = 3;
const COL = 3;
const width = window.innerWidth;
const height = window.innerHeight;
const STARTX = width/2;
const STARTY = height/2;
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
      // createPieces();
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") ;
      // let img = new Image(1920, 1080) as HTMLImageElement;
      // img.src = {imgSrc};
      // img.onload = () => {
      //     ctx.drawImage(img, 0, 0);
      // }
  }, []);

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
      {/* <img src={imgSrc} id='img'></img> */}
      <canvas id='canvas' width={width} height={height}></canvas>
    </div>
  );
}

export default App;
