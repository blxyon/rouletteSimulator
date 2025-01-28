# Roulette Wheel Game

A simple **roulette game** using **HTML, CSS, and JavaScript**. Players bet on a color (Red, Black, or Green) and spin the wheel to see if they win.

---

## Features

- **European Roulette Wheel**: 37 slots (Red, Black, Green).
- **Betting**: Choose a color and enter a bet amount.
- **Spin Animation**: Spins with a deceleration effect.
- **Balance and History**: Tracks player balance and recent outcomes.

---

## How It Works

1. **Place a Bet**: Choose a color and enter the bet amount.
2. **Spin the Wheel**: The wheel spins, slowing down to reveal the outcome.
3. **Win or Lose**: If the outcome matches your bet, you win (14x for Green, 2x for Red/Black). Your balance is updated.
4. **History**: Shows the last 5 outcomes.

---

## Key Functions

- **`renderWheel()`**: Updates the wheel display.
- **`getRouletteOutcome()`**: Randomly selects the outcome.
- **`stopSpinningSmoothly(outcome)`**: Decelerates the wheel to land on the outcome.
- **`updateBalance()`**: Updates the player's balance.
- **`updateHistory(color)`**: Displays the last 5 outcomes.

---

## Run the Game

1. Clone or download the project.
2. Open **`index.html`** in a browser.
3. Start playing!

---

## License

Free to use and modify.
