const gameBoard = (() => {
    let binge = document.querySelectorAll('div > div > div');

    let board = [0,1,2,3,4,5,6,7,8];

    //counting the amount of X & O and changing the turns
    let clickFunction = function (e) {
        let amountofX = 0;
        let amountofO = 0;

        for (let i = 0; i < board.length; i++) {
            if(board[i] === 'X') amountofX++;
            else if(board[i] ==='O') amountofO++;
        }
        if(amountofX > amountofO){
            e.target.textContent = 'O';//Update the textContent
            board[e.target.id - 1] = 'O'; //to specify which square has been selected
            amountofO++;
        }
        else{
            e.target.textContent = 'X';//Update the textContent
            board[e.target.id - 1] = 'X';//to specify which square has been selected
            amountofX++;
            if(player2.name ==='Dumb-AI') {
                gameFlow.computerMove();
            }
            else if(player2.name === 'Smart-AI') {
                if((amountofX + amountofO) <=8) {
                    let aiIndex = aiPlay ();
                    document.getElementById(`${aiIndex + 1}`).textContent = 'O';
                    document.getElementById(`${aiIndex + 1}`).removeEventListener('click', gameBoard.clickFunction);
                    gameBoard.board[aiIndex] = 'O';
                }
            }
        }
        if(amountofX === 5 && amountofO === 4){
            gameFlow.checkWin('end');
        }
        else{
            gameFlow.checkWin();
        }
    }

    function initializeGame() {
        for (let i = 0; i < binge.length; i++) {
            binge[i].addEventListener('click', clickFunction,{once: true});
        }
    };


    const startGame = () => {
        document.querySelector('form').addEventListener('submit', e => {
            gameFlow.setPlayers();
            e.preventDefault()
        })
    }

    return {
        board, clickFunction, initializeGame, startGame
    }
})();

gameBoard.startGame();


const player = (name) => {
    let score = 0;
    return {
        name, score
    }
}

let player1;
let player2;
 

const gameFlow = (() => {
    let binge = document.querySelectorAll('div > div > div');


    //
    let checkWin = function (arg) {
        let playerMark = 'X';
        let possibleWinningCombs = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [2,4,6],
            [0,4,8]
        ];

        let winningComb = possibleWinningCombs.find(c => {
            return gameBoard.board[c[0]] == playerMark && gameBoard.board[c[1]] == playerMark && gameBoard.board[c[2]] == playerMark
        });

        if(winningComb) {
            winningComb.forEach(e => {
                let y2 = document.getElementById(`${e + 1}`);
                y2.style.backgroundColor = 'grey';
            })

            for (let i = 0; i< binge.length; i++) {
                binge[i].removeEventListener('click', gameBoard.clickFunction);
            }
            ++player1.score;


            // setting the scoreBoard
            let scoreOverview = document.getElementById('score-overview');
            scoreOverview.innerHTML = `Current score : ${player1.score} : ${player2.score}`;


            let newGame = document.querySelector('.newGame');
            newGame.style.display = 'block';
            alert(`${player1.name} won this round`);
        }

        let computerMark = 'O';

        let winningCombO = possibleWinningCombs.find(c => {
            return gameBoard.board[c[0]] == computerMark && gameBoard.board[c[1]] == computerMark && gameBoard.board[c[2]] == computerMark
        });

        if(winningCombO) {
            winningCombO.forEach(e => {
                let y2 = document.getElementById(`${e+1}`);
                y2.style.backgroundColor = 'grey';
            });

            for(let i = 0; i < binge,length; i++) {
                binge[i].removeEventListener('click', gameBoard.clickFunction); 
            }
            
            ++player2.score;

            let scoreOverview = document.getElementById('score-overview');
            scoreOverview.innerHTML = `current score: ${player1.score} : ${player2.score}`;
            
            let newGame = document.querySelector('.newGame');
            newGame.style.display = 'block';
            alert(`${player2.name} won this round`);
        }

        else if ( winningComb === undefined && arg ==='end') {
            let newGame = document.querySelector('.newGame');
            newGame.style.display = 'block';
            alert('It\'s a tie');
        }
    }

    let newGame = function () {
        for (let g = 0; g < gameBoard.board.length; g++) {
            gameBoard.board[g] = g;
            document.getElementById(`${g+1}`).textContent='';
            document.getElementById(`${g+1}`).style.backgroundColor = 'mediumturquoise';
        }

        gameBoard.initializeGame();
        let x =document.querySelector('.newGame');
        x.style.display = 'none';
    }

    //Select to play with your friend or with the PC & select the diffculty
    function setPlayers () {
        player1 = player(document.getElementById('player1').value);
        player2 = player(document.getElementById('player2').value);
        gameBoard.initializeGame();
        let x = document.querySelector('.players');
        let y = document.querySelector('.startGame');
        let y2 = document.getElementById('playertype');
        document.getElementById('scoreboard').style.display = 'none';
        y2.style.display = 'none';
        y.style.display = 'none';
        x.style.display = 'none';

        document.getElementById('score').style.display = 'flex';

        let z = document.getElementById('player1-name');
        z.style.display='block';
        z.innerHTML = `P1: ${player1.name}`;

        let z2 = document.getElementById('player2-name');
        z2.style.display='block';
        z2.innerHTML = `P2: ${player2.name}`;

        let z3 = document.getElementById('score-overview');
        z3.style.display='block';
        z3.innerHTML = `Current Score: ${player1.score} : ${player2.score}`;
    }

    function computerMove() {
        let freeSpaces = 0;
        for(let g = 0; g <gameBoard.board.length; g++) {
            if(gameBoard.board[g] !== 'O' && gameBoard.board[g] !== 'X') freeSpaces++;
        }

        let atFreeSpaces = 0;
        let newMove = Math.ceil(Math.random() * freeSpaces);

        for(let e = 0; e < gameBoard.board.length; e++) {
            if(gameBoard.board[e] !== 'O' && gameBoard.board[e] !== 'X') atFreeSpaces++;
            if(atFreeSpaces === newMove) {
                document.getElementById(`${e+1}`).textContent = 'O';
                gameBoard.board[e] = 'O';
                document.getElementById(`${e+1}`).removeEventListener('click', gameBoard.clickFunction);
                return;
            }
        }
    }

    const startGame = () => { 
        document.querySelector('form').addEventListener('submit', e => {
            gameFlow.setPlayers();
            e.preventDefault();
            document.querySelector('.grid-container').style.display = 'flex';
            document.querySelector('.reset').style.display = 'block';
        })

    };
    startGame();


    let playMode = () => {
        let single = document.querySelector('.single');
        let multi = document.querySelector('.multi');
        let mode = document.querySelector('.play-mode');

        mode.addEventListener('click', e => {
            if(e.target.className == 'single') {
                document.querySelector('#playertype').style.display = 'flex';
                document.querySelector('.play-mode').style.display = 'none';
            } else{
                document.querySelector('form').style.display = 'block';
                document.querySelector('.play-mode').style.display = 'none';
            }
        })
    }


    //Select to play computer Easy or Impossible
    let playComp = () => {
        document.querySelector('#playertype').addEventListener('click', e => {
            if(e.target.id == 'pvc-easy') {
                document.querySelector('form').style.display = 'block';
                document.querySelector('.player2').style.display = 'none';
                document.getElementById('playertype').style.display = 'none';
                document.getElementById('player2').value = 'Dumb-AI';
            } else {
                document.querySelector('form').style.display = 'block';
                document.querySelector('.player2').style.display = 'none';
                document.getElementById('playertype').style.display = 'none';
                document.getElementById('player2').value = 'Smart-AI';
            }
        })
    }

    playMode();
    playComp();

    return{
        checkWin, newGame, setPlayers, computerMove
    }
})();


