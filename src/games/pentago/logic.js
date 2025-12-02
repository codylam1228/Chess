export const Player = {
  RED: 'r',
  BLACK: 'b',
  EMPTY: null
};

export const Phase = {
  PLACEMENT: 'placement',
  ROTATION: 'rotation'
};

export class PentagoGame {
  constructor() {
    this.board = this.createBoard(); // 6x6
    this.turn = Player.RED;
    this.phase = Phase.PLACEMENT;
    this.winner = null;
    this.history = [];
  }

  createBoard() {
    return new Array(6).fill(null).map(() => new Array(6).fill(Player.EMPTY));
  }

  // Quadrants: 0 (TL), 1 (TR), 2 (BL), 3 (BR)
  // Direction: 'CW' (Clockwise), 'CCW' (Counter-Clockwise)
  
  place(row, col) {
    if (this.phase !== Phase.PLACEMENT) return false;
    if (this.winner) return false;
    if (row < 0 || row > 5 || col < 0 || col > 5) return false;
    if (this.board[row][col] !== Player.EMPTY) return false;

    // Record move start
    this.currentMove = {
      player: this.turn,
      placement: { row, col },
      rotation: null
    };

    this.board[row][col] = this.turn;
    
    // Check win immediately after placement (Pentago rule: can win before rotation)
    // But standard rules say win is checked after rotation? 
    // Actually, if you get 5 in a row, you win immediately? 
    // Most rules: A player wins by getting 5 stones in a row. If all 36 spaces are filled without a winner, the game is a draw.
    // If a move creates a 5-in-a-row, the player wins.
    // Does rotation happen if 5-in-a-row exists? Usually yes, or win is checked at end of turn.
    // Let's follow "Win if 5 in a row at end of turn (after rotation)".
    // Exception: If placement makes 5-in-a-row, and rotation destroys it? 
    // Wikipedia: "If a player gets five in a row, they win immediately. If they get five in a row and rotation breaks it, they do NOT win." - Wait, that's conflicting.
    // Official rules: "The object is to get 5 marbles in a row... anywhere on the board." "A turn consists of placing a marble... then rotating one of the game blocks."
    // "Note: If a player gets 5 in a row, they win immediately and do not need to rotate."
    // OK, so check win after placement. If win, game over. If not, phase -> ROTATION.

    if (this.checkWin(this.turn)) {
      this.winner = this.turn;
    } else {
      // Check for full board draw before rotation? No, rotation might create a win.
      // But if board is full, you can't place.
      // Actually 36 moves.
      this.phase = Phase.ROTATION;
    }
    
    return true;
  }

  rotate(quadrant, direction) {
    if (this.phase !== Phase.ROTATION) return false;
    if (this.winner) return false;
    if (quadrant < 0 || quadrant > 3) return false;

    this.currentMove.rotation = { quadrant, direction };
    
    // Apply rotation
    this.rotateQuadrant(quadrant, direction);

    // Check win after rotation
    const win = this.checkWin(this.turn);
    const opponentWin = this.checkWin(this.turn === Player.RED ? Player.BLACK : Player.RED);

    if (win && opponentWin) {
      this.winner = 'draw'; // Both have 5-in-a-row
    } else if (win) {
      this.winner = this.turn;
    } else if (opponentWin) {
      this.winner = this.turn === Player.RED ? Player.BLACK : Player.RED;
    } else if (this.isBoardFull()) {
      this.winner = 'draw';
    }

    // Save history
    this.history.push({ ...this.currentMove });
    this.currentMove = null;

    // Switch turn if no winner
    if (!this.winner) {
      this.turn = this.turn === Player.RED ? Player.BLACK : Player.RED;
      this.phase = Phase.PLACEMENT;
    }
    return true;
  }

