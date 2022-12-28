function Player(name, symbol) {
    return { name, symbol };
}
const player1 = Player('Nabil', 'X');
const player2 = Player('Kevin', 'O');

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
            const a = board[condition[0]];
            const b = board[condition[1]];
            const c = board[condition[2]];

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

    const setPlayer = () => {
        const player1H1 = document.querySelector('#player1 h1');
        const player2H1 = document.querySelector('#player2 h1');
        const player1Display = document.querySelector('#player1 div');
        const player2Display = document.querySelector('#player2 div');
        player1Display.textContent = player1.name;
        player2Display.textContent = player2.name;
        player1H1.style.color = 'blue';
        const gameboardCells = document.querySelectorAll('#gameboard div');

        gameboardCells.forEach((cell) => {
            cell.addEventListener('click', () => {
                if (cell.textContent !== '') {
                    cell.disabled = 'true';
                    cell.style.cursor = 'not-allowed';
                } else if (player1H1.style.color === 'blue') {
                    cell.textContent = player1.symbol;
                    displayController.addToBoard(
                        Number(cell.getAttribute('data-index')),
                        player1.symbol
                    );
                    player1H1.style.color = '';
                    player2H1.style.color = 'blue';
                    console.table(gameboard.board);

                    if (gameboard.checkWinner() === player1.symbol) {
                        console.log(`${player1.name} Won`);
                    }
                } else if (player2H1.style.color === 'blue') {
                    cell.textContent = player2.symbol;
                    displayController.addToBoard(
                        Number(cell.getAttribute('data-index')),
                        player2.symbol
                    );
                    player2H1.style.color = '';
                    player1H1.style.color = 'blue';
                    console.table(gameboard.board);

                    if (gameboard.checkWinner() === player2.symbol) {
                        console.log(`${player2.name} Won`);
                    }
                }
                if (gameboard.checkTie()) {
                    console.log('game is Tie');
                }
            });
        });
    };

    return { addToBoard, setPlayer };
})();

displayController.setPlayer();
