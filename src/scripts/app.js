// Main Entry Point
console.log('Game Portal Initialized');

const gameContainer = document.getElementById('game-container');
const gameSelector = document.querySelector('.game-selector');
const buttons = document.querySelectorAll('.game-card');
let currentGame = null;

// Event Bus for Return
document.addEventListener('game-return', () => {
  const gameWrapper = document.getElementById('active-game-wrapper');
  if (gameWrapper) {
    gameWrapper.innerHTML = '';
    gameWrapper.classList.add('hidden');
  }
  gameSelector.classList.remove('hidden');
  currentGame = null;
});

async function loadGame(gameName) {
  // Hide selector
  gameSelector.classList.add('hidden');
  
  // Create or reuse a wrapper for the game
  let gameWrapper = document.getElementById('active-game-wrapper');
  if (!gameWrapper) {
    gameWrapper = document.createElement('div');
    gameWrapper.id = 'active-game-wrapper';
    gameContainer.appendChild(gameWrapper);
  }
  gameWrapper.innerHTML = '<p>Loading...</p>';
  gameWrapper.classList.remove('hidden');
  
  try {
    // Load styles
    if (!document.getElementById(`style-${gameName}`)) {
      const link = document.createElement('link');
      link.id = `style-${gameName}`;
      link.rel = 'stylesheet';
      link.href = `./src/styles/${gameName}.css`;
      document.head.appendChild(link);
    }

    // Load Module
    let module;
    // We don't pass onReturn anymore, we rely on CustomEvent
    
    if (gameName === 'chess') {
        module = await import('../games/chess/ui.js');
        currentGame = new module.ChessUI(gameWrapper);
    } else if (gameName === 'loa') {
        module = await import('../games/loa/ui.js');
        currentGame = new module.LOAUI(gameWrapper);
    } else if (gameName === 'xiangqi') {
        module = await import('../games/xiangqi/ui.js');
        currentGame = new module.XiangqiUI(gameWrapper);
    }

  } catch (err) {
    console.error(err);
    gameWrapper.innerHTML = `<p>Error loading ${gameName}</p><button onclick="location.reload()">Reload</button>`;
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = e.currentTarget;
    const game = target.dataset.game;
    loadGame(game);
  });
});
