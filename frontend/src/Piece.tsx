class Piece {
    rowInd: number;
    colInd: number;
    width: number;
    height: number;
    rows: number;
    cols: number;
    x: number;
    y: number;

    constructor(rowInd: number, colInd: number, width: number, height: number, rows: number, cols: number) {
        this.rowInd = rowInd;
        this.colInd = colInd;
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.cols = cols;
        this.x = Number(colInd) * Number(width) / Number(cols); // Multiplies the row index by the width size of a piece 
        this.y = Number(rowInd) * Number(height) / Number(rows); // Multiplies the col index by the height size of a piece
    }

    draw(img: HTMLImageElement, ctx: CanvasRenderingContext2D)
    {
        ctx.beginPath();
        ctx.drawImage(img, this.x, this.y, (this.width / this.cols), (this.height / this.rows))
        ctx.rect(this.x, this.y, (this.width / this.cols), (this.height / this.rows));
        ctx.stroke();
    }
}

export default Piece