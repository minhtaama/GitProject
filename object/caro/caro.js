const   CELL_WIDTH = 40;
const   CELL_HEIGHT = 40;

const   CELL_EMPTY = 0,
        CELL_O = 1,
        CELL_X = 2;

const   PLAYER_X = `<img src="X.png" style="position: relative; width: ${CELL_WIDTH-12}px; height: ${CELL_HEIGHT-12}px; margin-top: 4px">`,
        PLAYER_X_BIGGER = `<img src="X.png" style="position: relative; width: ${CELL_WIDTH}px; height: ${CELL_HEIGHT}px; top:10px">`,
        PLAYER_O = `<img src="O.png" style="position: relative; width: ${CELL_WIDTH-12}px; height: ${CELL_HEIGHT-12}px; margin-top: 4px">`,
        PLAYER_O_BIGGER = `<img src="O.png" style="position: relative; width: ${CELL_WIDTH}px; height: ${CELL_HEIGHT}px; top:10px">`;

class Cell {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.status = CELL_EMPTY;
    }
    getHtml() {
        let top = this.y*CELL_HEIGHT;
        let left = this.x*CELL_WIDTH;
        let cellHtml = `<div id="cell-${this.x}-${this.y}" onclick="cellClick(${this.x},${this.y})" class="caro-cell"
                    style="position: absolute; top: ${top+2}px; left: ${left+2}px; 
                    width: ${CELL_WIDTH-2}px; height: ${CELL_HEIGHT-2}px;">
                    </div>`; //vì div có border là 1px rồi
        return cellHtml;
    }
    setHtmlCell() {
        this.htmlElement = document.getElementById(`cell-${this.x}-${this.y}`);
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
        this.winIDs = []; //array store to change background color of winning line
    }

    drawBoard() {
        document.getElementById(this.divID).innerHTML = "";
        document.getElementById(this.divID).setAttribute(
                    `style`,`position: relative; 
                     width: ${this.rows*CELL_WIDTH}px; height: ${this.cols*CELL_HEIGHT}px; 
                     border: 3px solid rgb(36, 36, 150);`
                     );
        for(let i = 0; i <= this.rows-1; i++) {
            this.array.push([]);
            for (let j = 0; j <= this.cols-1; j++) {
                let cell = new Cell(i,j);
                this.array[i].push(cell);
                document.getElementById(this.divID).innerHTML += cell.getHtml();
                cell.setHtmlCell();
            }
        }
    }

    play(x,y) {
        switch(this.array[x][y].status) {
            case CELL_EMPTY:
                if(this.currentPlayer == CELL_X) {
                    this.array[x][y].status = CELL_X;
                    this.print(x,y);
                    this.checkResult(x,y);
                    this.changePlayer();
                }
                else {
                    this.array[x][y].status = CELL_O;
                    this.print(x,y);
                    this.checkResult(x,y);
                    this.changePlayer();
                }
                break;
            default:
                break;
        }
    }

    print(x,y) {
        if (this.currentPlayer == CELL_X) {
            document.getElementById(`cell-${x}-${y}`).innerHTML = PLAYER_X;
        } else {
            document.getElementById(`cell-${x}-${y}`).innerHTML = PLAYER_O;
        }
    }

    checkResult(x,y) {
        //CHECK HORIZONTAL:
        this.winIDs.push(`cell-${x}-${y}`);
        for (let i = 1; i<5; i++) {
            if (x+i <= this.array.length-1 && this.array[x][y].status == this.array[x+i][y].status) {
                this.count++;
                this.winIDs.push(`cell-${x+i}-${y}`);
            } else break;
        }
        for (let i = 1; i<5; i++) {
            if (x-i >= 0 && this.array[x][y].status == this.array[x-i][y].status) {
                this.count++;
                this.winIDs.push(`cell-${x-i}-${y}`);
            } else break;
        }
        this.isEnd();
        //CHECK VERTICAL:
        this.winIDs.push(`cell-${x}-${y}`);
        for (let i = 1; i<5; i++) {
            if (y+i <= this.array[x].length-1 && this.array[x][y].status == this.array[x][y+i].status) {
                this.count++;
                this.winIDs.push(`cell-${x}-${y+i}`);
            } else break;
        }
        for (let i = 1; i<5; i++) {
            if (y-i >= 0 && this.array[x][y].status == this.array[x][y-i].status) {
                this.count++;
                this.winIDs.push(`cell-${x}-${y-i}`);
            } else break;
        }
        this.isEnd();
        //CHECK \-DIAGONAL:
        this.winIDs.push(`cell-${x}-${y}`);
        for (let i = 1; i<5; i++) {
            if (x+i <= this.array.length-1 && y+i <= this.array[x].length-1) {
                if (this.array[x][y].status == this.array[x+i][y+i].status) {
                    this.count++;
                    this.winIDs.push(`cell-${x+i}-${y+i}`);
                } else break;
            }
        }
        for (let i = 1; i<5; i++) {
            if (x-i >= 0 && y-i >= 0) {
                if (this.array[x][y].status == this.array[x-i][y-i].status) {
                    this.count++;
                    this.winIDs.push(`cell-${x-i}-${y-i}`);
                } else break;
            }
        }
        this.isEnd();
        //CHECK /-DIAGONAL:
        this.winIDs.push(`cell-${x}-${y}`);
        for (let i = 1; i<5; i++) {
            if (x+i <= this.array.length-1 && y-i >= 0) {
                if (this.array[x][y].status == this.array[x+i][y-i].status) {
                    this.count++;
                    this.winIDs.push(`cell-${x+i}-${y-i}`);
                } else break;
            }
        }
        for (let i = 1; i<5; i++) {
            if ( x-i >= 0 && y+i <= this.array[x].length-1) {
                if (this.array[x][y].status == this.array[x-i][y+i].status) {
                    this.count++;
                    this.winIDs.push(`cell-${x-i}-${y+i}`);
                } else break;
            }
        }
        this.isEnd();
        if(this.isWin == true) {
            this.annouceWinner();
        }
    }

    isEnd() {
        if (this.count >= 5) {
            this.isWin = true;
        } else {
            this.count = 1;
            this.winIDs = [];
        }
    }

    annouceWinner() {
        let cells = document.getElementsByClassName("caro-cell");
        for (let i = 0; i< cells.length; i++) {
            cells[i].removeAttribute("onclick");
        }
        for(let i = 0; i< this.winIDs.length; i++) { //change background color of winning line:
            document.getElementById(this.winIDs[i]).style.backgroundColor = "rgb(139, 255, 139)";
        };
        console.log(this.winIDs);
    }

    changePlayer() {
        if(this.isWin == false) {
            if(this.currentPlayer == CELL_X) {
                this.currentPlayer = CELL_O;
            } else this.currentPlayer = CELL_X;
        }
    }
}

