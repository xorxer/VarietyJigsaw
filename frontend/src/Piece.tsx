class Piece {
    rowInd: number;
    colInd: number;
    widthSize: number;
    heightSize: number;
    x: number;
    y: number;

    constructor(rowInd: number, colInd: number, widthSize: number, heightSize: number) {
        this.rowInd = rowInd;
        this.colInd = colInd;
        this.widthSize = widthSize;
        this.heightSize = heightSize;
        this.x = Number(colInd) * widthSize; // Multiplies the row index by the width size of a piece 
        this.y = Number(rowInd) * heightSize; // Multiplies the col index by the height size of a piece
    }

    draw(img: HTMLImageElement, ctx: CanvasRenderingContext2D)
    {
        ctx.beginPath();
        // drawImage first 4 numbers determine displacement/size of the image itself. While
        // the last 4 numbers determine displacement/size from the canvas itself
        ctx.drawImage(img, this.x, this.y, this.widthSize, this.heightSize, 
                           this.x, this.y, this.widthSize, this.heightSize);
        // Draws lines that distinguish the pieces from one another
        ctx.rect(this.x, this.y, this.widthSize, this.heightSize);
        ctx.stroke();
    }
}

export default Piece