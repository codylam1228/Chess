import { LOAGame } from './logic.js';

export class LOAUI {
  constructor(container) {
    this.container = container;
    this.game = new LOAGame();
    this.selectedSquare = null;
    
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="loa-game">
        <div class="status-bar">
          <span id="turn-indicator">Turn: Black</span>
          <div class="controls">
             <button id="undo-btn" class="btn">Reverse</button>
             <button id="save-btn" class="btn">Save</button>
             <button id="load-btn" class="btn">Load</button>
             <button id="reset-btn" class="btn">Reset</button>
          </div>
        </div>
        <div class="loa-board" id="loa-board"></div>
        <input type="file" id="file-input" accept=".json" style="display: none;">
      </div>
    `;

    this.boardEl = this.container.querySelector('#loa-board');
    this.turnEl = this.container.querySelector('#turn-indicator');
    this.fileInput = this.container.querySelector('#file-input');
    
    this.container.querySelector('#undo-btn').addEventListener('click', () => {
      if (this.game.undo()) {
        this.selectedSquare = null;
        this.render();
      }
    });

    this.container.querySelector('#save-btn').addEventListener('click', () => this.handleSave());
    this.container.querySelector('#load-btn').addEventListener('click', () => this.fileInput.click());
    
    this.fileInput.addEventListener('change', (e) => this.handleLoad(e));

    this.container.querySelector('#reset-btn').addEventListener('click', () => {
      this.game = new LOAGame();
      this.selectedSquare = null;
      this.render();
    });

    this.render();
  }

  handleSave() {
    const json = this.game.exportState();
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.download = `LOA_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  handleLoad(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (this.game.importState(content)) {
        this.selectedSquare = null;
        this.render();
        alert('Game Loaded Successfully');
      } else {
        alert('Failed to load game file');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  }

  render() {
    this.boardEl.innerHTML = '';
    
    if (this.game.winner) {
      this.turnEl.textContent = `Winner: ${this.game.winner === 'b' ? 'Black' : 'White'}!`;
    } else {
      this.turnEl.textContent = `Turn: ${this.game.turn === 'b' ? 'Black' : 'White'}`;
    }

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = document.createElement('div');
        square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
        square.dataset.row = row;
        square.dataset.col = col;

        const piece = this.game.getPiece(row, col);
        if (piece) {
          const checker = document.createElement('div');
          checker.className = `checker ${piece.color}`;
          square.appendChild(checker);
        }

        if (this.selectedSquare && 
            this.selectedSquare.row === row && 
            this.selectedSquare.col === col) {
          square.classList.add('selected');
        }
        
        // Highlight valid moves (optional but helpful)
        if (this.selectedSquare && !this.game.winner) {
           if (this.game.isValidMove(this.selectedSquare.row, this.selectedSquare.col, row, col)) {
             square.classList.add('valid-move');
           }
        }

        square.addEventListener('click', () => this.handleSquareClick(row, col));
        this.boardEl.appendChild(square);
      }
    }
  }

  handleSquareClick(row, col) {
    if (this.game.winner) return;

    // Move attempt
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
