## ADDED Requirements
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

