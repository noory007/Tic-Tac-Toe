const TicTacToe = (() => {
    const Gameboard = (() => {
        let board = Array(9).fill(null);

        const getBoard = () => board;

        const makeMove = (index, player) => {
            if (board[index] === null) {
                board[index] = player;
                return true;
            }
            return false;
        };

        const reset = () => {
            board = Array(9).fill(null);
        };

        return { getBoard, makeMove, reset };
    })();

    const Player = (name, marker) => {
        return { name, marker };
    };

    const GameController = (() => {
        let players = [];
        let currentPlayerIndex;
        let gameOver;

        const start = (player1Name, player2Name) => {
            players = [
                Player(player1Name, 'X'),
                Player(player2Name, 'O')
            ];
            currentPlayerIndex = 0;
            gameOver = false;
            Gameboard.reset();
        };

        const getCurrentPlayer = () => players[currentPlayerIndex];

        const switchPlayer = () => {
            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        };

        const checkWin = () => {
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];

            return winPatterns.some(pattern => {
                const [a, b, c] = pattern;
                const board = Gameboard.getBoard();
                return board[a] && board[a] === board[b] && board[a] === board[c];
            });
        };

        const checkTie = () => {
            return Gameboard.getBoard().every(cell => cell !== null);
        };

        const playTurn = (index) => {
            if (gameOver) return false;

            if (Gameboard.makeMove(index, getCurrentPlayer().marker)) {
                if (checkWin()) {
                    gameOver = true;
                    return 'win';
                } else if (checkTie()) {
                    gameOver = true;
                    return 'tie';
                } else {
                    switchPlayer();
                    return 'continue';
                }
            }
            return false;
        };

        const isGameOver = () => gameOver;

        return { start, getCurrentPlayer, playTurn, isGameOver };
    })();

    const DisplayController = (() => {
        const boardElement = document.getElementById('game-board');
        const statusElement = document.getElementById('game-status');
        const player1Input = document.getElementById('player1');
        const player2Input = document.getElementById('player2');
        const startButton = document.getElementById('start-game');
        const restartButton = document.getElementById('restart-game');

        const renderBoard = () => {
            boardElement.innerHTML = '';
            Gameboard.getBoard().forEach((cell, index) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.textContent = cell || '';
                cellElement.addEventListener('click', () => makeMove(index));
                boardElement.appendChild(cellElement);
            });
        };

        const updateStatus = (message) => {
            statusElement.textContent = message;
        };

        const makeMove = (index) => {
            const result = GameController.playTurn(index);
            if (result === 'win') {
                updateStatus(`${GameController.getCurrentPlayer().name} wins!`);
                endGame();
            } else if (result === 'tie') {
                updateStatus("It's a tie!");
                endGame();
            } else if (result === 'continue') {
                updateStatus(`${GameController.getCurrentPlayer().name}'s turn`);
            }
            renderBoard();
        };

        const startGame = () => {
            const player1Name = player1Input.value || 'Player 1';
            const player2Name = player2Input.value || 'Player 2';
            GameController.start(player1Name, player2Name);
            renderBoard();
            updateStatus(`${GameController.getCurrentPlayer().name}'s turn`);
            startButton.style.display = 'none';
            restartButton.style.display = 'inline-block';
        };

        const endGame = () => {
            restartButton.style.display = 'inline-block';
        };

        const init = () => {
            startButton.addEventListener('click', startGame);
            restartButton.addEventListener('click', startGame);
        };

        return { init, renderBoard };
    })();

    return { DisplayController };
})();

document.addEventListener('DOMContentLoaded', TicTacToe.DisplayController.init);
