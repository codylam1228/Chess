## Purpose
Core logic and UI for the Chess game.
## Requirements
### Requirement: Chess Game Core
The system SHALL provide a fully playable Chess game for two local players.

#### Scenario: Valid Move
- **WHEN** the current player selects a piece and a valid destination
- **THEN** the piece moves to the destination
- **AND** the turn passes to the opponent

#### Scenario: Invalid Move
- **WHEN** the current player selects a piece and an invalid destination
- **THEN** the move is rejected
- **AND** the piece remains in its original position

### Requirement: Chess Minimalist UI
The UI SHALL be minimalist, using simple shapes or standard unicode symbols for pieces.

#### Scenario: Board Display
- **WHEN** the game starts
- **THEN** an 8x8 board is displayed with minimalist contrast

### Requirement: Undo Capability
The system SHALL allow players to reverse the last move.

#### Scenario: Undo Move
- **WHEN** the "Reverse" button is clicked
- **THEN** the board reverts to the state before the last move
- **AND** the turn passes back to the previous player

### Requirement: Save and Load
The system SHALL allow players to export the current game state to a file and import it to resume play.

#### Scenario: Export Game
- **WHEN** the "Save" button is clicked
- **THEN** a JSON file containing the current board, turn, and history is downloaded
- **AND** the filename follows the format `{GameName}_{YYYY-MM-DD_HH-mm}.json`

#### Scenario: Import Game
- **WHEN** the "Load" button is clicked and a valid JSON file is selected
- **THEN** the game state (board, turn, history) is restored from the file
- **AND** the UI updates to reflect the restored state

