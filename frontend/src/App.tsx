import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Piece from './Piece';

const ROW = 5;
const COL = 10;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WIDTHSIZE = WIDTH/COL;
const HEIGHTSIZE = HEIGHT/ROW;
const pieces = [] as Piece[];
let selectedPiece = null;

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
      console.log(pieces);
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      let img = new Image() as HTMLImageElement;
      img.src = imgSrc;
      img.width = canvas.clientWidth;
      img.height = canvas.clientHeight;

      // Resets the canvas to start
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      img.onload = () => {
          // Transparent complete image behind all the pieces
          ctx.globalAlpha = 0.5;
          ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
          // Max visibility for the pieces to be drawn
          ctx.globalAlpha = 1;
          drawPieces(img, ctx);
      }
      randomizePieces();
      addEventListeners(canvas);
  });

  // Essentially makes a grid of Piece objects based
  // on the specified rows and cols
  const createPieces = () => {
      for(let row = 0; row < ROW; row++)
      {
          for(let col = 0; col < COL; col++)
          {
              pieces.push(new Piece(row, col, WIDTHSIZE, HEIGHTSIZE, ROW, COL, true));
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
        let newX = Math.random() * (WIDTH-WIDTHSIZE) as number;
        let newY = Math.random() * (HEIGHT-HEIGHTSIZE) as number;
        pieces[index].x = newX;
        pieces[index].y = newY;
    }
  }

  const addEventListeners = (canvas: HTMLCanvasElement) => {
      canvas.addEventListener("mousedown", mouseDown, false);
      canvas.addEventListener("mouseup", mouseUp, false);
      canvas.addEventListener("mousemove", mouseMove, false);
  }

  const mouseDown = (e: MouseEvent) => {
      // Find whether or not the mouse is selecting on a piece.
      // The mouse is selecting a piece as long as its coordinates
      // are within the boundaries of the piece.
      // If a piece is selected, make it the selected piece. 
      // Otherwise, the selected piece is set to null. 
      selectedPiece = null;
      for(let index = 0; index < pieces.length; index++)
      {
          if(e.x >= pieces[index].x && e.x <= pieces[index].x + WIDTHSIZE && 
             e.y >= pieces[index].y && e.y <= pieces[index].y + HEIGHTSIZE)
          {
              selectedPiece = pieces[index];
              break;
          }
      }
  }

  const mouseUp = (e: Event) => {

  }

  const mouseMove = (e: Event) => {

  }

  return (
    <div>
      <canvas id='canvas' width={WIDTH} height={HEIGHT}></canvas>
    </div>
  );
}

export default App;
