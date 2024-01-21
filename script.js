document.addEventListener("DOMContentLoaded", function () {
  // HTML elements
  const board = document.getElementById("game-board");
  const turnDisplay = document.getElementById("turn-display");
  const player1CapturedElement = document.getElementById("player1-captured");
  const player2CapturedElement = document.getElementById("player2-captured");

  // Game state variables
  let currentPlayer = 1;
  let capturedSeedsPlayer1 = 0;
  let capturedSeedsPlayer2 = 0;

  // Initial state of the hollows on the game board
  const hollows = Array.from({ length: 14 }, (_, index) => ({
    seeds: 4,
    owner: index < 7 ? 1 : 2,
  }));

  // Function to render the game board
  function renderBoard() {
    board.innerHTML = "";

    for (let row = 0; row < 2; row++) {
      const rowElement = document.createElement("tr");
      for (let col = 0; col < 7; col++) {
        const index = row * 7 + col;
        const hollow = hollows[index];

        const hollowElement = document.createElement("td");
        hollowElement.classList.add("hollow", `player-${hollow.owner}`);
        hollowElement.textContent = hollow.seeds;

        // Add event listener to make hollows clickable for the current player's turn
        if (
          hollow.owner !== 0 &&
          hollows[index].seeds > 0 &&
          hollow.owner === currentPlayer
        ) {
          hollowElement.addEventListener("click", () => playTurn(index));
          hollowElement.classList.add("selectable");
        }

        // Highlight owned hollows with 0 seeds
        if (hollow.owner !== 0 && hollows[index].seeds === 0) {
          hollowElement.classList.add("owned");
        }

        rowElement.appendChild(hollowElement);
      }
      board.appendChild(rowElement);
    }

    // Display current player's turn and update background color
    turnDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    turnDisplay.style.backgroundColor =
      currentPlayer === 1 ? "#aaffaa" : "#ffaaaa";

    // Display captured seeds for each player
    player1CapturedElement.textContent = capturedSeedsPlayer1;
    player2CapturedElement.textContent = capturedSeedsPlayer2;

    // Check for the end of the game
    checkEndGame();
  }

  // Function to handle a player's turn
  function playTurn(startIndex) {
    let seeds = hollows[startIndex].seeds;
    hollows[startIndex].seeds = 0;

    let currentIndex = startIndex;
    while (seeds > 0) {
      currentIndex = (currentIndex + 1) % 14;
      if (currentIndex !== startIndex || seeds === 1) {
        hollows[currentIndex].seeds += 1;
        seeds -= 1;
      }
      if (seeds === 0) {
        handleCapture(currentIndex);
        if (hollows[currentIndex].seeds === 1) {
          handleLaps(currentIndex);
        }
      }
    }

    // Render the updated game board and switch to the next player's turn
    renderBoard();
    switchPlayer();
  }

  // Function to handle capturing seeds in a hollow
  function handleCapture(index) {
    if (hollows[index].seeds === 4) {
      const capturedSeeds = hollows[index].seeds;
      hollows[index].seeds = 0;

      // Update captured seeds count for the current player
      if (currentPlayer === 1) {
        capturedSeedsPlayer1 += capturedSeeds;
      } else {
        capturedSeedsPlayer2 += capturedSeeds;
      }
    }
  }

  // Function to handle laps, where seeds continue to be distributed
  function handleLaps(index) {
    let currentIndex = index;
    let seeds = hollows[currentIndex].seeds;

    while (seeds === 1) {
      currentIndex = (currentIndex + 1) % 14;
      // Continue distributing seeds in laps until a condition is met
      /*
      if (hollows[currentIndex].seeds === 1) {
        seeds += hollows[currentIndex].seeds;
        hollows[currentIndex].seeds = 0;
      } else {
        break;
      }*/
    }

    // If there are more than 1 seed, continue the turn with the updated index
    if (seeds > 1) {
      playTurn(currentIndex);
    }
  }

  // Function to switch to the next player's turn
  function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
  }

  // Function to check for the end of the game
  function checkEndGame() {
    const player1Hollows = hollows.slice(0, 7);
    const player2Hollows = hollows.slice(7);

    const player1Empty = player1Hollows.every((hollow) => hollow.seeds === 0);
    const player2Empty = player2Hollows.every((hollow) => hollow.seeds === 0);

    // If either player has all hollows empty, end the game
    if (player1Empty || player2Empty) {
      endGame();
    }
  }

  // Function to handle the end of the game
  function endGame() {
    const player1Score = player1CapturedElement.textContent;
    const player2Score = player2CapturedElement.textContent;

    // Display the winner or a draw
    if (player1Score > player2Score) {
      alert("Player 1 wins!");
    } else if (player2Score > player1Score) {
      alert("Player 2 wins!");
    } else {
      alert("It's a draw!");
    }

    // Add additional logic for resetting the game if needed
    resetGame();
  }

  // Function to reset the game state
  function resetGame() {
    // Reset game state variables
    currentPlayer = 1;
    capturedSeedsPlayer1 = 0;
    capturedSeedsPlayer2 = 0;

    // Reset hollows to the initial state
    hollows.forEach((hollow, index) => {
      hollow.seeds = 4;
      hollow.owner = index < 7 ? 1 : 2;
    });

    // Render the initial game board
    renderBoard();
  }

  // Initial rendering of the game board
  renderBoard();
});
