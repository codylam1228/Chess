import { PentagoGame, Player, Phase } from './logic.js';

export class PentagoUI {
  constructor(container) {
    this.container = container;
    this.game = new PentagoGame();
    this.init();
  }

  init() {
    this.container.innerHTML = `
      <div class="pentago-game">
        <div class="status-bar">
          <span id="turn-indicator">Turn: Red (Place)</span>
          <div class="controls">
            <button id="return-btn" class="btn">Menu</button>
            <button id="undo-btn" class="btn">Reverse</button>
            <button id="save-btn" class="btn">Save</button>
            <button id="load-btn" class="btn">Load</button>
            <button id="reset-btn" class="btn">Reset</button>
          </div>
        </div>
        <div class="pentago-board-container">
            <div class="pentago-board" id="pentago-board"></div>
            <div class="rotation-controls" id="rotation-controls">
                <!-- Quadrant Overlays -->
                <div class="quadrant-overlay q0" data-q="0">
                    <button class="rotate-btn ccw" title="Counter-Clockwise">↺</button>
                    <button class="rotate-btn cw" title="Clockwise">↻</button>
                </div>
                <div class="quadrant-overlay q1" data-q="1">
                    <button class="rotate-btn ccw">↺</button>
                    <button class="rotate-btn cw">↻</button>
                </div>
                <div class="quadrant-overlay q2" data-q="2">
                    <button class="rotate-btn ccw">↺</button>
                    <button class="rotate-btn cw">↻</button>
                </div>
                <div class="quadrant-overlay q3" data-q="3">
                    <button class="rotate-btn ccw">↺</button>
                    <button class="rotate-btn cw">↻</button>
                </div>
            </div>
        </div>
        <input type="file" id="file-input" accept=".json" style="display: none;">
      </div>
    `;

    this.boardEl = this.container.querySelector('#pentago-board');
    this.turnEl = this.container.querySelector('#turn-indicator');
    this.controlsEl = this.container.querySelector('#rotation-controls');
    this.fileInput = this.container.querySelector('#file-input');
    
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    this.container.querySelector('#return-btn').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('game-return'));
    });

    this.container.querySelector('#undo-btn').addEventListener('click', () => {
      if (this.game.undo()) this.render();
    });

    this.container.querySelector('#save-btn').addEventListener('click', () => this.handleSave());
    this.container.querySelector('#load-btn').addEventListener('click', () => this.fileInput.click());
    this.container.querySelector('#reset-btn').addEventListener('click', () => {
        this.game = new PentagoGame();
        this.render();
    });
    
    this.fileInput.addEventListener('change', (e) => this.handleLoad(e));

    // Rotation Controls
    this.container.querySelectorAll('.rotate-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const q = parseInt(e.target.parentElement.dataset.q);
            const dir = e.target.classList.contains('cw') ? 'CW' : 'CCW';
            this.handleRotate(q, dir);
        });
    });
  }

  handleSave() {
    const json = this.game.exportState();
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Pentago_${new Date().toISOString().slice(0,19).replace(/[:]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  handleLoad(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        if (this.game.importState(ev.target.result)) {
            this.render();
            alert('Game Loaded');
        } else {
            alert('Failed to load');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  handleCellClick(row, col) {
    if (this.game.place(row, col)) {
        this.render();
    }
  }

  handleRotate(q, dir) {
    if (this.game.rotate(q, dir)) {
        this.render();
    }
  }

  render() {
    this.boardEl.innerHTML = '';
    
    // Status
    if (this.game.winner) {
        const w = this.game.winner === 'draw' ? 'Draw' : (this.game.winner === Player.RED ? 'Red' : 'Black');
        this.turnEl.textContent = `Winner: ${w}!`;
        this.controlsEl.classList.remove('active');
    } else {
        const player = this.game.turn === Player.RED ? 'Red' : 'Black';
        const phase = this.game.phase === Phase.PLACEMENT ? 'Place Marble' : 'Rotate Quadrant';
        this.turnEl.textContent = `Turn: ${player} (${phase})`;
        
        if (this.game.phase === Phase.ROTATION) {
            this.controlsEl.classList.add('active');
        } else {
            this.controlsEl.classList.remove('active');
        }
    }

    // Board
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = document.createElement('div');
            cell.className = 'pentago-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            const piece = this.game.board[row][col];
            if (piece !== Player.EMPTY) {
                const marble = document.createElement('div');
                marble.className = `marble ${piece}`;
                cell.appendChild(marble);
            }
            
            // Move Highlighting (Standard)
            // Only in PLACEMENT phase
            if (!this.game.winner && this.game.phase === Phase.PLACEMENT) {
                if (this.game.isValidMove(row, col)) {
                     // We could use .valid-move class on cell, or append marker
                     // Standard requires "visually indicate valid moves when a piece is selected"
                     // Pentago doesn't have "selection" of existing pieces to move. 
                     // It's placement.
                     // But standard says "when a piece is selected".
                     // For placement games, usually empty spots are valid.
                     // Highlighting ALL empty spots might be noisy?
                     // "valid-move" usually implies "I clicked X, where can X go?"
                     // In Pentago, I click an empty spot to place.
                     // Maybe hover effect is enough?
                     // But let's add the visual indicator for consistency if interpreted as "valid placement".
                     // Actually, the standard "Move Highlighting" text: "visually indicate valid moves when a piece is selected".
                     // Pentago has no "piece selection".
                     // So technically this rule applies to moving existing pieces.
                     // But let's support the spirit: indicate interactivity.
                     // I'll stick to hover for placement, but maybe add a marker if the user clicks?
                     // Wait, click places it immediately.
                     // I'll just ensure `.pentago-cell` has cursor pointer.
                     // And maybe add `.valid-move` class to empty cells so they can be styled if we want.
                     cell.classList.add('valid-move');
                }
            }

            cell.addEventListener('click', () => this.handleCellClick(row, col));
            this.boardEl.appendChild(cell);
        }
    }
  }
}

