## ADDED Requirements
### Requirement: LOA AI Opponent
The system SHALL support an AI opponent for Lines of Action with legal move generation and timely responses.

#### Scenario: Play vs AI
- **WHEN** the user starts LOA in Human vs AI mode
- **THEN** the AI side makes a legal move automatically after the human move within 3 seconds under normal device conditions
- **AND** Undo, Save, Load, and Reset continue to function

#### Scenario: AI Side Selection
- **WHEN** the user selects AI mode before starting LOA
- **THEN** they MAY choose whether AI plays Black or White
- **AND** the game starts with turns set accordingly

