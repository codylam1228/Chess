export const CellState = {
  HIDDEN: 'unrevealed',
  REVEALED: 'revealed',
  FLAGGED: 'flagged',
  MISFLAGGED: 'misflagged'
};

const defaultDifficulties = {
  beginner: { width: 9, height: 9, mines: 10 },
  intermediate: { width: 16, height: 16, mines: 40 },
  expert: { width: 30, height: 16, mines: 99 },
  infinity: { width: 50, height: 50, mines: 500 },
};

export class MinesweeperGame {
  constructor(options = {}) {
    this.applyConfig(options);
    this.reset();
  }

  applyConfig(options) {
    this.difficulty = options.difficulty || 'beginner';
    const preset = defaultDifficulties[this.difficulty];

    const customWidth = Number(options.customWidth) || 9;
    const customHeight = Number(options.customHeight) || 9;
    const customMines = Number(options.customMines) || 10;

    const base = preset || { width: customWidth, height: customHeight, mines: customMines };

    this.width = base.width;
    this.height = base.height;
    this.mines = base.mines;

    // Store custom for persistence even when using presets
    this.customWidth = customWidth;
    this.customHeight = customHeight;
    this.customMines = customMines;

    this.firstClickSafety = options.firstClickSafety !== false;
    this.autoReveal = options.autoReveal !== false;
  }

  reset() {
    this.board = this.createEmptyBoard();
    this.status = 'playing'; // playing | won | lost
    this.firstClickDone = false;
    this.flagsRemaining = this.mines;
    this.revealedCount = 0;
    this.history = [];
    this.elapsedMs = 0;
    this.isTimerRunning = false;
    this.startedAt = null;
  }

  createEmptyBoard() {
    return new Array(this.height).fill(null).map(() =>
      new Array(this.width).fill(null).map(() => ({
        isMine: false,
        adjacent: 0,
        state: CellState.HIDDEN
      }))
    );
  }

  startTimer() {
    if (this.isTimerRunning) return;
    this.isTimerRunning = true;
    this.startedAt = performance.now();
  }

  stopTimer() {
    if (!this.isTimerRunning) return;
    this.elapsedMs += performance.now() - this.startedAt;
    this.isTimerRunning = false;
    this.startedAt = null;
  }

  getElapsedMs() {
    if (this.isTimerRunning) {
      return this.elapsedMs + (performance.now() - this.startedAt);
    }
    return this.elapsedMs;
  }

  isTimerActive() {
    return this.isTimerRunning;
  }

  saveSnapshot() {
    // Capture timer state before mutating
    const snapElapsed = this.getElapsedMs();
    const snapshot = {
      board: this.cloneBoard(),
      status: this.status,
      firstClickDone: this.firstClickDone,
      flagsRemaining: this.flagsRemaining,
      revealedCount: this.revealedCount,
      elapsedMs: snapElapsed,
      isTimerRunning: this.isTimerRunning,
      width: this.width,
      height: this.height,
      mines: this.mines,
      difficulty: this.difficulty,
      customWidth: this.customWidth,
      customHeight: this.customHeight,
      customMines: this.customMines,
      firstClickSafety: this.firstClickSafety,
      autoReveal: this.autoReveal
    };
    this.history.push(snapshot);
    if (this.history.length > 100) {
      this.history.shift();
    }
  }

  cloneBoard() {
    return this.board.map(row =>
      row.map(cell => ({
        isMine: cell.isMine,
        adjacent: cell.adjacent,
        state: cell.state
      }))
    );
  }

