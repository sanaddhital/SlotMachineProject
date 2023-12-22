
/*Declare global variables*/

const SymbolCount = {
    A: 1,
    B: 2,
    C: 3,
    D: 4
};

const SymbolMultiplier = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};

const lines = 4;
const reels = 3;





// pass every prompt through this prompt-sync package
const prompt = require("prompt-sync")();

//Step 1: Get the prompt to enter the deposit amoount
var Balance = Number(prompt("Please enter the money you want to deposit: "));

// Step 2: Get the prompt to enter the number of lines to bet on
var NumOfLines = Number(prompt("Please enter the number of lines you want to bet on: "));

// Step 3: Get the amount user is betting per line
var BetAmount = Number(prompt("Please enter the amount per line you want to bet on: "));

console.log("You are betting $"+ BetAmount + " on " + NumOfLines +" Lines");


//Ask user if they are ready to spin the reels?
const ready = prompt("Are you ready to spin the reel??? (y/n)")
if (ready != 'y') {
    console.log("Take your time!!!")
process.exit();
}






//Creating an array of all symbols in the reel
const reelSymbols = [];
for (var key in SymbolCount){
    for (let i=0; i < SymbolCount[key]; i++){
        reelSymbols.push(key);
};
};
console.log("Here are the available symbols in the reel " + reelSymbols);


//Getting random symbols for our reels individually from the reelSymbols array
var reelDisplay = []
for (i = 0; i < reels; i++) {
    reelDisplay[i] = []
    for (let j = 0; j< lines; j++) {
        reelDisplay[i].push(reelSymbols[Math.floor(Math.random() * reelSymbols.length)]);
};
};


//Step 4: Viewing the reels like it should appear in screen
var transpose = []
console.log("Here is your result")


for (let i = 0; i< lines; i++) {
    transpose[i] = []
    for (let j = 0; j < reels; j++) {
        transpose[i][j] = reelDisplay[j][i];
    }
    console.log(transpose[i][0]+ " | " + transpose[i][1] 
    + " | " + transpose[i][2]);
};

 //Step 5: Check if the user won
 let winnings = 0;
 for(let i = 0; i < NumOfLines; i++) {
    let sameSymbols = true; //start out with the condition that all symbols are same
    for (let j = 0; j < transpose[i].length; j++) {
        let firstItem = transpose[i][0];
        if (transpose[i][j] != firstItem) {  //checking if next value of a line is same as first one
            sameSymbols = false; //If 2nd 3rd or next item in a line is different from the first one, it will give False
            break;  //break the for loop exiting out as sameSymbols = false
        }
    }
    
    //Step 6: Giving users their winnings and deducting the lost bets
    if (sameSymbols) { //if same symbols is true, then we get the winnings and add it to the balance
        winnings += SymbolMultiplier[transpose[i][0]] * BetAmount; //winnings is the multiplier * the bet amount
        Balance += winnings;
        console.log("Congratulations! You won $" + winnings + " on line " + Number(i+1));
    }
    else { //if sameSymbols = false, there is no winning and BetAmount for that line is subtracted
        Balance -= BetAmount
        console.log("You lost your $" + BetAmount + " bet on line " + Number(i+1));
    }
};
console.log("Your new balance is " + Balance); //Final balance after adding the winnings and subtracting the lost bet.
