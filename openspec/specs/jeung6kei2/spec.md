# jeung6kei2 Specification

## Purpose
TBD - created by archiving change add-xiangqi-enhancements. Update Purpose after archive.
## Requirements
### Requirement: Jeung6kei2 Game Core
The system SHALL provide a fully playable jeung6kei2 (Chinese Chess) game for two local players.

#### Scenario: Setup
- **WHEN** the game starts
- **THEN** a 9x10 board is displayed with the River and Palaces
- **AND** pieces are placed in their standard starting positions

#### Scenario: Movement Logic
- **WHEN** a player moves a piece
- **THEN** the move MUST adhere to standard jeung6kei2 rules (e.g., Horses blocked by legs, Elephants cannot cross river, Generals/Advisors confined to Palace)

### Requirement: Jeung6kei2 Minimalist UI
The UI SHALL be minimalist, using text characters or simple symbols for pieces.

#### Scenario: Piece Display
- **WHEN** the game is active
- **THEN** pieces are distinguished by Red and Black colors (or traditional labels)

### Requirement: Cantonese Language
The system SHALL use Cantonese (Traditional Chinese or Romanization) instead of Simplified Chinese for all jeung6kei2-related text.

#### Scenario: Language Check
- **WHEN** text is displayed
- **THEN** it MUST be in Cantonese format (e.g., "jeung6kei2", Traditional Characters)

### Requirement: Undo Capability
The system SHALL allow players to reverse the last move.

#### Scenario: Undo Move
- **WHEN** the "Reverse" button is clicked
- **THEN** the board reverts to the state before the last move

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
