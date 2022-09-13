import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Piece from './Piece';

const ROW = 3;
const COL = 3;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WIDTHSIZE = WIDTH/COL;
const HEIGHTSIZE = HEIGHT/ROW;
let pieces = [] as Piece[];
let currPiece = null as Piece | null;

const App = () => {
  const [imgSrc, setImgSrc] = useState("");
  const [lockedPieceCount, setLockedPieceCount] = useState(0);

  // Initially getting the image from the backend
  useEffect(() => {
      axios.get('http://127.0.0.1:5000/img')
        .then(response => {
          setImgSrc(response.data);
        })
      pieces = [];
      createPieces();
  }, []);

  // Logic for the game
  useEffect(() => {
      randomizePieces();
      drawCanvas();
      addEventListeners();
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

  // Draws the transparent background on the canvas and the jigsaw pieces
  // on top of the background
  const drawCanvas = () => {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
      let img = new Image() as HTMLImageElement;
      img.src = imgSrc;
      img.width = canvas.clientWidth;
      img.height = canvas.clientHeight;
      
      img.onload = () => {
        // Resets the canvas to start
          ctx.clearRect(0, 0, WIDTH, HEIGHT);
          // Transparent complete image behind all the pieces
          ctx.globalAlpha = 0.5;
          ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
          // Max visibility for the pieces to be drawn
          ctx.globalAlpha = 1;
          drawPieces(img, ctx);
      }
  }


  // Loops through all the pieces 
  // and calls a piece's draw function
  const drawPieces = (img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    for(let index = pieces.length-1; index >= 0; index--)
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

  const addEventListeners = () => {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("mousemove", onMouseMove);
  }

  const onMouseDown = (e: MouseEvent) => {
      // Find whether or not the mouse is selecting on a piece.
      // The mouse is selecting a piece as long as its coordinates
      // are within the boundaries of the piece.
      // If a piece is selected, make it the selected piece. 
      // Otherwise, the selected piece remains null. 
      for(let index = 0; index < pieces.length; index++)
      {
          if(e.x > pieces[index].x && e.x < pieces[index].x + WIDTHSIZE &&
             e.y > pieces[index].y && e.y < pieces[index].y + HEIGHTSIZE)
          {
                currPiece = pieces[index];
                break;
          }
      }
      if(currPiece != null)
      {
            currPiece.offsetX = e.x - currPiece.x;
            currPiece.offsetY = e.y - currPiece.y;
      }
  }

  const onMouseUp = (e: MouseEvent) => {
      // More crucial when there is already a selected piece 
      // Only lock the piece in if it does not overshoot its original location by a large margin.
      // Set the selected piece to null.
      if(currPiece != null)
      {
            // Overshooting can be determined via a threshhold using the pythagorean theorem
            // if()
            // {
                const index = pieces.indexOf(currPiece);
                pieces.splice(index, 1);
                pieces.push(currPiece);
                currPiece.canMove = false;
                currPiece.x = currPiece.getStartX();
                currPiece.y = currPiece.getStartY();
                // }
        }
        currPiece = null;
        drawCanvas();
  }

  const onMouseMove = (e: MouseEvent) => {
      if(currPiece != null && currPiece.canMove)
      {
          currPiece.x = e.x - currPiece.offsetX;
          currPiece.y = e.y - currPiece.offsetY;
          // Redraw the canvas after changing the coordinates of the current piece
          drawCanvas();
      }
  }

  return (
    <div>
      <canvas id='canvas' width={WIDTH} height={HEIGHT}></canvas>
    </div>
  );
}

export default App;