  restoreSnapshot(snapshot) {
    this.board = snapshot.board.map(row =>
      row.map(cell => ({
        isMine: cell.isMine,
        adjacent: cell.adjacent,
        state: cell.state
      }))
    );
    this.status = snapshot.status;
    this.firstClickDone = snapshot.firstClickDone;
    this.flagsRemaining = snapshot.flagsRemaining;
    this.revealedCount = snapshot.revealedCount;
    this.elapsedMs = snapshot.elapsedMs;
    this.isTimerRunning = snapshot.isTimerRunning;
    this.startedAt = this.isTimerRunning ? performance.now() : null;
    this.width = snapshot.width;
    this.height = snapshot.height;
    this.mines = snapshot.mines;
    this.difficulty = snapshot.difficulty;
    this.customWidth = snapshot.customWidth;
    this.customHeight = snapshot.customHeight;
    this.customMines = snapshot.customMines;
    this.firstClickSafety = snapshot.firstClickSafety;
    this.autoReveal = snapshot.autoReveal;
  }

  undo() {
    if (this.history.length === 0) return false;
    const snapshot = this.history.pop();
    this.restoreSnapshot(snapshot);
    return true;
  }

  getNeighbors(row, col) {
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < this.height && c >= 0 && c < this.width) {
          neighbors.push([r, c]);
        }
      }
    }
    return neighbors;
  }

  placeMines(excludeRow, excludeCol) {
    const positions = [];
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        if (r === excludeRow && c === excludeCol) continue;
        positions.push([r, c]);
      }
    }

    // If mines exceed available spots (edge custom cases), clamp
    const mineCount = Math.min(this.mines, positions.length);
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    for (let i = 0; i < mineCount; i++) {
      const [r, c] = positions[i];
      this.board[r][c].isMine = true;
    }

    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        if (this.board[r][c].isMine) {
          this.board[r][c].adjacent = -1;
        } else {
          this.board[r][c].adjacent = this.getNeighbors(r, c).filter(([nr, nc]) => this.board[nr][nc].isMine).length;
        }
      }
    }
  }

  reveal(row, col) {
    if (this.status !== 'playing') return false;
    if (!this.isInBounds(row, col)) return false;
    const cell = this.board[row][col];

    if (cell.state === CellState.REVEALED) {
      return this.handleChord(row, col);
    }
    if (cell.state === CellState.FLAGGED) return false;

    if (!this.firstClickDone) {
      this.saveSnapshot();
      if (this.firstClickSafety) {
        this.placeMines(row, col);
      } else {
        this.placeMines(-1, -1); // allow mines everywhere
      }
      this.firstClickDone = true;
      this.startTimer();
    } else {
      this.saveSnapshot();
    }

    this.revealCell(row, col);
    this.checkWin();
    return true;
  }

  handleChord(row, col) {
    const cell = this.board[row][col];
    if (cell.state !== CellState.REVEALED) return false;
    if (cell.adjacent <= 0) return false;

    const flaggedNeighbors = this.getNeighbors(row, col).filter(([nr, nc]) => this.board[nr][nc].state === CellState.FLAGGED);
    if (flaggedNeighbors.length !== cell.adjacent) return false;

    this.saveSnapshot();
    const neighbors = this.getNeighbors(row, col);
    neighbors.forEach(([nr, nc]) => {
      const neighborCell = this.board[nr][nc];
      if (neighborCell.state === CellState.HIDDEN) {
        this.revealCell(nr, nc);
      }
    });
    this.checkWin();
    return true;
  }

  revealCell(row, col) {
    const cell = this.board[row][col];
    if (cell.state !== CellState.HIDDEN) return;

    cell.state = CellState.REVEALED;
    this.revealedCount += 1;

    if (cell.isMine) {
      this.status = 'lost';
      this.stopTimer();
      this.revealAllMines();
      return;
    }

    if (cell.adjacent === 0 && this.autoReveal) {
      const queue = [[row, col]];
      const visited = new Set();

      while (queue.length > 0) {
        const [cr, cc] = queue.shift();
        const key = `${cr},${cc}`;
        if (visited.has(key)) continue;
        visited.add(key);

        this.getNeighbors(cr, cc).forEach(([nr, nc]) => {
          const neighbor = this.board[nr][nc];
          if (neighbor.state === CellState.HIDDEN && !neighbor.isMine) {
            neighbor.state = CellState.REVEALED;
            this.revealedCount += 1;
            if (neighbor.adjacent === 0) {
              queue.push([nr, nc]);
            }
          }
        });
      }
    }
  }

  toggleFlag(row, col) {
    if (this.status !== 'playing') return false;
    if (!this.isInBounds(row, col)) return false;
    const cell = this.board[row][col];
    if (cell.state === CellState.REVEALED) return false;

    this.saveSnapshot();
    if (cell.state === CellState.FLAGGED) {
      cell.state = CellState.HIDDEN;
      this.flagsRemaining += 1;
    } else {
      cell.state = CellState.FLAGGED;
      this.flagsRemaining -= 1;
    }
    return true;
  }

  revealAllMines() {
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        const cell = this.board[r][c];
        if (cell.isMine) {
          if (cell.state !== CellState.FLAGGED) {
            cell.state = CellState.REVEALED;
          }
        } else if (cell.state === CellState.FLAGGED) {
          cell.state = CellState.MISFLAGGED;
        }
      }
    }
  }

  checkWin() {
    if (this.status !== 'playing') return;
    const totalCells = this.width * this.height;
    if (this.revealedCount >= totalCells - this.mines) {
      this.status = 'won';
      this.stopTimer();
      // Auto-flag remaining
      for (let r = 0; r < this.height; r++) {
        for (let c = 0; c < this.width; c++) {
          const cell = this.board[r][c];
          if (!cell.isMine) continue;
          if (cell.state === CellState.HIDDEN) {
            cell.state = CellState.FLAGGED;
          }
        }
      }
      this.flagsRemaining = 0;
    }
  }

  isInBounds(row, col) {
    return row >= 0 && row < this.height && col >= 0 && col < this.width;
  }

  serialize() {
    return {
      board: this.cloneBoard(),
      status: this.status,
      firstClickDone: this.firstClickDone,
      flagsRemaining: this.flagsRemaining,
      revealedCount: this.revealedCount,
      elapsedMs: this.getElapsedMs(),
      isTimerRunning: this.isTimerRunning,
      width: this.width,
      height: this.height,
      mines: this.mines,
      difficulty: this.difficulty,
      customWidth: this.customWidth,
      customHeight: this.customHeight,
      customMines: this.customMines,
      firstClickSafety: this.firstClickSafety,
      autoReveal: this.autoReveal
    };
  }

  load(state) {
    this.width = state.width;
    this.height = state.height;
    this.mines = state.mines;
    this.difficulty = state.difficulty || 'beginner';
    this.customWidth = state.customWidth || this.width;
    this.customHeight = state.customHeight || this.height;
    this.customMines = state.customMines || this.mines;
    this.firstClickSafety = state.firstClickSafety !== false;
    this.autoReveal = state.autoReveal !== false;

    this.board = state.board.map(row =>
      row.map(cell => ({
        isMine: cell.isMine,
        adjacent: cell.adjacent,
        state: cell.state
      }))
    );
    this.status = state.status;
    this.firstClickDone = state.firstClickDone;
    this.flagsRemaining = state.flagsRemaining;
    this.revealedCount = state.revealedCount;
    this.elapsedMs = state.elapsedMs || 0;
    this.isTimerRunning = state.isTimerRunning || false;
    this.startedAt = this.isTimerRunning ? performance.now() : null;
  }

  updateSettings(options) {
    this.applyConfig(options);
    this.reset();
  }

  getStateSummary() {
    return {
      status: this.status,
      flagsRemaining: this.flagsRemaining,
      revealedCount: this.revealedCount,
      firstClickDone: this.firstClickDone,
      elapsedMs: this.getElapsedMs(),
      width: this.width,
      height: this.height,
      mines: this.mines
    };
  }
}

