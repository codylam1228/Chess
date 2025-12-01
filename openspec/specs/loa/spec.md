## Purpose
Core logic and UI for the Lines of Action game.
## Requirements
### Requirement: Lines of Action Game Core
The system SHALL provide a fully playable Lines of Action game for two local players.

#### Scenario: Setup
- **WHEN** the game starts
- **THEN** the board is set up with black pieces on top/bottom edges and white pieces on left/right edges (or standard LOA setup)

#### Scenario: Movement Logic
- **WHEN** a player attempts to move a piece
- **THEN** the move is valid ONLY IF the distance equals the number of pieces on the line of movement
- **AND** the path is not blocked by enemy pieces (except for capture at the end)

#### Scenario: Win Condition
- **WHEN** a player's pieces form a single contiguous body
- **THEN** that player wins the game

### Requirement: LOA Minimalist UI
The UI SHALL be minimalist, distinguishing players by simple colors (e.g., Black and White).

#### Scenario: Piece Display
- **WHEN** the game is active
- **THEN** pieces are rendered as simple circles or distinct markers

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

