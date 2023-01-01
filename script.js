function Player(name, symbol) {
    return { name, symbol };
}
const player1 = Player('', 'X');
const player2 = Player('', 'O');

const gameboard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [0, 4, 8],
    ];

    const checkWinner = () => {
        for (let i = 0; i < winConditions.length; i++) {
            const condition = winConditions[i];
            const a = gameboard.board[condition[0]];
            const b = gameboard.board[condition[1]];
            const c = gameboard.board[condition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }

            if (a === b && b === c) {
                return a;
                break;
            }
        }
    };

    const checkTie = () => {
        const arr = ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'];
        return gameboard.board.every((element) => arr.includes(element));
    };
    return { board, winConditions, checkWinner, checkTie };
})();

const displayController = (() => {
    const addToBoard = (index, symbol) => {
        gameboard.board[index] = symbol;
    };

    const elementTransition = (element, time) => {
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.remove('visuallyhidden');
        }, time);
    };

    const modalResult = (content) => {
        const modalDiv = document.querySelector('.modal-result');
        const resultDiv = document.querySelector('.winner');
        const restartBtn = document.querySelector('.restart-game');
        const newBtn = document.querySelector('.new-game');
        const player1H1 = document.querySelector('#player1 h1');
        const player2H1 = document.querySelector('#player2 h1');
        elementTransition(modalDiv, 10);
        player1H1.className = '';
        player2H1.className = '';
        resultDiv.textContent = content;
        restartBtn.addEventListener('click', () => {
            modalDiv.className = 'modal-result hidden visuallyhidden';
            gameboard.board = ['', '', '', '', '', '', '', '', ''];
            player1H1.className = 'highlight-turn';
            player2H1.className = '';
            const gameboardCells = document.querySelectorAll('#gameboard div');
            gameboardCells.forEach((cell) => {
                cell.textContent = '';
                cell.style.cursor = '';
            });
        });
        newBtn.addEventListener('click', () => {
            window.location.reload();
        });
    };

    const setGame = () => {
        const player1H1 = document.querySelector('#player1 h1');
        const player2H1 = document.querySelector('#player2 h1');
        const player1Display = document.querySelector('#player1 div');
        const player2Display = document.querySelector('#player2 div');
        player1Display.textContent = player1.name.toUpperCase();
        player2Display.textContent = player2.name.toUpperCase();
        player1H1.className = 'highlight-turn';
        const gameboardCells = document.querySelectorAll('#gameboard div');

        gameboardCells.forEach((cell) => {
            elementTransition(cell, 10);
            cell.addEventListener('click', () => {
                if (cell.textContent !== '') {
                    cell.disabled = 'true';
                    cell.style.cursor = 'not-allowed';
                } else if (player1H1.classList.contains('highlight-turn')) {
                    cell.className = 'player1-color';
                    cell.textContent = player1.symbol;
                    displayController.addToBoard(
                        Number(cell.getAttribute('data-index')),
                        player1.symbol
                    );
                    player1H1.className = '';
                    player2H1.className = 'highlight-turn';
                } else if (player2H1.classList.contains('highlight-turn')) {
                    cell.className = 'player2-color';
                    cell.textContent = player2.symbol;
                    displayController.addToBoard(
                        Number(cell.getAttribute('data-index')),
                        player2.symbol
                    );
                    player2H1.className = '';
                    player1H1.className = 'highlight-turn';
                }

                if (gameboard.checkWinner() === 'X') {
                    modalResult(`${player1.name.toUpperCase()} WON!`);
                } else if (gameboard.checkWinner() === 'O') {
                    modalResult(`${player2.name.toUpperCase()} WON!`);
                } else if (gameboard.checkTie()) {
                    modalResult("IT'S A TIE!");
                }
            });
        });
    };

    const getForm = () => {
        const form = document.querySelector('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const startGame = document.querySelector('#start-game');
            const main = document.querySelector('main');
            startGame.style.display = 'none';
            elementTransition(main, 10);
            player1.name = event.target.player1form.value;
            player2.name = event.target.player2form.value;
            form.reset();
            setGame();
        });
    };

    return { addToBoard, elementTransition, modalResult, setGame, getForm };
})();

displayController.getForm();
