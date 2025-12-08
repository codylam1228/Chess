## ADDED Requirements
### Requirement: AI Mode Selection
The portal SHALL allow choosing Human vs Human or Human vs AI before launching any game.

#### Scenario: Select AI Opponent
- **WHEN** the user opens the portal landing page
- **THEN** a mode selector offers Human vs Human and Human vs AI options
- **AND** launching a game passes the selected mode to that game

### Requirement: AI Turn Flow Consistency
The portal SHALL ensure games launched in AI mode still provide standard controls and return navigation.

#### Scenario: Return from AI Game
- **WHEN** the user clicks "Menu" while playing in AI mode
- **THEN** the current game closes
- **AND** the portal menu is displayed with the last selected mode preserved or defaulted