function aiPlay() {
    let origBoard = ['O', 1, 'X', 'X', 4, 'X', 6, 'O', 'O']
    let aiPlayer = 'O';
    let huPlayer = 'X';

    function winning(board, player) {
        if(
            (board[0] == player && board[1] == player && board[2] == player) ||
            (board[3] == player && board[4] == player && board[5] == player) ||
            (board[6] == player && board[7] == player && board[8] == player) ||
            (board[0] == player && board[3] == player && board[6] == player) ||
            (board[1] == player && board[4] == player && board[7] == player) ||
            (board[2] == player && board[5] == player && board[8] == player) ||
            (board[0] == player && board[4] == player && board[8] == player) ||
            (board[2] == player && board[4] == player && board[6] == player)
        ) {
            return true;
        } else {
            return false;
        }
    }

    // returns the available free spots
    function emptyIndexes(board) {
        return board.filter(s => s != 'O' && s != 'X');
    }

    var fc = 0;

    //selecting the best move for the computer using minimax method
    var bestSpot = minimax(gameBoard.board, aiPlayer);

    function minimax(newBoard, player) {

        fc++;

        var availSpots = emptyIndexes(newBoard);

        if(winning(newBoard, huPlayer)) {
            return{score: -10};
        }
        else if(winning(newBoard, aiPlayer)) {
            return{score: 10};
        }
        else if(availSpots.length === 0) {
            return{score: 0};
        }
        // array to collect all objects
        var moves = [];

        //loo through available Spots
        for(var i=0; i < availSpots.length; i++) {

            var move = {};
            move.index = newBoard[availSpots[i]];

            newBoard[availSpots[i]] = player;


            if(player == aiPlayer) {
                var result = minimax(newBoard, huPlayer);
                move.score = result.score;
            }
            else{
                var result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }
            newBoard[availSpots[i]] = move.index;
            moves.push(move);
        }

        var bestMove;
        if(player === aiPlayer) {
            var bestScore = -Infinity;
            for(var i = 0; i < moves.length; i++) {
                if(moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else{
            var bestScore = Infinity;
            for(var i = 0; i < moves.length; i++) {
                if(moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }
    return bestSpot.index;
};



