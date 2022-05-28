const   CELL_WIDTH = 30;
const   CELL_HEIGHT = 30;

const   CELL_EMPTY = 0,
        CELL_O = 1,
        CELL_X = 2;

class Cell {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.status = CELL_EMPTY;
    }
    getHtml() {
        let top = this.y*CELL_HEIGHT;
        let left = this.x*CELL_WIDTH;
        let cellHtml = `<div id="cell-${this.x}-${this.y}" onclick="cellClick(${this.x},${this.y})" class="caro-game"
                    style="position: absolute; top: ${top}px; left: ${left}px; 
                    width: ${CELL_WIDTH}px; height: ${CELL_HEIGHT}px;">
                    </div>`;
        return cellHtml;
    }
}

class CaroGameBoard {
    constructor(cols, rows, divID){
        this.cols = cols;
        this.rows = rows;
        this.divID = divID;
        this.array = [];
        this.currentPlayer = CELL_X;
        this.isWin = false;
        this.count = 1;
    }
    drawBoard() {
        for(let i = 0; i <= this.rows; i++) {
            this.array.push([]);
            for (let j = 0; j <= this.cols; j++) {
                let cell = new Cell(i,j);
                this.array[i].push(cell);
                document.getElementById(this.divID).innerHTML += cell.getHtml();
            }
        }
    }
    play(x,y) {
        this.changeData(x,y);
        this.checkResult(x,y);
        this.changePlayer();
    }
    changeData(x,y) {
        switch(this.array[x][y].status) {
            case CELL_EMPTY:
                if(this.currentPlayer == CELL_X) {
                    this.array[x][y].status = CELL_X;
                    this.print(x,y);
                }
                else {
                    this.array[x][y].status = CELL_O;
                    this.print(x,y);
                }
                break;
            default:
                alert("Cell is not empty");
                break;
        }
    }
    print(x,y) {
        if (this.currentPlayer == CELL_X) {
            document.getElementById(`cell-${x}-${y}`).innerHTML = "X";
        } else {
            document.getElementById(`cell-${x}-${y}`).innerHTML = "O";
        }
    }
    checkResult(x,y) {
        //CHECK HORIZONTAL:
        for (let i = 1; i<5; i++) {
            if (x+i <= this.array.length-1 && this.array[x][y].status == this.array[x+i][y].status) {
                this.count++;
            } else break;
        }
        for (let i = 1; i<5; i++) {
            if (x-i >= 0 && this.array[x][y].status == this.array[x-i][y].status) {
                this.count++;
            } else break;
        }
        this.isEnd();
        //CHECK VERTICAL:
        for (let i = 1; i<5; i++) {
            if (y+i <= this.array[x].length-1 && this.array[x][y].status == this.array[x][y+i].status) {
                this.count++;
            } else break;
        }
        for (let i = 1; i<5; i++) {
            if (y-i >= 0 && this.array[x][y].status == this.array[x][y-i].status) {
                this.count++;
            } else break;
        }
        this.isEnd();
        //CHECK \-DIAGONAL:
        for (let i = 1; i<5; i++) {
            if (x+i <= this.array.length-1 && y+i <= this.array[x].length-1) {
                if (this.array[x][y].status == this.array[x+i][y+i].status) {
                    this.count++;
                } else break;
            }
        }
        for (let i = 1; i<5; i++) {
            if (x-i >= 0 && y-i >= 0) {
                if (this.array[x][y].status == this.array[x-i][y-i].status) {
                    this.count++;
                } else break;
            }
        }
        this.isEnd();
        //CHECK /-DIAGONAL:
        for (let i = 1; i<5; i++) {
            if (x+i <= this.array.length-1 && y-i >= 0) {
                if (this.array[x][y].status == this.array[x+i][y-i].status) {
                    this.count++;
                } else break;
            }
        }
        for (let i = 1; i<5; i++) {
            if ( x-i >= 0 && y+i <= this.array[x].length-1) {
                if (this.array[x][y].status == this.array[x-i][y+i].status) {
                    this.count++;
                } else break;
            }
        }
        this.isEnd();
        if(this.isWin == true) {
            this.annouceWinner(this.currentPlayer);
        }
    }
    isEnd() {
        if (this.count >= 5) {
            this.isWin = true;
        } else this.count = 1;
    }
    annouceWinner(curr) {
        if (curr == CELL_X) {
            alert("NGƯỜI CHƠI X THẮNG")
        } 
        if (curr == CELL_O) {
            alert("NGƯỜI CHƠI O THẮNG")
        } 
    }
    changePlayer() {
        if(this.currentPlayer == CELL_X) {
            this.currentPlayer = CELL_O;
        } else this.currentPlayer = CELL_X;
    }
}

let game = new CaroGameBoard(10,10,"game-board");
game.drawBoard();
console.log(game.array)

function cellClick(x,y){
    game.play(x,y);
    console.log(game.array);
}