import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Piece from './Piece';
import Menu from './Menu';

let defaultImg = ["GreatFountainGeyer_EN-US10674250728_1920x1080.jpg", "OrkneyIslands_EN-US7244174382_1920x1080.jpg",
                  "PineGrosbeak_EN-US2151091421_1920x1080.jpg", "EquinoxAngkor_EN-US9664645165_1920x1080.jpg", 
                  "LimerickDay_EN-US4512689467_1920x1080.jpg", "ParrotDay_EN-US9824481217_1920x1080.jpg", 
                  "FoxgloveHawkmoth_EN-US4340017481_1920x1080.jpg", "Ceking_EN-US7899895685_1920x1080.jpg"];

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let numRow = 3;
let numCol = 3;
let WIDTHSIZE = WIDTH/numCol;
let HEIGHTSIZE = HEIGHT/numRow;

let pieces = [] as Piece[];
let currPiece = null as Piece | null;
let lockedPieceCount = 0;

let bkgOn = true;
let outlineOn = true;

let totalSeconds = 0;
let interval: ReturnType<typeof setInterval>;

const App = () => {
    const [imgSrc, setImgSrc] = useState("https://h2.gifposter.com/bingImages/" + defaultImg[Math.floor(Math.random() * defaultImg.length)]);

    // Initially getting the image from the backend
    useEffect(() => {
        axios.get('https://variety-jigsaw-backend.onrender.com')
            .then(response => {
            setImgSrc(response.data);
            })
    }, []);

    // Pressing the play button on the menu jumpstarts the game
    // and makes the menu go away
    const play = () => {
        const difficulty = document.getElementById('difficulty') as HTMLSelectElement;
        if(difficulty.value != 'select-difficulty')
        {
            const menu = document.getElementById('menu') as HTMLDivElement;
            menu.style.visibility = 'hidden';
            const bkg = document.getElementById('bkg') as HTMLInputElement;
            const outline = document.getElementById('outline') as HTMLInputElement;
            bkgOn = bkg.checked;
            outlineOn = outline.checked;
            pieces = [];
            createPieces();
            randomizePieces();
            drawBkg();
            drawPieces();
            addEventListeners();
            totalSeconds = 0;
            lockedPieceCount = 0;
            const timer = document.getElementById('timer') as HTMLDivElement;
            timer.style.visibility = 'visible';
            interval = setInterval(changeTimer, 1000);
        }
    }

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

    // Draws the transparent background on the background canvas
    const drawBkg = () => {
        const canvas = document.getElementById("bkg-canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        let img = new Image() as HTMLImageElement;
        img.src = imgSrc;
        if(bkgOn)
        {
            img.onload = () => {
                // Resets the canvas to start
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                // Transparent complete image behind all the pieces
                ctx.globalAlpha = 0.6;
                ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
            }
        }
        else 
        {
            img.onload = () => {
                // Resets the canvas to start
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
            }
        }
    }

    // Draws the jigsaw pieces on top of the background
    const drawPieces = () => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        let img = new Image() as HTMLImageElement;
        img.src = imgSrc;
        
        img.onload = () => {
            // Resets the canvas to start
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            // Max visibility for the pieces to be drawn
            ctx.globalAlpha = 1;
            // Draws all the pieces on the canvas from the end of
            // the array such that the locked pieces are drawn first
            for(let index = pieces.length-1; index >= 0; index--)
            {
                pieces[index].draw(img, ctx, outlineOn);
            }
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
            if(currPiece.canMove && getDistance(currPiece.x, currPiece.y, startX, startY) < Math.max(WIDTHSIZE, HEIGHTSIZE) / 3)
            {
                // Sending the current piece to the end of the array since it is now locked
                const index = pieces.indexOf(currPiece);
                pieces.splice(index, 1);
                pieces.push(currPiece);

                // Locking the piece at its original spot
                currPiece.canMove = false;
                currPiece.x = currPiece.getStartX();
                currPiece.y = currPiece.getStartY();
                drawPieces();
                lockedPieceCount++;
                
                // All pieces being locked means the game is over
                // and the menu is seen again
                if((numRow * numCol) == lockedPieceCount)
                {
                    clearInterval(interval);
                    const menu = document.getElementById('menu') as HTMLDivElement;
                    menu.style.visibility = 'visible';
                }
            }
        }
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
            // Redraw the pieces after changing the coordinates of the current piece
            drawPieces();
        }
    }

    const setDifficulty = () => {
            const difficulty = (document.getElementById('difficulty') as HTMLSelectElement).value;
            switch(difficulty) {
                case 'easy':
                    numRow = 3;
                    numCol = 3;
                    break;
                case 'medium':
                    numRow = 10;
                    numCol = 10;
                    break;
                case 'hard':
                    numRow = 20;
                    numCol = 20;
                    break;
                case 'extreme':
                    numRow = 32;
                    numCol = 32;
                    break;
            }
            WIDTHSIZE = WIDTH/numCol;
            HEIGHTSIZE = HEIGHT/numRow;
    }

    const outline = () => {
        const outline = document.getElementById('outline') as HTMLInputElement;
        outline.checked = (outline.checked == true ? false : true);
    }

    const background = () => {
        const bkg = document.getElementById('bkg') as HTMLInputElement;
        bkg.checked = (bkg.checked == true ? false : true);
    }

    const changeTimer = () => {
        totalSeconds++;
        let hour = Math.floor(totalSeconds / 3600);
        let minute = Math.floor((totalSeconds - hour * 3600) / 60);
        let seconds = totalSeconds - (hour * 3600 + minute * 60);
        let hourFormat = hour >= 10 ? '' : '0';
        let minuteFormat = minute >= 10 ? ':' : ':0';
        let secFormat = seconds >= 10 ? ':' : ':0'; 
        (document.getElementById("timer") as HTMLDivElement).innerHTML = hourFormat + hour + minuteFormat + minute + secFormat + seconds;
    }

  return (
    <div>
        <canvas id='bkg-canvas' width={WIDTH} height={HEIGHT}></canvas>
        <canvas id='canvas' width={WIDTH} height={HEIGHT}></canvas>
        <Menu setDifficulty={setDifficulty} play={play} outline={outline} background={background}/>
        <div id='timer' className='unselectable'>00:00:00</div>
    </div>
  );
}

export default App;
