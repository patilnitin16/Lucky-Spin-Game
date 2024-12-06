const prompt = require("prompt-sync")();

const ROW = 3;
const COL = 3;

const SYMBOL_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUE = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const deposit = () => {
  while (true) {
    let depositAmount = prompt("Enter the Deposit Amount : ");
    let depositNum = parseFloat(depositAmount);

    if (isNaN(depositNum) || depositNum <= 0) {
      console.log("Invalid Amount , please try again.");
    } else {
      return depositNum;
    }
  }
};

const numberOfLine = () => {
  while (true) {
    let lines = prompt("Enter number of lines to Bet (1-3) : ");
    let linesNum = parseInt(lines);
    if (isNaN(linesNum) || linesNum <= 0 || linesNum > 3) {
      console.log("Invalid number of Lines, Please try again");
    } else {
      return linesNum;
    }
  }
};

const amountToBet = (depositBal, lines) => {
  while (true) {
    let betAmount = prompt("Enter the Bet Amount per line : ");
    let betAmountNo = parseFloat(betAmount);
    if (
      isNaN(betAmountNo) ||
      betAmountNo <= 0 ||
      betAmount > depositBal / lines
    ) {
      console.log("Invalid Bet Amount,Please Try Again");
    } else {
      return betAmountNo;
    }
  }
};

const spin = () => {
  let symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COL; i++) {
    reels.push([]);
    const reelSymbol = [...symbols];
    for (let j = 0; j < ROW; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbol.length);
      const selectedIndex = reelSymbol[randomIndex];
      reels[i].push(selectedIndex);
      reelSymbol.splice(selectedIndex, 1);
    }
  }
  return reels;
};

const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROW; i++) {
    rows.push([]);
    for (let j = 0; j < COL; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
};

const finalrow = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const win = (rows, betAmount, noOfLines) => {
  let winning = 0;

  for (let row = 0; row < noOfLines; row++) {
    let symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) {
      winning += betAmount * SYMBOL_VALUE[symbols[0]];
    }
  }
  return winning;
};

const game = () => {
  let depositBal = deposit();

  while (true) {
    const noOfLines = numberOfLine();
    const betAmount = amountToBet(depositBal, noOfLines);
    depositBal -= betAmount * noOfLines;
    let spins = spin();
    let rows = transpose(spins);
    finalrow(rows);
    let winningAmt = win(rows, betAmount, noOfLines);
    console.log("Your Won : " + winningAmt);
    depositBal += winningAmt;
    console.log("Balance Remaining : " + depositBal);
    console.log("--------------------------------------------------");

    if (depositBal <= 0) {
      console.log("You ran out of Money!");
      console.log("--------------------------------------------------");
      break;
    }
  }
};

game();
