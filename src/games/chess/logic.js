// Chess Game Logic

export const Piece = {
  WHITE: 'w',
  BLACK: 'b',
  PAWN: 'p',
  ROOK: 'r',
  KNIGHT: 'n',
  BISHOP: 'b',
  QUEEN: 'q',
  KING: 'k',
  EMPTY: null
};

export class ChessGame {
  constructor() {
    this.board = this.createBoard();
    this.turn = Piece.WHITE;
    this.history = []; // Undo stack
    this.winner = null;
  }

  // ... existing methods ...
  createBoard() {
    const board = new Array(8).fill(null).map(() => new Array(8).fill(null));
    const setupRow = (row, color, pieces) => {
      pieces.forEach((p, col) => {
        board[row][col] = { color, type: p };
      });
    };
    const backRow = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    setupRow(0, Piece.BLACK, backRow);
    setupRow(1, Piece.BLACK, Array(8).fill('p'));
    setupRow(6, Piece.WHITE, Array(8).fill('p'));
    setupRow(7, Piece.WHITE, backRow);
    return board;
  }

  getPiece(row, col) {
    if (row < 0 || row > 7 || col < 0 || col > 7) return null;
    return this.board[row][col];
  }

  move(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    
    if (!piece || piece.color !== this.turn) return false;
    if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return false;

    // Capture logic
    const destPiece = this.board[toRow][toCol];

    // Record History
    this.history.push({
      from: { r: fromRow, c: fromCol },
      to: { r: toRow, c: toCol },
      piece: { ...piece }, // Copy state
      captured: destPiece,
      promoted: false
    });

    // Execute move
    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    // Pawn Promotion (Auto-Queen)
    if (piece.type === Piece.PAWN) {
      if ((piece.color === Piece.WHITE && toRow === 0) || 
          (piece.color === Piece.BLACK && toRow === 7)) {
        piece.type = Piece.QUEEN;
        this.history[this.history.length - 1].promoted = true;
      }
    }

    // Switch turn
    this.turn = this.turn === Piece.WHITE ? Piece.BLACK : Piece.WHITE;
    return true;
  }

  undo() {
    if (this.history.length === 0) return false;

    const lastMove = this.history.pop();
    const { from, to, piece, captured, promoted } = lastMove;

    this.board[from.r][from.c] = lastMove.piece;
    this.board[to.r][to.c] = captured;

    // Revert Turn
    this.turn = this.turn === Piece.WHITE ? Piece.BLACK : Piece.WHITE;
    return true;
  }

  // Serialization
  exportState() {
    return JSON.stringify({
      board: this.board,
      turn: this.turn,
      history: this.history,
      winner: this.winner
    });
  }

  importState(json) {
    try {
      const data = JSON.parse(json);
      if (!data.board || !data.turn) throw new Error('Invalid save file');
      
      this.board = data.board;
      this.turn = data.turn;
      this.history = data.history || [];
      this.winner = data.winner || null;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.getPiece(fromRow, fromCol);
    if (!piece) return false;

    // Destination check (cannot capture own piece)
    const dest = this.getPiece(toRow, toCol);
    if (dest && dest.color === piece.color) return false;

    const dRow = toRow - fromRow;
    const dCol = toCol - fromCol;

    switch (piece.type) {
      case 'p': // Pawn
        const direction = piece.color === Piece.WHITE ? -1 : 1;
        const startRow = piece.color === Piece.WHITE ? 6 : 1;
        // Forward 1
        if (dCol === 0 && dRow === direction && !dest) return true;
        // Forward 2
        if (dCol === 0 && dRow === direction * 2 && fromRow === startRow && !dest && !this.getPiece(fromRow + direction, fromCol)) return true;
        // Capture
        if (Math.abs(dCol) === 1 && dRow === direction && dest) return true;
        return false;
      
      case 'r': // Rook
        if (dRow !== 0 && dCol !== 0) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
      
      case 'n': // Knight
        return (Math.abs(dRow) === 2 && Math.abs(dCol) === 1) || 
               (Math.abs(dRow) === 1 && Math.abs(dCol) === 2);
      
      case 'b': // Bishop
        if (Math.abs(dRow) !== Math.abs(dCol)) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
      
      case 'q': // Queen
        if (dRow !== 0 && dCol !== 0 && Math.abs(dRow) !== Math.abs(dCol)) return false;
        return this.isPathClear(fromRow, fromCol, toRow, toCol);
      
      case 'k': // King
        return Math.abs(dRow) <= 1 && Math.abs(dCol) <= 1;
      
      default:
        return false;
    }
  }

  isPathClear(r1, c1, r2, c2) {
    const dr = Math.sign(r2 - r1);
    const dc = Math.sign(c2 - c1);
    let r = r1 + dr;
    let c = c1 + dc;
    
    while (r !== r2 || c !== c2) {
      if (this.getPiece(r, c)) return false;
      r += dr;
      c += dc;
    }
    return true;
  }
}
