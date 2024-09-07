const fruits = [];

// Load fruit images and push them to the array
const imgPaths = [
  "fruit1.png",
  "fruit2.png",
  "fruit3.png",
  "fruit4.png",
  "fruit5.png",
  "fruit6.png",
];
imgPaths.forEach((path) => {
  const img1 = new Image();
  img1.src = `fruits/${path}`;
  fruits.push(img1);

  const img2 = new Image();
  img2.src = `fruits/${path}`;
  fruits.push(img2);
});

let cards = shuffle(fruits.concat(fruits));
let selectedCards = [];
let score = 0;
let timeLeft = 60;
let gameInterval;

const playBtn = document.getElementById("play-icon");
const mainSection = document.querySelector(".mainSection");
const gameContainer = document.getElementById("game-container");
const popupStartBtn = document.getElementById("popup-start-btn");
const startbtn = document.getElementById("startbtn");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const popup = document.querySelector(".popup");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  showPopup(false);

  gameContainer.style.display = "grid";
  document.querySelector(".startMain").style.display = "flex";

  // Reset game state
  resetGameState();
  clearInterval(gameInterval);
  startGameTimer();

  cards = shuffle(fruits.concat(fruits));
  generateCards();

  // Remove any existing event listener before adding
  gameContainer.removeEventListener("click", handleCardClick);
  gameContainer.addEventListener("click", handleCardClick);
}

function resetGameState() {
  timeLeft = 60;
  score = 0;
  selectedCards = [];
  gameContainer.innerHTML = "";
  scoreElement.textContent = `Score: ${score}`;
  timerElement.textContent = `Time Left: ${timeLeft}`;
  startbtn.disabled = true;
}

function showPopup(visible) {
  mainSection.style.display = "none";
  document.querySelector(".popup").style.visibility = visible
    ? "visible"
    : "hidden";
}

function startGameTimer() {
  timerElement.textContent = `Time Left: ${timeLeft}`;
  gameInterval = setInterval(() => {
    // Initiates an interval that triggers a function every second (1000 milliseconds) to update the timer
    timeLeft--;
    timerElement.textContent = `Time Left: ${timeLeft}`;

    if (timeLeft === 0) {
      clearInterval(gameInterval);
      alert("Game Over!");
      startbtn.disabled = false;
    }
  }, 1000);
}

function generateCards() {
  cards.forEach((fruit) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.image = fruit.src;
    card.style.backgroundImage = "none";
    card.textContent = "?";
    gameContainer.appendChild(card);
  });
}

function handleCardClick(e) {
  const card = e.target;

  if (
    !card.classList.contains("card") ||
    card.classList.contains("matched") ||
    selectedCards.includes(card)
  ) {
    return; // Ignore clicks on non-card elements, matched cards, or already selected cards
  }

  card.style.backgroundImage = `url(${card.dataset.image})`;
  card.style.backgroundSize = "cover";
  card.textContent = "";
  selectedCards.push(card);

  if (selectedCards.length === 2) {
    setTimeout(checkMatch, 500);
  }
}

function checkMatch() {
  const [card1, card2] = selectedCards;

  if (card1.dataset.image === card2.dataset.image) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    score += 2;
    scoreElement.textContent = `Score: ${score}`;

    if (score == 24) {
      alert("You won the game!");
      clearInterval(gameInterval);
      timeLeft = 60;
      startbtn.disabled = false;
    }
  } else {
    card1.textContent = "?";
    card2.textContent = "?";
    card1.style.backgroundImage = "none";
    card2.style.backgroundImage = "none";
  }

  selectedCards = [];
}

playBtn.addEventListener("click", () => showPopup(true));
popupStartBtn.addEventListener("click", startGame);
startbtn.addEventListener("click", startGame);
