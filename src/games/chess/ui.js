import { ChessGame } from './logic.js';

export class ChessUI {
  constructor(container) {
    this.container = container;
    this.game = new ChessGame();
    this.selectedSquare = null;
    
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="chess-game">
        <div class="status-bar">
          <span id="turn-indicator">Turn: White</span>
          <div class="controls">
            <button id="undo-btn" class="btn">Reverse</button>
            <button id="reset-btn" class="btn">Reset</button>
          </div>
        </div>
        <div class="chess-board" id="chess-board"></div>
      </div>
    `;

    this.boardEl = this.container.querySelector('#chess-board');
    this.turnEl = this.container.querySelector('#turn-indicator');
    
    this.container.querySelector('#undo-btn').addEventListener('click', () => {
      if (this.game.undo()) {
        this.selectedSquare = null;
        this.render();
      }
    });

    this.container.querySelector('#reset-btn').addEventListener('click', () => {
      this.game = new ChessGame();
      this.selectedSquare = null;
      this.render();
    });

    this.render();
  }

  getPieceSymbol(piece) {
    if (!piece) return '';
    const symbols = {
      w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
      b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
    };
    return symbols[piece.color][piece.type];
  }

  render() {
    this.boardEl.innerHTML = '';
    this.turnEl.textContent = `Turn: ${this.game.turn === 'w' ? 'White' : 'Black'}`;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
        square.dataset.row = row;
        square.dataset.col = col;

        const piece = this.game.getPiece(row, col);
        if (piece) {
          const span = document.createElement('span');
          span.className = `piece ${piece.color}`;
          span.textContent = this.getPieceSymbol(piece);
          square.appendChild(span);
        }

        if (this.selectedSquare && 
            this.selectedSquare.row === row && 
            this.selectedSquare.col === col) {
          square.classList.add('selected');
        }

        // Highlight valid moves for selected piece (optional)
        // if (this.selectedSquare && this.game.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
        //   square.classList.add('valid-move');
        // }

        square.addEventListener('click', () => this.handleSquareClick(row, col));
        this.boardEl.appendChild(square);
      }
    }
  }

  handleSquareClick(row, col) {
    // If piece selected, try to move
    if (this.selectedSquare) {
      const success = this.game.move(
        this.selectedSquare.row, 
        this.selectedSquare.col, 
        row, 
        col
      );
      
      if (success) {
        this.selectedSquare = null;
        this.render();
        return;
      }
    }

    // Select piece
    const piece = this.game.getPiece(row, col);
    if (piece && piece.color === this.game.turn) {
      this.selectedSquare = { row, col };
      this.render();
    } else {
      this.selectedSquare = null;
      this.render();
    }
  }
}
