## ADDED Requirements
### Requirement: Minesweeper Game Core
The system SHALL provide a fully playable Minesweeper game for single-player puzzle solving.

#### Scenario: Game Setup
- **WHEN** the game starts
- **THEN** a grid is displayed based on selected difficulty level
- **AND** mines are randomly placed on the grid (excluding the first-click cell if first-click safety is enabled)
- **AND** all cells are initially hidden

#### Scenario: Difficulty Levels
- **WHEN** the user selects a difficulty level
- **THEN** the grid size and mine count are set accordingly:
  - **Beginner**: 9×9 grid with 10 mines
  - **Intermediate**: 16×16 grid with 40 mines
  - **Expert**: 16×30 grid with 99 mines
  - **Infinity/Custom**: User-configurable grid size and mine count

#### Scenario: Cell Revelation
- **WHEN** the user left-clicks (or short-presses on mobile) on a hidden cell
- **THEN** the cell is revealed
- **AND** if the cell contains a mine, the game ends in a loss
- **AND** if the cell shows a number, it displays the count of adjacent mines (0-8)
- **AND** if the cell shows 0, all connected empty cells are automatically revealed (if auto-reveal is enabled)

#### Scenario: First-Click Safety
- **WHEN** first-click safety is enabled (configurable in settings)
- **AND** the user makes their first click
- **THEN** the clicked cell is guaranteed to not contain a mine
- **AND** if the cell would have been a mine, mines are redistributed to ensure safety
- **AND** if the cell shows 0, surrounding cells are auto-revealed (if auto-reveal is enabled)

#### Scenario: Flagging
- **WHEN** the user right-clicks (or long-presses on mobile) on a hidden cell
- **THEN** the cell is flagged (marked as a suspected mine)
- **AND** the mine counter decreases by one
- **WHEN** the user right-clicks (or long-presses) on a flagged cell
- **THEN** the flag is removed
- **AND** the mine counter increases by one

#### Scenario: Chord-Clicking
- **WHEN** the user clicks on a revealed number cell
- **AND** the number of flagged adjacent cells equals the number displayed
- **THEN** all unflagged adjacent hidden cells are automatically revealed
- **AND** if any revealed cell contains a mine, the game ends in a loss

#### Scenario: Winning Condition
- **WHEN** all non-mine cells are revealed
- **THEN** the game ends in a win
- **AND** all remaining mines are automatically flagged
- **AND** the timer stops

#### Scenario: Losing Condition
- **WHEN** the user reveals a cell containing a mine
- **THEN** the game ends in a loss
- **AND** all mines are revealed
- **AND** incorrectly flagged cells are indicated
- **AND** the timer stops

### Requirement: Minesweeper UI
The UI SHALL provide intuitive interactions for revealing cells, flagging mines, and managing game settings.

#### Scenario: Timer Display
- **WHEN** the game is active
- **THEN** a timer displays the elapsed time since the first click
- **AND** the timer stops when the game ends (win or loss)

#### Scenario: Mine Counter
- **WHEN** the game is active
- **THEN** a counter displays the number of remaining unflagged mines
- **AND** the counter updates when cells are flagged or unflagged

#### Scenario: Difficulty Selection
- **WHEN** the user accesses the game
- **THEN** they can select a difficulty level (Beginner, Intermediate, Expert, Infinity/Custom)
- **AND** selecting a difficulty resets the game with the new configuration

#### Scenario: Settings Menu
- **WHEN** the user opens the settings menu
- **THEN** they can configure:
  - First-click safety (enabled/disabled)
  - Auto-reveal behavior (enabled/disabled)
  - For Infinity/Custom difficulty: grid width, grid height, mine count
- **AND** settings are persisted across game sessions

#### Scenario: Standard Controls
- **WHEN** the game is active
- **THEN** standard controls are available:
  - **Menu**: Returns to game selection screen
  - **Undo**: Reverses the last move (if undo is supported)
  - **Save**: Saves the current game state to local storage
  - **Load**: Loads a previously saved game state
  - **Reset**: Starts a new game with the current difficulty and settings

#### Scenario: Mobile Support
- **WHEN** the user interacts on a mobile device
- **THEN** short-press reveals cells
- **AND** long-press flags/unflags cells
- **AND** the UI is responsive and touch-friendly

#### Scenario: Visual Feedback
- **WHEN** a cell is revealed
- **THEN** it displays appropriate visual state (empty, number, or mine)
- **WHEN** a cell is flagged
- **THEN** it displays a flag indicator
- **WHEN** the game ends
- **THEN** win or loss state is clearly indicated

