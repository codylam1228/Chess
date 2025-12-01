// Main Entry Point
console.log('Game Portal Initialized');

const gameContainer = document.getElementById('game-container');
const buttons = document.querySelectorAll('.game-card');
let currentGame = null;

// Dynamic Import Handler
async function loadGame(gameName) {
  gameContainer.innerHTML = '<p>Loading...</p>';
  
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
    if (gameName === 'chess') {
        module = await import('../games/chess/ui.js');
        currentGame = new module.ChessUI(gameContainer);
    } else if (gameName === 'loa') {
        module = await import('../games/loa/ui.js');
        currentGame = new module.LOAUI(gameContainer);
    } else if (gameName === 'xiangqi') {
        module = await import('../games/xiangqi/ui.js');
        currentGame = new module.XiangqiUI(gameContainer);
    }

  } catch (err) {
    console.error(err);
    gameContainer.innerHTML = `<p>Error loading ${gameName}</p>`;
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Use currentTarget to get the button, not child element
    const btn = e.currentTarget;
    const game = btn.dataset.game;
    // Hide selector
    document.querySelector('.game-selector').classList.add('hidden');
    loadGame(game);
  });
});
