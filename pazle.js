const puzzle = document.getElementById('puzzle');
const message = document.getElementById('message');
let dragSrcEl = null;
let selectedTile = null;

function initPuzzle() {
  puzzle.innerHTML = "";
  message.textContent = "";

  const indices = [...Array(12).keys()];
  shuffle(indices);

  indices.forEach((imgIndex) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.draggable = true;
    tile.dataset.index = imgIndex;

    const img = document.createElement("img");
    img.src = tiles/tile-${String(imgIndex).padStart(2, '0')}.jpg;
    img.alt = Tile ${imgIndex};
    img.dataset.originalIndex = imgIndex; // ذخیره index اصلی برای بررسی

    tile.appendChild(img);
    puzzle.appendChild(tile);
  });

  addEvents();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function addEvents() {
  const tiles = document.querySelectorAll(".tile");

  tiles.forEach(tile => {
    tile.addEventListener("dragstart", function (e) {
      dragSrcEl = this;
      this.classList.add("dragging");
      e.dataTransfer.setData('text/plain', this.dataset.index);
    });

    tile.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("over");
    });

    tile.addEventListener("dragleave", function () {
      this.classList.remove("over");
    });

    tile.addEventListener("drop", function (e) {
      e.preventDefault();
      if (dragSrcEl !== this) {
        swapTiles(dragSrcEl, this);
        checkWin();
      }
      this.classList.remove("over");
    });

    tile.addEventListener("dragend", function () {
      this.classList.remove("dragging", "over");
    });

    tile.addEventListener("touchstart", function (e) {
      e.preventDefault();
      if (!selectedTile) {
        selectedTile = this;
        this.classList.add("selected");
      } else {
        swapTiles(selectedTile, this);
        selectedTile.classList.remove("selected");
        selectedTile = null;
        checkWin();
      }
    });
  });
}

function swapTiles(tile1, tile2) {
  const img1 = tile1.querySelector("img");
  const img2 = tile2.querySelector("img");

  // جابجایی src تصاویر
  const tempSrc = img1.src;
  img1.src = img2.src;
  img2.src = tempSrc;

  // جابجایی dataset.index
  const tempIndex = tile1.dataset.index;
  tile1.dataset.index = tile2.dataset.index;
  tile2.dataset.index = tempIndex;
}

function checkWin() {
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const correct = tiles.every((tile) => {
    const img = tile.querySelector("img");
    const currentIndex = parseInt(tile.dataset.index);
    return parseInt(img.dataset.originalIndex) === currentIndex;
  });

  if (correct) {
    message.innerHTML = "🎉 تبریک! شما پازل را به‌درستی حل کردید!<br>⏳ در حال رفتن به مرحله بعد...";
    setTimeout(showNextStage, 2000);
  }
}

function showNextStage() {
  puzzle.innerHTML = "";
  message.innerHTML = `
    <div class="stage-text">
      <p>این‌بار، اجازه دادم سایه‌اش وارد بوم شود...<br>
      نه از روی ترس، بلکه از خستگی.<br>
      شاید اگر ردپایش را روی کاغذ ببیند، بفهمد که من مدت‌هاست او را دیده‌ام.<br>
      و شاید، فقط شاید، از تعقیبم دست بکشد.</p>
      <button onclick="initPuzzle()">🔁 بازگشت به پازل</button>
    </div>
  `;
}

window.onload = initPuzzle;