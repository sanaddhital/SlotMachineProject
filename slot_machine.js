// pass every prompt through this prompt-sync package; Dependemcies
const prompt = require("prompt-sync")();


/*Declare global variables*/

const SymbolCount = {
    A: 1,
    B: 1,
    C: 2,
    D: 3
};

const SymbolMultiplier = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
};


const lines = 3;
const reels = 3;

//Step 1: Get the prompt to enter the deposit amoount
const GetDeposit = () => {
    while (true) {
        const Deposit = Number(prompt("Please enter the money you want to deposit: $"));
    //if the user enters non numeric value of negative values, give an error
        if (isNaN(Deposit) || Deposit <= 0) {
            console.log("Please enter a valid amount!!")
        } else {
            return Deposit;
        }
    }
}


// Step 2: Get the prompt to enter the number of lines to bet on
const GetBetLines = (lines) => { // we need lines parameter to check if user wnts to bet on lines more than whats available
    while (true) {
        const NumOfLines = Number(prompt("Please enter the number of lines you want to bet on (1 - " + lines + " ): "));
    //if the user enters non numeric value of negative values, give an error
        if (isNaN(NumOfLines) || NumOfLines <= 0 || NumOfLines > lines) {
            console.log("Please enter a valid number. You can only bet upto " + lines + " Lines" )
        } else {
            return NumOfLines;
        }
    }
}
    

// Step 3: Get the amount user is betting per line
const GetBetAmount = (Balance, NumOfLines) => {
    while (true) {
        const BetAmount = Number(prompt("Please enter the amount per line you want to bet on: $"));
    //if the user enters non numeric value of negative values, give an error
        if (isNaN(BetAmount) || BetAmount <= 0 || BetAmount > parseFloat(Balance / NumOfLines)) {
            console.log("Please enter a valid amount!! You cannot bet amounts exceeding your Total Balance of " + Balance + ".")
        } else {
            return BetAmount;
        }
    }
}

//Ask user if they are ready to spin the reels?
const CheckReady = () => {
    const ready = prompt("Are you ready to spin the reel??? (y/n) ")
    if (ready != 'y') {
        console.log("Take your time!!!")
        process.exit();
    }
    return ready;
}



// Step 4
const spin = () => {
    //Creating an array of all symbols in the reel
    const reelSymbols = []; //we can add values to this array without changing the array itself. So, we can use const.
    for (let key in SymbolCount){
        for (let i=0; i < SymbolCount[key]; i++){
            reelSymbols.push(key);
        }
    }

    //Getting random symbols for our reels individually from the reelSymbols array
    const reelDisplay = []
    for (let i = 0; i < reels; i++) {                       //for a certain ith reel
        reelDisplay.push([]);                               //we push an empty array of symbols. but it will be repeated as many reels there are
        const symbolOptions = [...reelSymbols];             // and we have an array of all our symbols
        for (let j = 0; j< lines; j++) {                                         // for every position j of a reel
            const randomIndex = Math.floor(Math.random() * symbolOptions.length);  // we pick a random Index from symbolOptions
            const randomSymbol = symbolOptions[randomIndex];                     // we get a symbol for that random index

            reelDisplay[i].push(randomSymbol);                                  // we push that symbol in the reel
            symbolOptions.splice(randomIndex, 1);                               // Meanwhile, we remove that from the symbol options
        }
    }
    return reelDisplay;
}


//Step 4 contd...
//Getting the Transpose matrix
    const GetTranspose = (reelDisplay) => {     //using the reelDisplay matrix above as a parameter
        const transpose = []
        for (let i = 0; i< lines; i++) {
           transpose.push([]);                  //for every position of traspose array, creata another nested array
            for (let j = 0; j < reels; j++) {   //for that nested array, loop over again
                transpose[i].push(reelDisplay[j][i]);       //then for each jth nested array within ith array of transpose matrix, we push ith element of jth reelDisplay
            }
        }
    return transpose;
}

// Viewing the reels like it should appear in screen
const printSlotMachine = (transpose) => {
    for(const row of transpose) {           //for each row of our transposed matrix
        let rowString = "";                 //our initial string printed for a row is empty
        for (const[i,symbol] of row.entries()) {    //we are looping through row.entries() array iterator object that contains key/value pair 
                rowString += symbol                 //we will add that symbol to the rowString
                if (i != row.length - 1) {          //if it is not the last element of the row, we add | to space them out
                    rowString += " | "
                }
        }
    console.log(rowString);
    }
}


 //Step 5: Check if the user won
 const checkWinnings = (transpose, BetAmount, NumOfLines) => {
    let winnings = 0;
    for(let row = 0; row < NumOfLines; row++) { //only check on rows where user is betting
       let sameSymbols = true; //start out with the condition that all symbols are same
       for (let position = 0; position < transpose[row].length; position++) {
           let firstItem = transpose[row][0];
           if (transpose[row][position] != firstItem) {  //checking if next value of a line is same as first one
               sameSymbols = false; //If 2nd 3rd or next item in a line is different from the first one, it will give False
               break;  //break the for loop exiting out as sameSymbols = false
           }
       }
           //Step 6: Giving users their winnings 
    if (sameSymbols) { //if same symbols is true, then we get the winnings and add it to the balance
        winnings += SymbolMultiplier[transpose[row][0]] * BetAmount; //winnings is the multiplier * the bet amount
    }
 }
 return winnings;
}





//Main function to run the whole game
const game = () => {
let Balance = GetDeposit();     //take the initial deposit amount

while (true) {
    const NumOfLines = GetBetLines(lines);      //get the number of lines user wants to bet
    const BetAmount = GetBetAmount(Balance, NumOfLines);  //get the bet amount
    console.log("You are betting $"+ BetAmount + " on " + NumOfLines +" Lines");  //print out the info to the user about what they are going to do 
    const ready = CheckReady();     //geting confirmation from the user to make sure they are ready for the consequences of the bet

    const reelDisplay = spin();     //get the symbols in the reel
    const transpose = GetTranspose(reelDisplay);    //Transpose the 2D-matrix
    printSlotMachine(transpose);                //View the resulting symbols to the user

    Balance -= BetAmount * NumOfLines;          //deducting the bet amounts bets

    winnings = checkWinnings(transpose, BetAmount, NumOfLines); //declare the winnings
    if (winnings == 0) {            //Give remark to user about the winning
        console.log("Whats up with your luck bro. You didn't win a dime this time : (")
    } else {
        console.log("Congratulations : ) ! You won $" + winnings);
    }

    Balance += winnings;            //add the winnings to the balance
    console.log("Your new balance is " + Balance); //Final balance after adding the winnings and subtracting the lost bet.

    const playAgain = prompt ("Do you want to keep on playing (y/n)? "); //ask user if they want to continue
    if (playAgain != "y") break;                                         //if they say "y", reload the while loop

    if (Balance <= 0) {                                                 // make sure the balance is not 0 after the game
        console.log("You have no more money. Get yo broke ass earn some money instead of gambling");
        break;
        }
    }
}


game();             ///RUN THE WHOLE GAME

