class Piece {
    rowInd: number;
    colInd: number;
    widthSize: number;
    heightSize: number;
    x: number;
    y: number;
    rows: number;
    cols: number;
    canMove: boolean;
    offsetX = 0 as number;
    offsetY = 0 as number;

    constructor(rowInd: number, colInd: number, widthSize: number, heightSize: number, rows: number, cols: number, canMove: boolean) {
        this.rowInd = rowInd;
        this.colInd = colInd;
        this.widthSize = widthSize;
        this.heightSize = heightSize;
        this.x = Number(colInd) * widthSize; // Multiplies the row index by the width size of a piece 
        this.y = Number(rowInd) * heightSize; // Multiplies the col index by the height size of a piece
        this.rows = rows;
        this.cols = cols;
        this.canMove = canMove;
    }

    draw(img: HTMLImageElement, ctx: CanvasRenderingContext2D)
    {
        ctx.beginPath();
        // drawImage first 4 numbers determine displacement/size of the image itself. While
        // the last 4 numbers determine displacement/size from the canvas itself
        ctx.drawImage(img, 
            this.colInd * img.width/this.cols, // The same as x, but for image displacement
            this.rowInd * img.height/this.rows, // The same as y, but for image displacement
            img.width/this.cols, 
            img.height/this.rows, 
            this.x, 
            this.y, 
            this.widthSize, 
            this.heightSize);
        // Draws lines that distinguish the pieces from one another
        ctx.rect(this.x, this.y, this.widthSize, this.heightSize);
        ctx.stroke();
    }
}

export default Piece