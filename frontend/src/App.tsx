import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Piece from './Piece';
import $ from 'jquery';

const ROW = 3;
const COL = 3;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WIDTHSIZE = WIDTH/COL;
const HEIGHTSIZE = HEIGHT/ROW;
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
          drawPieces(img, ctx);
      }
      // randomizePieces();
  });

  // Essentially makes a grid of Piece objects based
  // on the specified rows and cols
  const createPieces = () => {
      for(let row = 0; row < ROW; row++)
      {
          for(let col = 0; col < COL; col++)
          {
              pieces.push(new Piece(row, col, WIDTHSIZE, HEIGHTSIZE));
          } 
      }
  }

  // Loops through all the pieces 
  // and calls a piece's draw function
  const drawPieces = (img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    for(let index = 0; index < pieces.length; index++)
    {
        pieces[index].draw(img, ctx);
    }
  }

  // Creates a new location anywhere on the canvas for all the pieces to go
  const randomizePieces = () => {
    for(let index = 0; index < pieces.length; index++)
    {
        let newX = Math.random() * WIDTH as number;
        let newY = Math.random() * HEIGHT as number;
        pieces[index].x = newX;
        pieces[index].y = newY;
    }
  }

  return (
    <div>
      <canvas id='canvas' width={WIDTH} height={HEIGHT}></canvas>
    </div>
  );
}

export default App;
