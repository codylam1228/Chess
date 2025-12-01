# xiangqi Specification

## Purpose
TBD - created by archiving change add-xiangqi-enhancements. Update Purpose after archive.
## Requirements
### Requirement: Xiangqi Game Core
The system SHALL provide a fully playable Xiangqi (Chinese Chess) game for two local players.

#### Scenario: Setup
- **WHEN** the game starts
- **THEN** a 9x10 board is displayed with the River and Palaces
- **AND** pieces are placed in their standard starting positions

#### Scenario: Movement Logic
- **WHEN** a player moves a piece
- **THEN** the move MUST adhere to standard Xiangqi rules (e.g., Horses blocked by legs, Elephants cannot cross river, Generals/Advisors confined to Palace)

### Requirement: Xiangqi Minimalist UI
The UI SHALL be minimalist, using text characters or simple symbols for pieces.

#### Scenario: Piece Display
- **WHEN** the game is active
- **THEN** pieces are distinguished by Red and Black colors (or traditional labels)

### Requirement: Undo Capability
The system SHALL allow players to reverse the last move.

#### Scenario: Undo Move
- **WHEN** the "Reverse" button is clicked
- **THEN** the board reverts to the state before the last move

