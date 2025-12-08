import { MinesweeperGame, CellState } from './logic.js';

const SETTINGS_KEY = 'minesweeper-settings';
const SAVE_KEY = 'minesweeper-save';

export class MinesweeperUI {
  constructor(container) {
    this.container = container;
    this.longPressTimeout = null;
    this.longPressTriggered = false;
    this.settings = this.loadSettings();
    this.game = new MinesweeperGame(this.settingsToConfig(this.settings));
    this.timerInterval = null;
    this.init();
  }

  settingsToConfig(settings) {
    return {
      difficulty: settings.difficulty,
      customWidth: settings.customWidth,
      customHeight: settings.customHeight,
      customMines: settings.customMines,
      firstClickSafety: settings.firstClickSafety,
      autoReveal: settings.autoReveal
    };
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to load minesweeper settings', e);
    }
    return {
      difficulty: 'beginner',
      customWidth: 9,
      customHeight: 9,
      customMines: 10,
      firstClickSafety: true,
      autoReveal: true
    };
  }

  saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  init() {
    this.container.innerHTML = `
      <div class="minesweeper-game">
        <div class="status-bar">
          <div class="status-left">
            <label class="difficulty-label">
              Difficulty
              <select id="difficulty-select">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
                <option value="custom">Infinity / Custom</option>
              </select>
            </label>
            <button id="settings-btn" class="btn secondary">Settings</button>
            <span id="mine-counter" class="badge">Mines: 000</span>
            <span id="timer" class="badge">Time: 000</span>
            <span id="status-text" class="status-text"></span>
          </div>
          <div class="controls">
            <button id="return-btn" class="btn">Menu</button>
            <button id="undo-btn" class="btn">Undo</button>
            <button id="save-btn" class="btn">Save</button>
            <button id="load-btn" class="btn">Load</button>
            <button id="reset-btn" class="btn">Reset</button>
          </div>
        </div>
        <div class="board-wrapper">
          <div class="minesweeper-board" id="ms-board"></div>
        </div>
        <div class="settings-panel hidden" id="settings-panel">
          <h3>Settings</h3>
          <div class="setting-row">
            <label><input type="checkbox" id="first-click-safety"> First-click safety</label>
          </div>
          <div class="setting-row">
            <label><input type="checkbox" id="auto-reveal"> Auto-reveal empty areas</label>
          </div>
          <div class="setting-row">
            <div class="custom-grid">
              <label>Width <input type="number" id="custom-width" min="5" max="50" value="9"></label>
              <label>Height <input type="number" id="custom-height" min="5" max="50" value="9"></label>
              <label>Mines <input type="number" id="custom-mines" min="1" max="500" value="10"></label>
            </div>
            <p class="help-text">Custom values apply when difficulty is set to Infinity / Custom.</p>
          </div>
          <div class="setting-actions">
            <button id="settings-apply" class="btn">Apply</button>
            <button id="settings-close" class="btn secondary">Close</button>
          </div>
        </div>
        <input type="file" id="file-input" accept=".json" style="display: none;">
      </div>
    `;

    this.boardEl = this.container.querySelector('#ms-board');
    this.mineCounterEl = this.container.querySelector('#mine-counter');
    this.timerEl = this.container.querySelector('#timer');
    this.statusTextEl = this.container.querySelector('#status-text');
    this.difficultySelect = this.container.querySelector('#difficulty-select');
    this.settingsPanel = this.container.querySelector('#settings-panel');
    this.firstClickSafetyEl = this.container.querySelector('#first-click-safety');
    this.autoRevealEl = this.container.querySelector('#auto-reveal');
    this.customWidthEl = this.container.querySelector('#custom-width');
    this.customHeightEl = this.container.querySelector('#custom-height');
    this.customMinesEl = this.container.querySelector('#custom-mines');
    this.fileInput = this.container.querySelector('#file-input');

    this.bindControls();
    this.applySettingsToUI();
    this.render();
  }

  bindControls() {
    this.container.querySelector('#return-btn').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('game-return'));
    });

    this.container.querySelector('#undo-btn').addEventListener('click', () => {
      if (this.game.undo()) {
        this.syncTimerAfterUndo();
        this.render();
      }
    });

    this.container.querySelector('#save-btn').addEventListener('click', () => {
      const payload = {
        game: this.game.serialize(),
        settings: this.settings
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
      this.flashStatus('Saved');
    });

    this.container.querySelector('#load-btn').addEventListener('click', () => {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        this.flashStatus('No saved game found');
        return;
      }
      try {
        const payload = JSON.parse(raw);
        if (payload.settings) {
          this.settings = payload.settings;
          this.saveSettings(this.settings);
        }
        if (payload.game) {
          this.game = new MinesweeperGame(this.settingsToConfig(this.settings));
          this.game.load(payload.game);
          this.applySettingsToUI();
          this.restartTimerInterval();
          this.render();
          this.flashStatus('Loaded');
        }
      } catch (e) {
        console.error(e);
        this.flashStatus('Failed to load');
      }
    });

    this.container.querySelector('#reset-btn').addEventListener('click', () => {
      this.game = new MinesweeperGame(this.settingsToConfig(this.settings));
      this.restartTimerInterval();
      this.render();
    });

    this.container.querySelector('#settings-btn').addEventListener('click', () => {
      this.settingsPanel.classList.toggle('hidden');
    });

    this.container.querySelector('#settings-close').addEventListener('click', () => {
      this.settingsPanel.classList.add('hidden');
    });

    this.container.querySelector('#settings-apply').addEventListener('click', () => {
      this.updateSettingsFromUI();
      this.settingsPanel.classList.add('hidden');
      this.game = new MinesweeperGame(this.settingsToConfig(this.settings));
      this.restartTimerInterval();
      this.render();
    });

    this.difficultySelect.addEventListener('change', (e) => {
      this.settings.difficulty = e.target.value;
      this.saveSettings(this.settings);
      this.game = new MinesweeperGame(this.settingsToConfig(this.settings));
      this.restartTimerInterval();
      this.render();
    });

    this.fileInput.addEventListener('change', (e) => this.handleFileLoad(e));

    this.setupBoardEvents();
  }

  setupBoardEvents() {
    this.boardEl.addEventListener('contextmenu', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      e.preventDefault();
      const { r, c } = cell.dataset;
      this.handleFlag(Number(r), Number(c));
    });

    this.boardEl.addEventListener('pointerdown', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      if (e.pointerType === 'mouse' && e.button === 2) return; // right click handled separately
      const { r, c } = cell.dataset;
      this.longPressTriggered = false;
      this.longPressTimeout = setTimeout(() => {
        this.longPressTriggered = true;
        this.handleFlag(Number(r), Number(c));
      }, 450);
    });

    this.boardEl.addEventListener('pointerup', (e) => {
      const cell = e.target.closest('.cell');
      if (!cell) return;
      if (this.longPressTimeout) {
        clearTimeout(this.longPressTimeout);
      }
      if (this.longPressTriggered) return;
      if (e.pointerType === 'mouse' && e.button === 2) return;
      const { r, c } = cell.dataset;
      this.handleReveal(Number(r), Number(c));
    });

    this.boardEl.addEventListener('pointerleave', () => {
      if (this.longPressTimeout) {
        clearTimeout(this.longPressTimeout);
      }
    });
  }

  handleReveal(r, c) {
    const changed = this.game.reveal(r, c);
    if (changed && this.game.isTimerActive()) {
      this.restartTimerInterval();
    }
    this.render();
  }

  handleFlag(r, c) {
    const changed = this.game.toggleFlag(r, c);
    if (changed) {
      this.render();
    }
  }

  handleFileLoad(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result);
        if (payload.settings) {
          this.settings = payload.settings;
          this.saveSettings(this.settings);
        }
        if (payload.game) {
          this.game = new MinesweeperGame(this.settingsToConfig(this.settings));
          this.game.load(payload.game);
          this.applySettingsToUI();
          this.restartTimerInterval();
          this.render();
          this.flashStatus('Loaded from file');
        }
      } catch (e) {
        console.error(e);
        this.flashStatus('Failed to load file');
      }
    };
    reader.readAsText(file);
    this.fileInput.value = '';
  }

  syncTimerAfterUndo() {
    if (this.game.isTimerActive()) {
      this.restartTimerInterval();
    } else {
      this.stopTimerInterval();
    }
  }

  restartTimerInterval() {
    this.stopTimerInterval();
    if (this.game.isTimerActive()) {
      this.timerInterval = setInterval(() => {
        this.updateTimerDisplay();
      }, 300);
    }
  }

  stopTimerInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    const elapsed = Math.floor(this.game.getStateSummary().elapsedMs / 1000);
    this.timerEl.textContent = `Time: ${elapsed.toString().padStart(3, '0')}`;
  }

  updateCounters() {
    const summary = this.game.getStateSummary();
    this.mineCounterEl.textContent = `Mines: ${summary.flagsRemaining}`;
    this.updateTimerDisplay();
    if (summary.status === 'won') {
      this.statusTextEl.textContent = 'You win!';
    } else if (summary.status === 'lost') {
      this.statusTextEl.textContent = 'Boom! You lost.';
    } else {
      this.statusTextEl.textContent = '';
    }
  }

  renderBoard() {
    const summary = this.game.getStateSummary();
    const board = this.game.board;
    this.boardEl.style.gridTemplateColumns = `repeat(${summary.width}, 32px)`;
    this.boardEl.innerHTML = '';

    for (let r = 0; r < summary.height; r++) {
      for (let c = 0; c < summary.width; c++) {
        const cell = board[r][c];
        const cellDiv = document.createElement('div');
        cellDiv.className = `cell ${cell.state}`;
        cellDiv.dataset.r = r;
        cellDiv.dataset.c = c;

        if (cell.state === CellState.REVEALED) {
          if (cell.isMine) {
            cellDiv.classList.add('mine');
            cellDiv.textContent = '💣';
          } else if (cell.adjacent > 0) {
            cellDiv.textContent = cell.adjacent;
            cellDiv.classList.add(`num-${cell.adjacent}`);
          }
        } else if (cell.state === CellState.FLAGGED) {
          cellDiv.textContent = '🚩';
        }

        this.boardEl.appendChild(cellDiv);
      }
    }
  }

  render() {
    this.updateCounters();
    this.renderBoard();

    const summary = this.game.getStateSummary();
    if (summary.status !== 'playing') {
      this.stopTimerInterval();
    }
  }

  applySettingsToUI() {
    this.difficultySelect.value = this.settings.difficulty || 'beginner';
    this.firstClickSafetyEl.checked = this.settings.firstClickSafety !== false;
    this.autoRevealEl.checked = this.settings.autoReveal !== false;
    this.customWidthEl.value = this.settings.customWidth || 9;
    this.customHeightEl.value = this.settings.customHeight || 9;
    this.customMinesEl.value = this.settings.customMines || 10;
  }

  updateSettingsFromUI() {
    this.settings = {
      difficulty: this.difficultySelect.value,
      firstClickSafety: this.firstClickSafetyEl.checked,
      autoReveal: this.autoRevealEl.checked,
      customWidth: Number(this.customWidthEl.value) || 9,
      customHeight: Number(this.customHeightEl.value) || 9,
      customMines: Number(this.customMinesEl.value) || 10
    };
    this.saveSettings(this.settings);
  }

  flashStatus(text) {
    this.statusTextEl.textContent = text;
    setTimeout(() => {
      if (this.statusTextEl.textContent === text) {
        this.statusTextEl.textContent = '';
      }
    }, 1500);
  }
}

