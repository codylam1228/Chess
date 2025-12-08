## ADDED Requirements
### Requirement: Pentago AI Opponent
The system SHALL support an AI opponent for Pentago with legal move generation (placement and rotation) and timely responses.

#### Scenario: Play vs AI
- **WHEN** the user starts Pentago in Human vs AI mode
- **THEN** the AI side places a marble and performs a quadrant rotation automatically after the human move within 3 seconds under normal device conditions
- **AND** Undo, Save, Load, and Reset continue to function

#### Scenario: AI Side Selection
- **WHEN** the user selects AI mode before starting Pentago
- **THEN** they MAY choose whether AI plays first or second
- **AND** the game starts with turns set accordingly

