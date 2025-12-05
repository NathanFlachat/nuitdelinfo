'use strict';

(function () {
  const GRID_WIDTH = 40;
  const GRID_HEIGHT = 4;
  const SNAKE_CELL = 1;
  const FOOD_CELL = 2;
  const INITIAL_SNAKE_LENGTH = 4;
  const BRAILLE_SPACE = '\u2800';

  const UP = { x: 0, y: -1 };
  const DOWN = { x: 0, y: 1 };
  const LEFT = { x: -1, y: 0 };
  const RIGHT = { x: 1, y: 0 };

  let grid = null; 
  let snake = [];
  let currentDirection = RIGHT;
  let moveQueue = [];
  let hasMoved = false;
  let gamePaused = false;
  let urlRevealed = false;
  let whitespaceReplacementChar = null;

  const $ = (sel) => document.querySelector(sel);

  function main() {
    try {
      detectBrowserUrlWhitespaceEscaping();
      cleanUrl();
      setupEventHandlers();
      drawMaxScore();
      initUrlRevealed();
      startGame();

      let lastFrameTime = performance.now();
      function frameHandler(now) {
        if (!gamePaused && now - lastFrameTime >= tickTime()) {
          updateWorld();
          drawWorld();
          lastFrameTime = now;
        }
        requestAnimationFrame(frameHandler);
      }
      requestAnimationFrame(frameHandler);
    } catch (err) {
      console.error('snake main error', err);
    }
  }

  function ensureGrid() {
    const total = GRID_WIDTH * GRID_HEIGHT;
    grid = new Array(total);
    grid.fill(null);
  }

  function startGame() {
    ensureGrid();
    snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      const x = i;
      const y = 2;
      snake.unshift({ x, y });
      setCellAt(x, y, SNAKE_CELL);
    }
    currentDirection = RIGHT;
    moveQueue = [];
    hasMoved = false;
    dropFood();
  }

  function cleanUrl() {
    history.replaceState(null, null, location.pathname.replace(/\b\/$/, ''));
  }

  function detectBrowserUrlWhitespaceEscaping() {
    history.replaceState(null, null, '#' + BRAILLE_SPACE + BRAILLE_SPACE);
    if (location.hash.indexOf(BRAILLE_SPACE) === -1) {
      const replacementData = pickWhitespaceReplacementChar();
      whitespaceReplacementChar = replacementData[0];
      const note = $('#url-escaping-note');
      const desc = $('#replacement-char-description');
      if (note && desc) {
        note.classList.remove('invisible');
        desc.textContent = replacementData[1];
      }
    }
  }

  function setupEventHandlers() {
    const directionsByKey = new Map([
      [37, LEFT], [38, UP], [39, RIGHT], [40, DOWN], 
      [87, UP], [65, LEFT], [83, DOWN], [68, RIGHT],
      [75, UP], [72, LEFT], [74, DOWN], [76, RIGHT]
    ]);

    window.addEventListener('keydown', (ev) => {
      if (ev.repeat) return; 
      const dir = directionsByKey.get(ev.keyCode);
      if (dir) {
        ev.preventDefault(); 
        changeDirection(dir);
      }
    }, { passive: false });

    const upBtn = $('#up'), downBtn = $('#down'), leftBtn = $('#left'), rightBtn = $('#right');
    attachPointerDirection(upBtn, UP);
    attachPointerDirection(downBtn, DOWN);
    attachPointerDirection(leftBtn, LEFT);
    attachPointerDirection(rightBtn, RIGHT);

    document.addEventListener('visibilitychange', () => {
      gamePaused = document.hidden;
      if (gamePaused) {
        try { history.replaceState(null, null, (location.hash || '') + '[paused]'); } catch (e) {}
      } else {
        drawWorld();
      }
    });

    document.querySelectorAll('.expandable').forEach(function (expandable) {
      const expand = expandable.querySelector('.expand-btn');
      const collapse = expandable.querySelector('.collapse-btn');
      const content = expandable.querySelector('.expandable-content');
      if (!expand || !collapse || !content) return;
      expand.onclick = collapse.onclick = function () {
        expand.classList.remove('hidden');
        content.classList.remove('hidden');
        expandable.classList.toggle('expanded');
      };
      expandable.ontransitionend = function () {
        const expanded = expandable.classList.contains('expanded');
        expand.classList.toggle('hidden', expanded);
        content.classList.toggle('hidden', !expanded);
      };
    });

    const reveal = $('#reveal-url');
    if (reveal) {
      reveal.addEventListener('click', (e) => {
        e.preventDefault();
        setUrlRevealed(!urlRevealed);
      });
    }
  }

  function attachPointerDirection(buttonEl, direction) {
    if (!buttonEl) return;
    const onPointerDown = (e) => {
      e.preventDefault();
      changeDirection(direction);
    };
    buttonEl.addEventListener('pointerdown', onPointerDown);
  }

  function changeDirection(newDir) {
    const lastDir = moveQueue[0] || currentDirection;
    const opposite = newDir.x + lastDir.x === 0 && newDir.y + lastDir.y === 0;
    if (!opposite) {
      if (moveQueue.length < 8) moveQueue.unshift(newDir);
    }
    hasMoved = true;
  }

  function updateWorld() {
    if (moveQueue.length) {
      currentDirection = moveQueue.pop();
    }

    const head = snake[0];
    const tail = snake[snake.length - 1];
    const newX = head.x + currentDirection.x;
    const newY = head.y + currentDirection.y;

    const outOfBounds = newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT;
    const collidesWithSelf = cellAt(newX, newY) === SNAKE_CELL && !(newX === tail.x && newY === tail.y);

    if (outOfBounds || collidesWithSelf) {
      endGame();
      startGame();
      return;
    }

    const eatsFood = cellAt(newX, newY) === FOOD_CELL;
    if (!eatsFood) {
      const removed = snake.pop();
      if (removed) setCellAt(removed.x, removed.y, null);
    }

    setCellAt(newX, newY, SNAKE_CELL);
    snake.unshift({ x: newX, y: newY });

    if (eatsFood) {
      dropFood();
    }
  }

  function drawWorld() {
    const hash = '#|' + gridString() + '|[score:' + currentScore() + ']';

    if (urlRevealed) {
      const urlEl = $('#url');
      if (urlEl) {
        urlEl.textContent = location.href.replace(/#.*$/, '') + hash;
      }
    }

    let encodedHash = hash;
    if (whitespaceReplacementChar) {
      encodedHash = hash.replace(new RegExp(BRAILLE_SPACE, 'g'), whitespaceReplacementChar);
    }

    try {
      history.replaceState(null, null, encodedHash);
      if (decodeURIComponent(location.hash || '') !== encodedHash) {
        location.hash = encodedHash;
      }
    } catch (e) {
      location.hash = encodedHash;
    }
  }

  function gridString() {
    let str = '';
    for (let x = 0; x < GRID_WIDTH; x += 2) {
      const n =
        (bitAt(x, 0) << 0) |
        (bitAt(x, 1) << 1) |
        (bitAt(x, 2) << 2) |
        (bitAt(x + 1, 0) << 3) |
        (bitAt(x + 1, 1) << 4) |
        (bitAt(x + 1, 2) << 5) |
        (bitAt(x, 3) << 6) |
        (bitAt(x + 1, 3) << 7);
      str += String.fromCharCode(0x2800 + n);
    }
    return str;
  }

  function currentScore() {
    return Math.max(0, snake.length - INITIAL_SNAKE_LENGTH);
  }

  function endGame() {
    const score = currentScore();
    const maxScore = parseInt(localStorage.maxScore || '0', 10) || 0;
    if (score > 0 && score > maxScore && hasMoved) {
      localStorage.maxScore = score;
      localStorage.maxScoreGrid = gridString();
      drawMaxScore();
      showMaxScore();
    }
  }

  function drawMaxScore() {
    const maxScore = localStorage.maxScore;
    if (maxScore == null) return;
    const maxScorePoints = (maxScore == 1) ? '1 point' : (maxScore + ' points');
    const maxScoreGrid = localStorage.maxScoreGrid || '';

    const elPoints = $('#max-score-points');
    const elGrid = $('#max-score-grid');
    if (elPoints) elPoints.textContent = maxScorePoints;
    if (elGrid) elGrid.textContent = maxScoreGrid;
    const container = $('#max-score-container');
    if (container) container.classList.remove('hidden');

    const share = $('#share');
    if (share) {
      share.onclick = function (e) {
        e.preventDefault();
        shareScore(maxScorePoints, maxScoreGrid);
      };
    }
  }

  function showMaxScore() {
    if ($('#max-score-container.expanded')) return;
    const btn = $('#max-score-container .expand-btn');
    if (btn) btn.click();
  }

  function shareScore(scorePoints, gridStr) {
    const message = '|' + gridStr + '| Got ' + scorePoints + ' playing this stupid snake game on the browser URL!';
    const canonicalEl = $('link[rel=canonical]');
    const url = canonicalEl ? canonicalEl.href : location.href;
    if (navigator.share) {
      navigator.share({ text: message, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(message + '\n' + url)
        .then(() => showShareNote('copied to clipboard'))
        .catch(() => showShareNote('clipboard write failed'));
    } else {
      try {
        window.prompt('Copy this message', message + '\n' + url);
      } catch (e) {}
    }
  }

  function showShareNote(message) {
    const note = $('#share-note');
    if (!note) return;
    note.textContent = message;
    note.classList.remove('invisible');
    setTimeout(() => note.classList.add('invisible'), 1000);
  }

  function idx(x, y) {
    return (x % GRID_WIDTH) + y * GRID_WIDTH;
  }

  function cellAt(x, y) {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return null;
    return grid[idx(x, y)];
  }

  function setCellAt(x, y, value) {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return;
    grid[idx(x, y)] = value;
  }

  function bitAt(x, y) {
    return cellAt(x, y) ? 1 : 0;
  }

  function dropFood() {
    const total = GRID_WIDTH * GRID_HEIGHT;
    const emptyCount = total - snake.length;
    if (emptyCount <= 0) return;

    let target = Math.floor(Math.random() * emptyCount);
    for (let i = 0; i < grid.length; i++) {
      if (grid[i] === SNAKE_CELL) continue;
      if (target === 0) {
        grid[i] = FOOD_CELL;
        return;
      }
      target--;
    }

    for (let i = 0; i < grid.length; i++) {
      if (grid[i] == null) {
        grid[i] = FOOD_CELL;
        return;
      }
    }
  }

  function tickTime() {
    const start = 125;
    const end = 75;
    const raw = start + snake.length * (end - start) / (GRID_WIDTH * GRID_HEIGHT);
    return Math.max(40, Math.min(start, Math.round(raw))); 
  }

  function pickWhitespaceReplacementChar() {
    const candidates = [
      ['૟', 'strange symbols'],
      ['⟋', 'some weird slashes']
    ];

    const N = 5;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '30px system-ui';
    const targetWidth = ctx.measureText(BRAILLE_SPACE.repeat(N)).width;

    for (let i = 0; i < candidates.length; i++) {
      const char = candidates[i][0];
      const str = char.repeat(N);
      const width = ctx.measureText(str).width;
      const similarWidth = Math.abs(targetWidth - width) / targetWidth <= 0.1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText(str, 0, 30);
      const pixelData = ctx.getImageData(0, 0, Math.max(1, Math.floor(width)), 30).data;
      const totalPixels = pixelData.length / 4;
      let coloredPixels = 0;
      for (let j = 0; j < totalPixels; j++) {
        const alpha = pixelData[j * 4 + 3];
        if (alpha !== 0) coloredPixels++;
      }
      const notTooDark = coloredPixels / totalPixels < 0.15;

      if (similarWidth && notTooDark) return candidates[i];
    }
    return ['░', ''];
  }

  function initUrlRevealed() {
    setUrlRevealed(Boolean(localStorage.getItem('urlRevealed')));
  }

  function setUrlRevealed(value) {
    urlRevealed = value;
    const container = $('#url-container');
    if (container) container.classList.toggle('invisible', !urlRevealed);
    if (urlRevealed) {
      localStorage.setItem('urlRevealed', 'y');
    } else {
      localStorage.removeItem('urlRevealed');
    }
  }

  function shareScoreWrapper(scorePoints, gridStr) {
    shareScore(scorePoints, gridStr);
  }

  main();

})();
