import { XiangqiGame, Piece } from './logic.js';

export class XiangqiUI {
  constructor(container) {
    this.container = container;
    this.game = new XiangqiGame();
    this.selectedSquare = null;
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="xiangqi-game">
        <div class="status-bar">
          <span id="turn-indicator">Turn: Red</span>
          <div class="controls">
            <button id="return-btn" class="btn">Menu</button>
            <button id="undo-btn" class="btn">Reverse</button>
            <button id="save-btn" class="btn">Save</button>
            <button id="load-btn" class="btn">Load</button>
            <button id="reset-btn" class="btn">Reset</button>
          </div>
        </div>
        <div class="xiangqi-board" id="xiangqi-board"></div>
        <input type="file" id="file-input" accept=".json" style="display: none;">
      </div>
    `;

    this.boardEl = this.container.querySelector('#xiangqi-board');
    this.turnEl = this.container.querySelector('#turn-indicator');
    this.fileInput = this.container.querySelector('#file-input');
    
    this.container.querySelector('#return-btn').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('game-return'));
    });

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
      this.game = new XiangqiGame();
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
    a.download = `jeung6kei2_${timestamp}.json`;
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

  getPieceChar(piece) {
    if (!piece) return '';
    // Minimalist / Traditional Chars
    const map = {
      [Piece.RED]: {
        [Piece.GENERAL]: '帥', [Piece.ADVISOR]: '仕', [Piece.ELEPHANT]: '相',
        [Piece.HORSE]: '傌', [Piece.CHARIOT]: '俥', [Piece.CANNON]: '炮', [Piece.SOLDIER]: '兵'
      },
      [Piece.BLACK]: {
        [Piece.GENERAL]: '將', [Piece.ADVISOR]: '士', [Piece.ELEPHANT]: '象',
        [Piece.HORSE]: '馬', [Piece.CHARIOT]: '車', [Piece.CANNON]: '砲', [Piece.SOLDIER]: '卒'
      }
    };
    return map[piece.color][piece.type];
  }

  render() {
    this.boardEl.innerHTML = '';
    this.turnEl.textContent = `Turn: ${this.game.turn === Piece.RED ? 'Red' : 'Black'}`;
    
    // 10 Rows x 9 Cols
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = document.createElement('div');
        cell.className = 'xq-cell';
        cell.dataset.row = row;
        cell.dataset.col = col;

        // Grid Drawing (CSS logic handles lines)
        
        const piece = this.game.getPiece(row, col);
        if (piece) {
          const el = document.createElement('div');
          el.className = `xq-piece ${piece.color === Piece.RED ? 'red' : 'black'}`;
          el.textContent = this.getPieceChar(piece);
          cell.appendChild(el);
        }

        if (this.selectedSquare && 
            this.selectedSquare.row === row && 
            this.selectedSquare.col === col) {
          cell.classList.add('selected');
        }

        cell.addEventListener('click', () => this.handleClick(row, col));
        this.boardEl.appendChild(cell);
      }
    }
  }

  handleClick(row, col) {
    if (this.game.winner) return;

    if (this.selectedSquare) {
      const success = this.game.move(this.selectedSquare.row, this.selectedSquare.col, row, col);
      if (success) {
        this.selectedSquare = null;
        this.render();
        return;
      }
    }

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