  rotateQuadrant(q, dir) {
    // Quadrant offsets
    const rOffset = (q === 2 || q === 3) ? 3 : 0;
    const cOffset = (q === 1 || q === 3) ? 3 : 0;

    // Extract 3x3
    const sub = [];
    for (let r = 0; r < 3; r++) {
      sub[r] = [];
      for (let c = 0; c < 3; c++) {
        sub[r][c] = this.board[r + rOffset][c + cOffset];
      }
    }

    // Rotate
    const newSub = [[], [], []];
    if (dir === 'CW') {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          newSub[c][2 - r] = sub[r][c];
        }
      }
    } else { // CCW
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          newSub[2 - c][r] = sub[r][c];
        }
      }
    }

    // Put back
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        this.board[r + rOffset][c + cOffset] = newSub[r][c];
      }
    }
  }

  checkWin(player) {
    // Check rows, cols, diags for 5 consecutive
    // Rows
    for (let r = 0; r < 6; r++) {
      if (this.checkLine(player, this.board[r])) return true;
    }
    // Cols
    for (let c = 0; c < 6; c++) {
      const col = [];
      for (let r = 0; r < 6; r++) col.push(this.board[r][c]);
      if (this.checkLine(player, col)) return true;
    }
    // Diagonals
    // 5 in a row requires at least starting at r=0,1 and c=0,1
    const diags = this.getDiagonals();
    for (const diag of diags) {
      if (this.checkLine(player, diag)) return true;
    }
    return false;
  }

  checkLine(player, line) {
    let count = 0;
    for (const cell of line) {
      if (cell === player) {
        count++;
        if (count === 5) return true;
      } else {
        count = 0;
      }
    }
    return false;
  }

  getDiagonals() {
    const diags = [];
    // Main diags and offset by 1
    // Top-Left to Bottom-Right
    // Starts at (0,0), (0,1), (1,0)
    // Length must be >= 5
    
    const starts = [[0,0], [0,1], [1,0], [0,5], [0,4], [1,5]]; 
    // Actually simpler to just iterate
    
    // TL-BR
    diags.push(this.getDiag(0, 0, 1, 1)); // Main
    diags.push(this.getDiag(0, 1, 1, 1)); // Upper
    diags.push(this.getDiag(1, 0, 1, 1)); // Lower

    // TR-BL
    diags.push(this.getDiag(0, 5, 1, -1)); // Main
    diags.push(this.getDiag(0, 4, 1, -1)); // Upper
    diags.push(this.getDiag(1, 5, 1, -1)); // Lower

    return diags;
  }

  getDiag(r, c, dr, dc) {
    const res = [];
    while (r >= 0 && r < 6 && c >= 0 && c < 6) {
      res.push(this.board[r][c]);
      r += dr;
      c += dc;
    }
    return res;
  }

  isBoardFull() {
    return this.board.every(row => row.every(cell => cell !== Player.EMPTY));
  }
  
  isValidMove(row, col) {
      // Required by UX Standard
      // Only check placement validity in PLACEMENT phase
      if (this.phase !== Phase.PLACEMENT) return false;
      if (this.winner) return false;
      if (row < 0 || row > 5 || col < 0 || col > 5) return false;
      return this.board[row][col] === Player.EMPTY;
  }

  // Serialization
  exportState() {
    return JSON.stringify({
      board: this.board,
      turn: this.turn,
      phase: this.phase,
      winner: this.winner,
      history: this.history
    });
  }

  importState(json) {
    try {
      const data = JSON.parse(json);
      this.board = data.board;
      this.turn = data.turn;
      this.phase = data.phase;
      this.winner = data.winner;
      this.history = data.history || [];
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  
  undo() {
      if (this.history.length === 0) return false;
      
      // Need to restore full state from history? 
      // History stores moves. 
      // Simpler to just reconstruct? 
      // Or just store full state in history?
      // Let's assume hotseat standard: Undo reverts one full turn (Placement + Rotation).
      // But wait, if we are in ROTATION phase, undo should go back to PLACEMENT of SAME turn.
      
      if (this.phase === Phase.ROTATION) {
          // Undo placement
          const lastMove = this.history[this.history.length - 1]; 
          // Wait, history is pushed AFTER rotation. 
          // So if in ROTATION, we haven't pushed to history yet? 
          // In place(), we set this.currentMove.
          
          if (this.currentMove) {
              const { row, col } = this.currentMove.placement;
              this.board[row][col] = Player.EMPTY;
              this.phase = Phase.PLACEMENT;
              this.currentMove = null;
              this.winner = null; // Clear potential win
              return true;
          }
      }
      
      // If in PLACEMENT phase, undo previous player's full turn
      if (this.history.length > 0) {
          const last = this.history.pop();
          // Reverse rotation
          const reverseDir = last.rotation.direction === 'CW' ? 'CCW' : 'CW';
          this.rotateQuadrant(last.rotation.quadrant, reverseDir);
          // Reverse placement
          this.board[last.placement.row][last.placement.col] = Player.EMPTY;
          
          this.turn = last.player; // Should be this.turn anyway if we swapped back
          this.phase = Phase.PLACEMENT;
          this.winner = null;
          return true;
      }
      
      return false;
  }
}

