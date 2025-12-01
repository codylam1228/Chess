## ADDED Requirements
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

