// Purpose: Main JavaScript file for the chess game

// all constants and variables
const gameBoard = document.querySelector("#gameboard");
const playerDetails = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const err = document.querySelector("#err");

let playerTurn = 'white';
playerDetails.textContent = playerTurn;

// create board layout
const startPieces = [
    'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook',
    'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn',
    'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'
];

// Create a mapping of piece names to their corresponding SVGs
const pieceMap = {
    'king': king,
    'queen': queen,
    'rook': rook,
    'bishop': bishop,
    'knight': knight,
    'pawn': pawn
};

function createBoard() {
    const rows = 8;
    const cols = 8;
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const square = document.createElement("div");
            square.classList.add("square");
            square.setAttribute("square-id", `${columns[j]}${rows - i}`);
            square.setAttribute("row-id", i);
            square.setAttribute("col-id", j);

            const isEvenSquare = (i + j) % 2 === 0;
            square.classList.add(isEvenSquare ? "beige" : "brown");

            // Calculate the correct piece index
            const pieceIndex = i * cols + j;
            const pieceName = startPieces[pieceIndex];
            if (pieceName) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece");
                pieceElement.id = pieceName;
                pieceElement.innerHTML = pieceMap[pieceName];
                pieceElement.setAttribute("draggable", true);

                // Add class for black or white pieces based on the row position
                if (pieceIndex < 16) {
                    pieceElement.querySelector('svg').classList.add('black');  // Top rows
                } else if (pieceIndex >= 48) {
                    pieceElement.querySelector('svg').classList.add('white');  // Bottom rows
                }

                // Attach drag and drop event listeners
                pieceElement.addEventListener('dragstart', dragStart);
                pieceElement.addEventListener('dragend', dragEnd);
                square.appendChild(pieceElement);
            }

            square.addEventListener('dragover', dragOver);
            square.addEventListener('drop', dragDrop);

            gameBoard.appendChild(square);
        }
    }
}

function dragStart(e) {
    draggedPiece = e.target;
    console.log(draggedPiece.id, draggedPiece.parentElement.getAttribute('square-id'),);
    setTimeout(() => draggedPiece.classList.add('hidden'), 0);
}

function dragEnd(e) {
    if (draggedPiece !== null) {
        setTimeout(() => {
            draggedPiece.classList.remove('hidden');
            draggedPiece = null; // Reset the draggedPiece variable
        }, 0);
    }
}

function dragOver(e) {
    e.preventDefault(); // Necessary to allow a drop
}

function dragDrop(e) {
    e.preventDefault();
    if (draggedPiece && e.target.classList.contains('square')) {
        const targetSquare = e.target;
        const piece = draggedPiece.id;
        const startId = draggedPiece.parentNode.getAttribute('square-id');
        const targetId = targetSquare.getAttribute('square-id');

        if (isCorrectTurn(draggedPiece) && isMoveValid(piece, startId, targetId)) {
            const opponentPiece = targetSquare.querySelector('.piece');
            if (opponentPiece && !opponentPiece.classList.contains(playerTurn)) {
                targetSquare.removeChild(opponentPiece); // Capture the opponent's piece
            }

            targetSquare.appendChild(draggedPiece);
            changePlayer();
        } else {
            console.error('Invalid move');
        }
    }
}


function changePlayer() {
    playerTurn = playerTurn === 'white' ? 'black' : 'white';
    playerDetails.textContent = playerTurn;
}

function isCorrectTurn(piece) {
    return piece.classList.contains(playerTurn);
}

function isMoveValid(piece, startId, targetId) {
    switch (piece) {
        case 'pawn':
            return isValidPawnMove(startId, targetId);
        case 'rook':
            return isValidRookMove(startId, targetId);
        case 'knight':
            return isValidKnightMove(startId, targetId);
        case 'bishop':
            return isValidBishopMove(startId, targetId);
        case 'queen':
            return isValidQueenMove(startId, targetId);
        case 'king':
            return isValidKingMove(startId, targetId);
        default:
            return false;
    }
}

// pawn move validation
function isValidPawnMove(startId, targetId) {
    const startRow = parseInt(startId[1]);
    const startCol = startId.charCodeAt(0) - 65;
    const targetRow = parseInt(targetId[1]);
    const targetCol = targetId.charCodeAt(0) - 65;

    const diffRow = playerTurn === 'white' ? targetRow - startRow : startRow - targetRow;
    const diffCol = Math.abs(targetCol - startCol);

    if (diffRow === 1 && diffCol === 0) {
        return true;
    }

    return false;
}

// Initialize the game
createBoard();
