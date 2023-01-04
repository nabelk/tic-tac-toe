// Player factory function

function Player(name, symbol) {
    return { name, symbol };
}
const player1 = Player('', 'X');
const player2 = Player('', 'O');

// Gameboard module

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
                condition.forEach((index) => {
                    document.querySelector(
                        `[data-index="${index}"]`
                    ).style.backgroundColor = 'chartreuse';
                }); // Give a winning condition elements change of bg color
                return a; // Return winner symbol
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

// Display controller module

const displayController = (() => {
    // Add symbol to the board from event click

    const addToBoard = (index, symbol) => {
        gameboard.board[index] = symbol;
    };

    const elementTransition = (element, time) => {
        element.classList.remove('hidden');
        setTimeout(() => {
            element.classList.remove('visuallyhidden');
        }, time);
    };

    const soundEffect = (classchoice, volume) => {
        const audio = document.querySelector(classchoice);
        if (!audio) return;
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play();
    };

    // Result display & restart/new game btn

    const modalResult = (content) => {
        soundEffect('.result-sound', 0.2);
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
            soundEffect('.start-sound', 0.4);
            modalDiv.className = 'modal-result hidden visuallyhidden';
            gameboard.board = ['', '', '', '', '', '', '', '', ''];
            player1H1.className = 'highlight-turn';
            player2H1.className = '';
            const gameboardCells = document.querySelectorAll('#gameboard div');
            gameboardCells.forEach((cell) => {
                cell.textContent = '';
                cell.style.cursor = '';
                cell.style.backgroundColor = '';
            });
        });
        newBtn.addEventListener('click', () => {
            window.location.reload();
        });
    };

    // Set 2 players mode

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
                    soundEffect('.take-turn', 1);
                    cell.className = 'player1-color';
                    cell.textContent = player1.symbol;
                    addToBoard(
                        Number(cell.getAttribute('data-index')),
                        player1.symbol
                    );
                    player1H1.className = '';
                    player2H1.className = 'highlight-turn';
                } else if (player2H1.classList.contains('highlight-turn')) {
                    soundEffect('.take-turn', 1);
                    cell.className = 'player2-color';
                    cell.textContent = player2.symbol;
                    addToBoard(
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

    // Get a computer value for its turn

    const computerMove = () => {
        const randomIndex = Math.floor(Math.random() * gameboard.board.length);
        if (gameboard.board[randomIndex] !== '') {
            computerMove();
        } else {
            const divCell = document.querySelector(
                `[data-index="${randomIndex}"]`
            );
            divCell.className = 'player2-color';
            divCell.textContent = player2.symbol;
            addToBoard(randomIndex, player2.symbol);
        }
    };

    // Set vs computer mode

    const setVsAI = () => {
        const gameboardCells = document.querySelectorAll('#gameboard div');
        const player1H1 = document.querySelector('#player1 h1');
        const player2H1 = document.querySelector('#player2 h1');
        player2H1.textContent = 'AI';
        player1H1.className = 'highlight-turn';

        gameboardCells.forEach((cell) => {
            elementTransition(cell, 10);
            cell.addEventListener('click', () => {
                if (cell.textContent !== '') {
                    cell.disabled = 'true';
                    cell.style.cursor = 'not-allowed';
                } else if (player1H1.classList.contains('highlight-turn')) {
                    soundEffect('.take-turn', 1);
                    cell.className = 'player1-color';
                    cell.textContent = player1.symbol;
                    addToBoard(
                        Number(cell.getAttribute('data-index')),
                        player1.symbol
                    );
                    player1H1.className = '';
                    player2H1.className = 'highlight-turn';

                    if (gameboard.checkWinner() === 'X') {
                        modalResult(`PLAYER 1 WON!`);
                    } else if (gameboard.checkTie()) {
                        modalResult("IT'S A TIE!");
                    } else if (!gameboard.checkTie()) {
                        setTimeout(() => {
                            soundEffect('.take-turn', 1);
                            computerMove();
                            if (gameboard.checkWinner() === 'O') {
                                modalResult(`COMPUTER WON!`);
                            } else {
                                player1H1.className = 'highlight-turn';
                                player2H1.className = '';
                            }
                        }, 800);
                    }
                }
            });
        });
    };

    // Get value from form

    const getForm = () => {
        const form = document.querySelector('form');
        form.addEventListener('submit', (event) => {
            soundEffect('.start-sound', 0.4);
            event.preventDefault();
            const startGame = document.querySelector('.start-game');
            const main = document.querySelector('main');
            startGame.style.display = 'none';
            elementTransition(main, 10);
            player1.name = event.target.player1form.value;
            player2.name = event.target.player2form.value;
            form.reset();
            setGame();
        });
    };

    const buttonMenu = () => {
        const menu = document.querySelector('#menu');
        const startGame = document.querySelector('.start-game');
        const humanMode = document.querySelector('.human-mode');
        const aiMode = document.querySelector('.ai-mode');
        humanMode.addEventListener('click', () => {
            soundEffect('.start-sound', 0.4);
            menu.style.display = 'none';
            elementTransition(startGame, 10);
            getForm();
        });
        aiMode.addEventListener('click', () => {
            soundEffect('.start-sound', 0.4);
            const main = document.querySelector('main');
            elementTransition(main, 10);
            menu.style.display = 'none';
            setVsAI();
        });
    };

    return {
        addToBoard,
        elementTransition,
        soundEffect,
        modalResult,
        setGame,
        computerMove,
        setVsAI,
        getForm,
        buttonMenu,
    };
})();

displayController.buttonMenu();
