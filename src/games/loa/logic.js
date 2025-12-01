// Lines of Action Logic

export const Piece = {
  BLACK: 'b',
  WHITE: 'w',
  EMPTY: null
};

export class LOAGame {
  constructor() {
    this.board = this.createBoard();
    this.turn = Piece.BLACK; // Black typically starts in LOA
    this.winner = null;
    this.history = [];
  }

  createBoard() {
    const board = new Array(8).fill(null).map(() => new Array(8).fill(null));
    
    // Standard Setup
    // Black: Top and Bottom rows (excluding corners)
    // White: Left and Right columns (excluding corners)
    for (let i = 1; i < 7; i++) {
      board[0][i] = { color: Piece.BLACK };
      board[7][i] = { color: Piece.BLACK };
      board[i][0] = { color: Piece.WHITE };
      board[i][7] = { color: Piece.WHITE };
    }
    return board;
  }

  getPiece(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    return this.board[row][col];
  }

  // Count pieces on a specific line (row, col, or diagonal)
  countPiecesOnLine(r, c, dr, dc) {
    let count = 0;
    // Scan forward
    let i = 0;
    while (true) {
      const tr = r + i * dr;
      const tc = c + i * dc;
      if (tr < 0 || tr > 7 || tc < 0 || tc > 7) break;
      if (this.getPiece(tr, tc)) count++;
      i++;
    }
    // Scan backward
    i = 1;
    while (true) {
      const tr = r - i * dr;
      const tc = c - i * dc;
      if (tr < 0 || tr > 7 || tc < 0 || tc > 7) break;
      if (this.getPiece(tr, tc)) count++;
      i++;
    }
    return count;
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    if (!piece || piece.color !== this.turn) return false;

    const dest = this.getPiece(toRow, toCol);
    if (dest && dest.color === piece.color) return false; // Cannot capture own

    const dRow = toRow - fromRow;
    const dCol = toCol - fromCol;
    
    // Must move in straight line
    if (dRow !== 0 && dCol !== 0 && Math.abs(dRow) !== Math.abs(dCol)) return false;

    const stepR = Math.sign(dRow);
    const stepC = Math.sign(dCol);
    
    // 1. Check distance rule
    const distance = Math.max(Math.abs(dRow), Math.abs(dCol));
    const piecesOnLine = this.countPiecesOnLine(fromRow, fromCol, stepR, stepC);
    
    if (distance !== piecesOnLine) return false;

    // 2. Check path blocking (cannot jump ENEMY pieces)
    for (let i = 1; i < distance; i++) {
      const checkR = fromRow + i * stepR;
      const checkC = fromCol + i * stepC;
      const p = this.getPiece(checkR, checkC);
      if (p && p.color !== piece.color) return false;
    }

    return true;
  }

  move(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return false;

    const destPiece = this.board[toRow][toCol];

    // Save History
    this.history.push({
      from: { r: fromRow, c: fromCol },
      to: { r: toRow, c: toCol },
      piece: { ...piece },
      captured: destPiece,
      turn: this.turn
    });

    // Execute move
    this.board[toRow][toCol] = this.board[fromRow][fromCol];
    this.board[fromRow][fromCol] = null;

    // Check Win
    if (this.checkWin(this.turn)) {
      this.winner = this.turn;
      return true;
    }

    // Check Opponent Win (can happen if they lose their last disconnected piece)
    const opponent = this.turn === Piece.BLACK ? Piece.WHITE : Piece.BLACK;
    if (this.checkWin(opponent)) {
      this.winner = opponent;
      return true;
    }

    this.turn = opponent;
    return true;
  }

  undo() {
    if (this.history.length === 0) return false;
    if (this.winner) this.winner = null; // Clear winner if undoing winning move

    const lastMove = this.history.pop();
    const { from, to, piece, captured, turn } = lastMove;

    // Revert
    this.board[from.r][from.c] = piece;
    this.board[to.r][to.c] = captured;
    this.turn = turn; // Restore turn (could simply flip, but explicit is safer if skipped turns exist)
    
    return true;
  }

  checkWin(color) {
    // Find all pieces of color
    const pieces = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p && p.color === color) {
          pieces.push({ r, c });
        }
      }
    }

    if (pieces.length <= 1) return true; // 0 or 1 piece is technically connected

    // Flood fill connectivity
    const visited = new Set();
    const queue = [pieces[0]];
    visited.add(`${pieces[0].r},${pieces[0].c}`);
    let count = 0;

    while (queue.length > 0) {
      const { r, c } = queue.shift();
      count++;

      // Check 8 neighbors
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const p = this.getPiece(nr, nc);
            const key = `${nr},${nc}`;
            if (p && p.color === color && !visited.has(key)) {
              visited.add(key);
              queue.push({ r: nr, c: nc });
            }
          }
        }
      }
    }

    return count === pieces.length;
  }
}
