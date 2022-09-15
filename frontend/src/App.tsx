import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Piece from './Piece';

const numRow = 3;
const numCol = 3;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const WIDTHSIZE = WIDTH/numCol;
const HEIGHTSIZE = HEIGHT/numRow;
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
      randomizePieces();
  }, []);

  // Logic for the game
  useEffect(() => {
      drawCanvas();
      addEventListeners();
  });

  // Essentially makes a grid of Piece objects based
  // on the specified rows and cols
  const createPieces = () => {
      for(let row = 0; row < numRow; row++)
      {
          for(let col = 0; col < numCol; col++)
          {
              pieces.push(new Piece(row, col, WIDTHSIZE, HEIGHTSIZE, numRow, numCol, true));
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
      
      img.onload = () => {
        // Resets the canvas to start
          ctx.clearRect(0, 0, WIDTH, HEIGHT);
          // Transparent complete image behind all the pieces
          ctx.globalAlpha = 0.7;
          ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
          // Max visibility for the pieces to be drawn
          ctx.globalAlpha = 1;
          drawPieces(img, ctx);
      }
  }


  // Draws all the pieces on the canvas from the end of
  // the array such that the locked pieces are drawn first
  const drawPieces = (img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    for(let index = pieces.length-1; index >= 0; index--)
    {
        pieces[index].draw(img, ctx);
    }
  }

  // Changes the locations of the pieces randomly
  const randomizePieces = () => {
    for(let index = 0; index < pieces.length; index++)
    {
        let newX = Math.random() * (WIDTH-WIDTHSIZE) as number;
        let newY = Math.random() * (HEIGHT-HEIGHTSIZE) as number;
        pieces[index].x = newX;
        pieces[index].y = newY;
    }
  }

  // Adding all event listeners for the game
  const addEventListeners = () => {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("touchstart", onMouseDown);
      canvas.addEventListener("touchend", onMouseUp);
      canvas.addEventListener("touchmove", onMouseMove);
  }

  // Returns an object that represents the coordinates of the user's 
  // mouse or touch location
  const getUserCoord = (e: MouseEvent | TouchEvent) => {
      let userCoord = {x: 0, y: 0};
      if(e instanceof MouseEvent)
      {
          userCoord.x = e.clientX;
          userCoord.y = e.clientY;
      }
      else
      {
          userCoord.x = e.touches[0].clientX;
          userCoord.y = e.touches[0].clientY;
      }
      return userCoord;
  }

  const onMouseDown = (e: MouseEvent | TouchEvent) => {
      // Find whether or not the mouse is selecting on a piece.
      // If a piece is selected, make it the selected piece. 
      // Otherwise, the selected piece remains null. 
      let userCoord = getUserCoord(e);
      for(let index = 0; index < pieces.length; index++)
      {
          if(userCoord.x > pieces[index].x && userCoord.x < pieces[index].x + WIDTHSIZE &&
             userCoord.y > pieces[index].y && userCoord.y < pieces[index].y + HEIGHTSIZE)
          {
                currPiece = pieces[index];
                break;
          }
      }
      // Setting the offset for a piece such that calculating distance 
      // later on is easy using the top left corner of a piece
      if(currPiece != null)
      {
            currPiece.offsetX = userCoord.x - currPiece.x;
            currPiece.offsetY = userCoord.y - currPiece.y;
      }
  }

  const onMouseUp = (e: MouseEvent | TouchEvent) => {
      if(currPiece != null)
      {
        const startX = currPiece.getStartX();
        const startY = currPiece.getStartY();
        // Getting the distance of a piece then checking if is a reasonable distance of the original location 
        if(getDistance(currPiece.x, currPiece.y, startX, startY) < Math.max(WIDTHSIZE, HEIGHTSIZE) / 3)
        {
          // Sending the current piece to the end of the array since it is now locked
          const index = pieces.indexOf(currPiece);
          pieces.splice(index, 1);
          pieces.push(currPiece);

          // Locking the piece at its original spot
          currPiece.canMove = false;
          currPiece.x = currPiece.getStartX();
          currPiece.y = currPiece.getStartY();

          // Gauging the end game
          setLockedPieceCount(lockedPieceCount + 1);
        }
      }
      drawCanvas();
      // Letting go of the piece means we no longer have a current piece.
      currPiece = null;
  }

  // Returns the distance between two points via the distance formula
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
        return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
  }

  const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if(currPiece != null && currPiece.canMove)
      {
          let userCoord = getUserCoord(e);
          currPiece.x = userCoord.x - currPiece.offsetX;
          currPiece.y = userCoord.y - currPiece.offsetY;
          // Redraw the canvas after changing the coordinates of the current piece
          drawCanvas();
      }
  }

  const setDifficulty = () => {

  }

  const reset = () => {
    
  }

  return (
    <div>
      <canvas id='canvas' width={WIDTH} height={HEIGHT}></canvas>
      <div className='menu'>
            <button>Play</button>
            Difficulty <select id='' onChange={setDifficulty}>
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
            </select>
            <button onClick={reset}>Reset</button>
        </div>
    </div>
  );
}

export default App;
