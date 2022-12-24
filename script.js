const gameboard = (() => {
    const arr = new Array(9);
    return { arr };
})();

const displayController = (() => {
    const push = (index, name, symbol) => {
        gameboard.arr[index] = { name, symbol };
    };
    return { push };
})();

function Player(name, symbol) {
    return { name, symbol };
}

const player1 = Player('Nabil', 'X');
const player2 = Player('Kevin', 'O');

console.table(gameboard.arr);

const player1H1 = document.querySelector('#player1 h1');
const player2H1 = document.querySelector('#player2 h1');
const player1Display = document.querySelector('#player1 div');
const player2Display = document.querySelector('#player2 div');
player1H1.setAttribute('data-symbol', player1.symbol);
player2H1.setAttribute('data-symbol', player2.symbol);
player1Display.textContent = player1.name;
player2Display.textContent = player2.name;

player1H1.style.backgroundColor = 'blue';

const gameboardCells = document.querySelectorAll('#gameboard div');

gameboardCells.forEach((cell) => {
    cell.addEventListener('click', () => {
        if (cell.textContent !== '') {
            cell.disabled = 'true';
            cell.style.cursor = 'not-allowed';
        } else if (player1H1.style.backgroundColor === 'blue') {
            cell.textContent = player1H1.getAttribute('data-symbol');
            displayController.push(
                Number(cell.getAttribute('data-index')),
                player1Display.textContent,
                cell.textContent
            );
            player1H1.style.backgroundColor = '';
            player2H1.style.backgroundColor = 'blue';

            console.table(gameboard.arr);
        } else if (player2H1.style.backgroundColor === 'blue') {
            cell.textContent = player2H1.getAttribute('data-symbol');
            displayController.push(
                Number(cell.getAttribute('data-index')),
                player2Display.textContent,
                cell.textContent
            );
            player2H1.style.backgroundColor = '';
            player1H1.style.backgroundColor = 'blue';
            console.table(gameboard.arr);
        }
    });
});
