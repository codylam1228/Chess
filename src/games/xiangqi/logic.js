// Xiangqi Logic (Chinese Chess)

export const Piece = {
  RED: 'r',
  BLACK: 'b',
  GENERAL: 'g', // King
  ADVISOR: 'a',
  ELEPHANT: 'e',
  HORSE: 'h',
  CHARIOT: 'c', // Rook
  CANNON: 'p', // Cannon (pao)
  SOLDIER: 's'
};

export class XiangqiGame {
  constructor() {
    this.board = this.createBoard(); // 10 rows, 9 cols
    this.turn = Piece.RED;
    this.winner = null;
    this.history = [];
  }

  createBoard() {
    const board = new Array(10).fill(null).map(() => new Array(9).fill(null));
    
    const setupRow = (row, color, pieces) => {
      pieces.forEach((p, col) => {
        board[row][col] = { color, type: p };
      });
    };

    const backRow = ['c', 'h', 'e', 'a', 'g', 'a', 'e', 'h', 'c'];
    
    // Black (Top) - Rows 0-4
    setupRow(0, Piece.BLACK, backRow);
    board[2][1] = { color: Piece.BLACK, type: Piece.CANNON };
    board[2][7] = { color: Piece.BLACK, type: Piece.CANNON };
    board[3][0] = { color: Piece.BLACK, type: Piece.SOLDIER };
    board[3][2] = { color: Piece.BLACK, type: Piece.SOLDIER };
    board[3][4] = { color: Piece.BLACK, type: Piece.SOLDIER };
    board[3][6] = { color: Piece.BLACK, type: Piece.SOLDIER };
    board[3][8] = { color: Piece.BLACK, type: Piece.SOLDIER };

    // Red (Bottom) - Rows 5-9
    setupRow(9, Piece.RED, backRow);
    board[7][1] = { color: Piece.RED, type: Piece.CANNON };
    board[7][7] = { color: Piece.RED, type: Piece.CANNON };
    board[6][0] = { color: Piece.RED, type: Piece.SOLDIER };
    board[6][2] = { color: Piece.RED, type: Piece.SOLDIER };
    board[6][4] = { color: Piece.RED, type: Piece.SOLDIER };
    board[6][6] = { color: Piece.RED, type: Piece.SOLDIER };
    board[6][8] = { color: Piece.RED, type: Piece.SOLDIER };

    return board;
  }

  getPiece(row, col) {
    if (row < 0 || row > 9 || col < 0 || col > 8) return null;
    return this.board[row][col];
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
      captured: destPiece
    });

    // Execute
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Check Win (General Captured) - Though typically you checkmate, capture is definitive win in simplified
    if (destPiece && destPiece.type === Piece.GENERAL) {
      this.winner = this.turn;
    }

    // Switch Turn
    this.turn = this.turn === Piece.RED ? Piece.BLACK : Piece.RED;
    return true;
  }

  undo() {
    if (this.history.length === 0) return false;
    const last = this.history.pop();
    
    this.board[last.from.r][last.from.c] = last.piece;
    this.board[last.to.r][last.to.c] = last.captured;
    this.winner = null;
    this.turn = this.turn === Piece.RED ? Piece.BLACK : Piece.RED;
    return true;
  }

  isValidMove(r1, c1, r2, c2) {
    const p = this.getPiece(r1, c1);
    if (!p || p.color !== this.turn) return false;
    
    // Bounds
    if (r2 < 0 || r2 > 9 || c2 < 0 || c2 > 8) return false;
    
    // Capture own?
    const dest = this.getPiece(r2, c2);
    if (dest && dest.color === p.color) return false;

    const dr = r2 - r1;
    const dc = c2 - c1;
    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);

    switch (p.type) {
      case Piece.GENERAL: // Orthogonal 1, confined to Palace
        if (absDr + absDc !== 1) return false;
        if (!this.inPalace(r2, c2, p.color)) return false;
        // Flying General check? (Ignored for prototype)
        return true;

      case Piece.ADVISOR: // Diagonal 1, confined to Palace
        if (absDr !== 1 || absDc !== 1) return false;
        return this.inPalace(r2, c2, p.color);

      case Piece.ELEPHANT: // Diagonal 2, no cross river, no block eye
        if (absDr !== 2 || absDc !== 2) return false;
        // River check
        if (p.color === Piece.RED && r2 < 5) return false; // Red elephant cannot cross to 0-4
        if (p.color === Piece.BLACK && r2 > 4) return false;
        // Block check (eye)
        if (this.getPiece(r1 + dr/2, c1 + dc/2)) return false;
        return true;

      case Piece.HORSE: // Orth 1 then Diag 1. Blockable
        if (!((absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2))) return false;
        // Hobbling leg check
        if (absDr === 2) {
          // Moved vertical first. Check vertical neighbor
          if (this.getPiece(r1 + Math.sign(dr), c1)) return false;
        } else {
          // Moved horizontal first
          if (this.getPiece(r1, c1 + Math.sign(dc))) return false;
        }
        return true;

      case Piece.CHARIOT: // Rook
        if (dr !== 0 && dc !== 0) return false;
        return this.isPathClear(r1, c1, r2, c2);

      case Piece.CANNON: // Rook move, but capture needs screen
        if (dr !== 0 && dc !== 0) return false;
        const count = this.countPieces(r1, c1, r2, c2);
        if (dest) {
          // Capture: Need exactly 1 screen (count should be 1 piece BETWEEN)
          // My countPieces function counts pieces strictly between
          return count === 1;
        } else {
          // Move: Need 0 screens
          return count === 0;
        }

      case Piece.SOLDIER: // Fwd 1. Side 1 if crossed river. No back.
        const fwd = p.color === Piece.RED ? -1 : 1;
        // Backward check
        if (dr === -fwd) return false; // Trying to move back
        
        // Cross river check
        const crossed = p.color === Piece.RED ? r1 <= 4 : r1 >= 5;
        
        if (crossed) {
          // Can move fwd or side
          if (absDr + absDc !== 1) return false;
          if (dr === fwd) return true; // Forward
          if (dr === 0) return true; // Side
          return false;
        } else {
          // Can only move fwd
          if (dc !== 0) return false;
          if (dr !== fwd) return false;
          return true;
        }

      default: return false;
    }
  }

  inPalace(r, c, color) {
    if (c < 3 || c > 5) return false;
    if (color === Piece.BLACK) return r >= 0 && r <= 2;
    if (color === Piece.RED) return r >= 7 && r <= 9;
    return false;
  }

  isPathClear(r1, c1, r2, c2) {
    return this.countPieces(r1, c1, r2, c2) === 0;
  }

  countPieces(r1, c1, r2, c2) {
    let count = 0;
    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    let r = r1 + dr;
    let c = c1 + dc;
    while (r !== r2 || c !== c2) {
      if (this.getPiece(r, c)) count++;
      r += dr;
      c += dc;
    }
    return count;
  }
}

