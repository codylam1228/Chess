## ADDED Requirements
### Requirement: Pentago Game Core
The system SHALL provide a fully playable Pentago game for two local players.

#### Scenario: Game Setup
- **WHEN** the game starts
- **THEN** an empty 6x6 board is displayed
- **AND** the board is visually divided into four 3x3 quadrants

#### Scenario: Player Turn
- **WHEN** it is a player's turn
- **THEN** they MUST place a marble on an empty space
- **AND** then they MUST rotate one of the four quadrants 90 degrees (clockwise or counter-clockwise)

#### Scenario: Winning Condition
- **WHEN** a player has 5 marbles in a row (horizontal, vertical, or diagonal)
- **THEN** that player is declared the winner
- **AND** the game ends immediately (if formed during placement) or after rotation

#### Scenario: Draw Condition
- **WHEN** the board is full and no player has 5 in a row
- **THEN** the game ends in a draw

### Requirement: Pentago UI
The UI SHALL allow distinct interactions for placing marbles and rotating quadrants.

#### Scenario: Rotation Controls
- **WHEN** a player has placed a marble
- **THEN** rotation indicators (arrows) appear on each quadrant
- **AND** clicking an arrow rotates that quadrant