class Display {
    constructor(mainMenuID, bottomGameBoardID) {
        this.mainMenu = document.getElementById(mainMenuID);
        this.bottomGameBoard = document.getElementById(bottomGameBoardID);
        this.isPlaying = true;
        this.game;
        this.player1Score = 0;
        this.player2Score = 0;
    }
    setGame(game) {
        this.game = game;
        return this.game;
    }
    getPlayerName() {
        this.player1 = document.getElementById("player1").value;
        this.player2 = document.getElementById("player2").value;
        if (this.player1 == "") {
            this.player1 ="PLAYER 1";
        }
        if (this.player2 == "") {
            this.player2 ="PLAYER 2";
        }
    }
    renderPlayerName() {
        if(this.game.currentPlayer == CELL_X) {
            return `Lượt chơi của ${this.player1}<br> ${PLAYER_X_BIGGER}`
        } else return `Lượt chơi của ${this.player2}<br> ${PLAYER_O_BIGGER}`
    }
    renderMainMenu() {
        this.mainMenu.removeAttribute("class");
        this.mainMenu.innerHTML =   
               `<h1>CARO GAME</h1>
                ${PLAYER_X_BIGGER}<input type="text" id="player1" placeholder="Nhập tên"><br>
                ${PLAYER_O_BIGGER}<input type="text" id="player2" placeholder="Nhập tên"><br>
                <button id="btn-start" onclick="startGame()">BẮT ĐẦU CHƠI</button>`;
        document.getElementById(this.game.divID).innerHTML = "";
        document.getElementById(this.game.divID).removeAttribute("style");
        this.bottomGameBoard.setAttribute("style","position: relative; top: 200px");
        this.bottomGameBoard.innerHTML =   
              `@minhtaama`;
    }
    renderInGameDisplay() {
        this.setPlayerScore();
        this.mainMenu.setAttribute("class","fixed");
        this.mainMenu.innerHTML =  
               `<div>
                <button id="btn-restart" onclick="restartRound()" style="">CHƠI LẠI</button><br>
                <button id="btn-mainMenu" onclick="mainMenu()" style="">END</button>
                </div>
                <p id="point">${PLAYER_X} : ${this.player1Score}<br>${PLAYER_O} : ${this.player2Score}</p>
                <p id="curr-player"></p>`;
        document.getElementById("curr-player").innerHTML = this.renderPlayerName();
    }
    setPlayerScore(){
        if(this.game.isWin == true) {
            if(this.game.currentPlayer == CELL_X) {
                this.player1Score++;
            } else this.player2Score++;
        }
    }
}


let display = new Display("main-menu","bottom-game-board");
let caroGame = display.setGame(new CaroGameBoard(15,20,"game-board"));

display.renderMainMenu();

function startGame() {
    caroGame = display.setGame(new CaroGameBoard(15,20,"game-board"));
    caroGame.drawBoard();
    display.getPlayerName();
    display.player1Score = 0;
    display.player2Score = 0;
    display.renderInGameDisplay();
    console.log(caroGame.array);
}

function cellClick(x,y){
    caroGame.play(x,y);
    display.renderInGameDisplay();
}

function restartRound() {
    caroGame = display.setGame(new CaroGameBoard(15,20,"game-board"));
    caroGame.drawBoard();
    display.renderInGameDisplay();
}

function mainMenu(){
    if(confirm("Bạn có muốn kết thúc trận đấu?")){
        display.renderMainMenu();
    }
}