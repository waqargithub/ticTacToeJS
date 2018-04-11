//--------------  Begin Global variables  ---------------

//Variables to store numbers of wins, ties
	var xWins = 0;
	var oWins = 0;
	var ties = 0;

	var currentLetter = ""; //Letter to be placed on grid in the next move
	var computersLetter = "";		//Letter assigned to computer in play computer mode
	var playersLetter = "";
	var computerGoesFirst = false; //used to track turns for who goes first
	
	var gameOver = false; //Used to prevent any moves after game is over

	//Keep count of number of moves. Used to determine tie, or for computer move calculation
	var moveCounter = 0;
	
	var moveHistory = new Array(9); //Keeps track of square used for each move. Letter not tracked.
	
	
	//An array to Keep track of letter in each square of grid. Grid squares are numbered as follows:
	/*
	 *  0	1	2
	 *	3	4	5
	 *	6	7	8
	 */
	var grid = new Array(9).fill("");		
	
	
	//An array of three objects. Each object describes the current status of corresponding row.
	//When a letter is placed in empty row, that row is given type of that letter and its count set to 1
	//to track that only one of that letter is in that row. When a second of the same type of letter
	//placed in a row, type stays unchanged and count increments to 2, and, on third time, to 3.
	//When a letter is placed in a row that already has the opposite letter--type of row is
	//different than current letter--then row given a type = T for tie.
	var rows = [
				{type: "", count: 0},
				{type: "", count: 0},
				{type: "", count: 0}
				 ];

	//Serves same function as array for rows above, but keep track of columns.	
	var columns = [
				{type: "", count: 0},
				{type: "", count: 0},
				{type: "", count: 0}
				 ];

	//Keep track of type and count for downDiagonal--diagonal from square0 to 22	
	var downDiagonal = {type: "", count: 0};

	//Keep track of type and count for upDiagonal--diagonal from square6 to 02	
	var upDiagonal = {type: "", count: 0};
	
	//Stores player mode. Used to determine when playing against computer and when
	//program should make a move
	var playerMode = "";
	
	//Set to novice or expert by user upon selecting playComputer mode
	//Affects whether move made by computer are for novice or expert player
	var difficultyLevel = "";

//--------------  End Global variables  ---------------


// ------------------  Begin Functions  ----------------------------


// ---------------  Begin Functions to Set Up Game  ----------------


// ---------------  Begin Function getPlayerMode  --------------

//Function to read radio buttons from web page and get playerMode	
function getPlayerMode() {

	//if two players playing each other, return the mode and set current letter to X
	if (document.getElementById("2playersHere").checked == true) {
		currentLetter = "X";
		
		//Display whose move it is
	  updateCaption(currentLetter+"'s move.");		
		return "2playersHere";
	}
	
	//if one player playing against computer, return the mode, set up variables to
	//play computer, get difficulty level from range
	else if (document.getElementById("playComputer").checked == true) {
		difficultyLevel = document.getElementById("difficultyLevelRange").value;
		
		//Let player go first except in expert mode
		if (difficultyLevel < 2)
			computerGoesFirst = false;
		else
			computerGoesFirst = true;			
		setUpToPlayComputer();
		return "playComputer";
	}
	
	//if two players playing each other from different machines, return that mode.
	//This option not yet exposed and is for future.
	else if (document.getElementByName("playerMode")[2].checked) {
		playerMode = "2playersSeparate";
		return "2playersSeparate";
	}
}	

// ---------------  End Function getPlayerMode  ----------------


// --------------- Begin Function setup2PlayersHere ------------

function setUp2PlayersHere() {
	
	//Hide difficulty level selector if 2 players here
	document.getElementById('difficultyLevelDiv').style.display = "none";
}

// ---------  Begin Function dispalyDifficultyLevelSwitch  -----

function updateCaption(newCaption) {
	document.getElementById("gameCaption").innerHTML = newCaption;
}

// ---------  Begin Function dispalyDifficultyLevelSwitch  -----

//Displays the difficulty selection switch if playComputer mode is selected
function displayDifficultyLevelRange() {
	document.getElementById('difficultyLevelDiv').style.display = "block";
	
	//Displaying difficulty level selector causes Play Button to move further
	//down. Remove future, grayed-out option from display so that user does not
	//have to scroll down to click on Play button on mobile devices/smaller screens
	if (window.innerHeight < 500) {
		document.getElementById('2playersSeparateDiv').style.display = "none";
	}
}

// ---------  End Function dispalyDifficultyLevelSwitch  -------


// ---------  Begin Function setUpToPlayComputer  --------------

//Function to set up grid and variables for a game against computer
function setUpToPlayComputer() {
	
		computersLetter = "X"; //Computer takes X.
		playersLetter = "O";
		
		//If computer goes first then make first move and update all variables.
		if (computerGoesFirst) {
			//To make first move, set square0 to computer's letter, which is X
			document.getElementById("square0").innerHTML = computersLetter;
			
			//Record that the first move occupied square0
			moveHistory[0] = 0;
			
			//Record that square0 has X
			grid[0] = computersLetter;
			
			//increment count of moves
			moveCounter++;
			
			//Since first move in square0, set row 0 count to 1, type to X
			rows[0].count = 1;
			rows[0].type = computersLetter;
			
			//Since first move in square0, set column 0 count to 1, type to X
			columns[0].count = 1;
			columns[0].type = computersLetter;
			
			//Since first move in square0, set downDiagonal count to 1, type to X		
			downDiagonal.count = 1;
			downDiagonal.type = computersLetter;			
		}

		
		//Set up for players's move. Set current letter--the move about to occur--to O.
		currentLetter = playersLetter; 

		//update whose move it is
	  updateCaption("Computer is X. " + currentLetter+"'s move.");
		
}

// ---------  End Function setUpToPlayComputer  ----------------


// ---------  Begin Function openModal  ------------------------

//Function that opens modal that holds tic tac toe grid. Announce whose move it is.
function openModal() {
  document.getElementById('ticTacToeModal').style.display = "block";
}

// ---------  End Function openModal  --------------------------

// ---------------  End Functions to Set Up Game  ---------------------------



//-------------  Begin Functions that process the game  -------------------------



// ---------  Begin Function updateGameStatus  --------------

//Function called when player clicks a square, or when computer makes move
//to put a letter on grid. Arguments: element is square/div to which letter will be written.
//SquareNumber is index of square to be modified.
//First row has squares  0 1 2
//Second row has squares 3 4 5
//Third row has squares  6 7 8

function updateGameStatus(squareNumber) {
	
	//Proceed only if element holding square is empty and game not over
	if ( (grid[squareNumber] == "") && (gameOver == false) ) {
		
		//Construct string for squareID
		squareID = "square" + squareNumber;
			
		//get reference to the element of grid which must be populated e.g. the Div with id="square0"
		elementToUpdate = document.getElementById(squareID);	

		writeCurrentLetterToGrid(elementToUpdate);	
		updateGameVariables(squareNumber);
		
		//update displayed message for whose move it is	
		var newCaption = currentLetter+"'s move.";
		updateCaption(newCaption);

		//Check if the last move resulted in a win, which can only happen when moveCounter>4		
		if (moveCounter > 4) {
			checkGameOver(squareNumber);
		}
		//If game not over, playerMode is to play computer, and its now computers move
		if ( (!gameOver) && (playerMode == "playComputer") && (currentLetter == computersLetter) ) {

			//Call function that calculates and completes computers next move
			makeMove();
		}
	}
}

// ---------  End Function updateGameStatus  --------------


// ---------  Begin Function writeCurrentLetterToGrid  ----

function writeCurrentLetterToGrid(element) {
	//Set empty square to currentLetter--the letter for the current move		
	element.innerHTML = currentLetter;	
}

// ---------  End Function writeCurrentLetterToGrid  ----



// ---------  Begin Function getRowNumberForSquare

function getRowNumberForSquare(squareNumber) {
	return (Math.floor(squareNumber/3));
}

// ---------  End Function getRowNumberForSquare-


// ---------  Begin Function getColNumberForSquare

function getColNumberForSquare(squareNumber) {
	return (squareNumber%3);
}

// ---------  End Function getColNumberForSquare-


// ---------  Begin Function updateGameVariables----

//update variables required to track, process game
function updateGameVariables(squareNumber) {
	
	//Record in grid that current letter put in the square number being modified
	grid[squareNumber] = currentLetter;
	
	//Calculate row and columns for this square
	var squaresRow = getRowNumberForSquare(squareNumber); //Math.floor(squareNumber/3);
	var squaresColumn = getColNumberForSquare(squareNumber); //squareNumber%3;	
			
	//Record in move history which square was modified. Index of first move is zero.
	moveHistory[moveCounter] = squareNumber;
			
	//If it's a blank row then set row type to current letter, set count to 1
	if (rows[squaresRow].type == "") {
		rows[squaresRow].type = currentLetter;
		rows[squaresRow].count = 1;
	}
			
	//If row not blank but of same type as currentLetter, leave its type unchanged
	//Increment its count.
	else if (rows[squaresRow].type == currentLetter) {
		rows[squaresRow].count = rows[squaresRow].count+1;
	}
			
	//If not an empty row and row type different than current letter
	//Set type to T (if not already T) to indicate this row cannot result in a win, is tied
	else if (rows[squaresRow].type != "T")  {
		rows[squaresRow].type = "T";
	}
			
	//If it's a blank column then set column type to current letter, set count to 1
	if (columns[squaresColumn].type == "") {
		columns[squaresColumn].type = currentLetter;
		columns[squaresColumn].count = 1;
	}

	//If column not blank but of same type as currentLetter, leave its type unchanged
	//Increment its count.
	else if (columns[squaresColumn].type == currentLetter) {
		columns[squaresColumn].count = columns[squaresColumn].count+1;
	}

	//If not an empty column and column type different than current letter
	//Set type to T (if not already T) to indicate this column cannot result in a win, is tied
	else if (columns[squaresColumn].type != "T") {
		columns[squaresColumn].type = "T";
	}
			
	//if it is a square that is part of downDiagonal
	if ( onDownDiagonal(squareNumber) ) {
				
		//If downDiagonal is empty then set type to current letter, set count to 1				
		if (downDiagonal.type == "") {
			downDiagonal.type = currentLetter;
			downDiagonal.count = 1;
		}
				
		//If downDiagonal not blank but of same type as currentLetter, leave its type unchanged
		//Increment its count. 				
		else if (downDiagonal.type == currentLetter) {
			downDiagonal.count = downDiagonal.count+1;
		}

		//If downDiagonal not empty and its type different than current letter
		//Set type to T (if not already T) to indicate downDiagonal cannot result in a win, is tied
		else if (downDiagonal.type != "T") {
			downDiagonal.type = "T";
		}
	}

	//if it is a square that is part of upDiagonal
		if ( onUpDiagonal(squareNumber) ) {

		//If upDiagonal is empty then set type to current letter, set count to 1	
		if (upDiagonal.type == "") {
			upDiagonal.type = currentLetter;
			upDiagonal.count = 1;
		}

		//If upDiagonal not blank but of same type as currentLetter, leave its type unchanged
		//Increment its count.
		else if (upDiagonal.type == currentLetter) {
			upDiagonal.count = upDiagonal.count+1;
		}

		//If upDiagonal not empty and its type different than current letter
		//Set type to T (if not already T) to indicate upDiagonal cannot result in a win, is tied
		else if (upDiagonal.type != "T") {
			upDiagonal.type = "T";
		}
	}

	//increment count of number of moves. After first move, moveCounter is 1.	
	moveCounter++;
	
	//check if 9 moves have been made. In that case, grid full and game over.
	if (moveCounter == 9) {
		gameOver = true;
	}
	//All variables are now updated.
	
	//Toggle letter to prepare for next move
	if (currentLetter == "X")
		currentLetter = "O";
	else
		currentLetter = "X";
				
}

// ---------  End Function updateGameVariables  ----


// ---------  Begin Function onDownDiagonal  ----

function onDownDiagonal(i) {
	
	//Returns true if square number i is on downDiagonal
	//if it is square 0, 4, or 8
	if ( (i%4) == 0 )
		return true;
	else
		return false;
}

// ---------  End Function onDownDiagonal  ----


// ---------  Begin Function onUpDiagonal  ----

function onUpDiagonal(i) {
	
	//returns true if square number i is on upDiagonal
	
	if ( (i==2) || (i==4) || (i==6) )
		return true;
	else
		return false;
}

// ---------  End Function onUpDiagonal  ----


// ---------  Begin Function checkGameOver  ----

//Function to check rows, columns, and diagonals to see if a win has occurred
//squareNumber is square on which last move was made.
function checkGameOver(squareNumber) {
	
	var winner = "";
	
	//Calculate row and columns for this square
	var squaresRow = getRowNumberForSquare(squareNumber); //Math.floor(squareNumber/3);
	var squaresColumn = getColNumberForSquare(squareNumber); //squareNumber%3;		

	//Cycle through rows and see if a count of any row has reached 3.
	//Count increments to 3 only if all letters are of the same type.
	if (rows[squaresRow].count == 3) {

		//If so then win has happened. Winner is type of that row. Record that game is over.
		winner = rows[squaresRow].type;
		gameOver = true;

		//Display superimposed line on top of letters to cross them and show a win has occurred
		document.getElementById("row"+squaresRow+"Win").style.display = "block";
	}
	
	//If no win across rows, cycle through columns and see if a count of any column has reached 3.	
	else if (columns[squaresColumn].count == 3) {
		
		//If so, win has happened. Winner is type of that column. Record that game is over.
		winner = columns[squaresColumn].type;
		gameOver = true;
		
		//Display superimposed vertical line that crosses letter in winning column.
		//First, calculate what CSS margin-left should be to align with winning column
		var left = "";
		if (squaresColumn == 0) {
			left = "14.5%";
		} else if (squaresColumn == 1) {
			left = "47.5%";
		} else {
			left = "82%";
		}
		document.getElementById("columnWin").style.left = left;
		
		//With margin-left set to align with winning column, make vertical line visible.
		document.getElementById("columnWin").style.display = "block";	
	}
	
	//If no win across rows or columns, check if win has occurred across downDiagonal
	else if (downDiagonal.count == 3) {
		
		//If so, set winner to downDiagonal's type. Record that game is over.
		winner = downDiagonal.type;
		gameOver = true;
		
		//Display superimposed line across downDiagonal to show game is over.
		document.getElementById('downDiagonalWin').style.display = "block";
	}
	
	//If no win across rows, columns, downDiagonal, check if win has occurred across upDiagonal
	else if (upDiagonal.count == 3) {
		
		//If so, set winner to upDiagonal's type. Record that game is over.
		winner = upDiagonal.type;
		gameOver = true;
		
		//Display superimposed line across upDiagonal to show game is over.		
		document.getElementById('upDiagonalWin').style.display = "block";
	}
	
	//if no win has occurred across rows, counters, diagonals then check if 9 moves have occurred
	else if (moveCounter == 9) {

		//if so, then set winner to T to indicate it's a tie. Record that game is over.
		winner = "T";
		gameOver = true;
	}
	
	//If a winner has been found
	if (winner != "") {

		//Change font size and color of caption to announce win
		document.getElementById("gameCaption").style.color = "#FFFFFF";
		document.getElementById("gameCaption").style.fontSize = "x-large";
		
		//if X won, increment count of X wins, announce X's win in caption
		if (winner == "X") {
			xWins++;
  		document.getElementById("gameCaption").innerHTML = "X wins!";
		}
		
		//else if O won, increment count of its wins, announce its win in caption		
		else if (winner == "O") {
			oWins++;
  		document.getElementById("gameCaption").innerHTML = "O wins!";
		}
		
		//If winner is not blank, and it's neither X nor O then it must be T
		else {
			
			//Increment number of ties. Announce tie in caption.
			ties++;
			document.getElementById("gameCaption").innerHTML = "It's a tie!";
		}
		//Update stat table showing number of X wins, O wins, and ties and display it.
		updateStatsTable();		
	}
}

// ---------  End Function checkGameOver  ----


// ---------  Begin Function updateStatsTable  ----

//Update cells showing counts of win and ties using corresponding values of global variables.
function updateStatsTable() {
	document.getElementById("statsTable").style.display = "block";
	document.getElementById("playAgainButton").style.display = "block";
	document.getElementById('xWinsCell').innerHTML = xWins;
	document.getElementById('oWinsCell').innerHTML = oWins;
	document.getElementById('tiesCell').innerHTML = ties;	
}

// ---------  End Function updateStatsTable  ----


// ---------  Begin Function makeMove  ----

function makeMove() {
	
	//makeExpertMove() and makeNonExpertMove() affect moves
	//computer makes. Call the required function based on
	//difficulty level specified by player
	if (difficultyLevel == 2) {
		makeExpertMove();
	}
	else {
		makeNonExpertMove();
	} 
}

// ---------  End Function makeMove  ----


// ---------  Begin Function makeExpertMove  ----

//Function to calculate and make computer's move in playComputer mode
//Difficulty level set to expert
function makeExpertMove() {

	var squareToModify; //the number of the square to modify
	var impendingWinInfo = {dimension: "", dimensionIndex: -1, type: ""};

	if (computerGoesFirst) {
		//computers first move is in square0 as done in setUpToPlayComputer()
		//For computer's 2nd, and 3rd move, use program author's strategy to seek win or tie
		//based on where player puts the O's in their moves
	
	
		//In this condition, computer goes first. If move counter is 2 then it's computer's second move.
		if (moveCounter == 2) {
	
			//moveHistory[1] tells where O made their first move. If O's first move is in
			//squares 1, 2, 5, 7, or 8
			if ( 	(moveHistory[1] == 1) || (moveHistory[1] == 2) || (moveHistory[1] == 5) ||
						(moveHistory[1] == 7) || (moveHistory[1] == 8)
				 )
				 { //put 2nd X in square6
				squareToModify = 6;
			}
			
			//If O's 1st move is square 3 or 6
			else if ( 	(moveHistory[1] == 3) || (moveHistory[1] == 6) ) { 
				//put 2nd X in square 2
				squareToModify = 2;
			}
	
			//If O's first move is square4
			else if (moveHistory[1] == 4) { 
				//Put second X in square8
				squareToModify = 8;
			}		
			
		}
		
		// If it's time for computer's 3rd move
		else if (moveCounter == 4) { 
			
			//If computer's second move used square6
			if (moveHistory[2] == 6) { 
				
				//if O's 2nd move did not block by using square3
				if (moveHistory[3] != 3) { 
					//then put 3rd X in square3 for win
					squareToModify = 3;									
				}
				
				//If O used square 1 or 2 for its 1st move
				//( <=2 means 1 or 2 since computer has already taken square 0)
				else if (moveHistory[1] <= 2) { 
					//then put 3rd X in square8
					squareToModify = 8;
				}
				
				//if O used square7 or 8 for its 1st move
				else if (moveHistory[1] > 6) { 
					//Put 3rd X in square2
					squareToModify = 2;
				}
				else if (moveHistory[1] == 5) { //if O used square5 for its 1st move
					//Put 3rd X in square4
					squareToModify = 4;
				}
			}
			
			//if second X was placed in square2
			else if (moveHistory[2] == 2) {
				
				//if 2nd O did not use square1 to block
				if (moveHistory[3] != 1) { 
					//Put 3rd X in square1 for win
					squareToModify = 1;
				}
				
				//this scenario occurs when O's first move was square3 or 6
				else { 
					//Put X in square8
					squareToModify = 8;
				}
			}
			
			//if 1st O in square4 (means 2nd X would have been put in square8 per code above)
			else if (moveHistory[1] == 4) {
				
				//if 2nd O in square2
				if (moveHistory[3] == 2) {
					//Put 3rd X in square 6
					squareToModify = 6;
				}
				
				//if 2nd O in square6
				else if (moveHistory[3] == 6) { 
					//Put X in square2
					squareToModify = 2;
				}
				else if (moveHistory[3] == 1) { //2nd O in square1
					//put X in square7
					squareToModify = 7;
				}
				else if (moveHistory[3] == 5) { //2nd O in square5
					//Put X in square3
					squareToModify = 3;
				}			
				else if (moveHistory[3] == 7) { //2nd O in square7
					//Put X in square1
					squareToModify = 1;
				}			
				else if (moveHistory[3] == 3) { //2nd O in square3
					//Put X in square5
					squareToModify = 5;
				}			
			}		
			
		}
		
		//If it's time for computer's 4th or 5th move
		else if ( (moveCounter == 6) || (moveCounter == 8) ) {
			
			//Call function that checks for impending win and then seek a win or block
			impendingWinInfo = checkForImpendingWin();
			if (impendingWinInfo.dimension != "") {
				//doWinOrBlock(impendingWinInfo.dimension, impendingWinInfo.dimensionIndex);
				squareToModify = findSquareForWinOrBlock(impendingWinInfo.dimension, impendingWinInfo.dimensionIndex);
			}
			else {
				squareToModify = findNextSquare();
			}
		}
	}
	
	//else player has gone first.
	else {
		
		//If player has made only one move so far
		if (moveCounter == 1) {
			
			//if square4 is empty then make first move there.
			if (grid[4] == "") {
				squareToModify = 4;
			}
			// else if square4 is taken then make first move in square8
			else {
				squareToModify = 8;
			}
		}
		
		//If player has made two moves (means 3 total moves and its now computers second move)
		else if (moveCounter == 3) {
			
			//check if there is an impending win for player. If so, call doWinOrBlock()			 
			impendingWinInfo = checkForImpendingWin();
			if (impendingWinInfo.dimension != "") {
				squareToModify = findSquareForWinOrBlock(impendingWinInfo.dimension, impendingWinInfo.dimensionIndex);
			}
			
			//if no impending win
			else {
				//if computers first move was in square4
				if (moveHistory[1] == 4) {
					
					//if square5 is empty then make move there to lead game to a tie
					if (grid[5] == "") {
						squareToModify = 5;
					}
					
					//if square5 is not empty then make move in square2 to avoid a potential path to players win
					else {
						squareToModify = 2;
					}
				}
				
				//if player made first move in square4 then computer's first move would be in square8
					//in case of above condition met, check if players second move was in square0. This check is
					//done because that is the only move that still allows a path for player to win. To block
					//that possibility, make computers second move in square6.
	
				else if ( (moveHistory[1] == 8) && (moveHistory[2] == 0) ) {
						squareToModify = 6;
				}				
			}
		}
		
		//For all other scenarios, either block a win or fill a square. The game should now lead to a tie.
		else {
			
			impendingWinInfo = checkForImpendingWin();
			if (impendingWinInfo.dimension != "") {
				squareToModify = findSquareForWinOrBlock(impendingWinInfo.dimension, impendingWinInfo.dimensionIndex);
			}
			else {
				squareToModify = findNextSquare();			
			}
		}
	}
	updateGameStatus(squareToModify);
}

// ---------  End Function makeExpertMove  ----

// ---------  Begin Function checkForImpendingWin  ----

//If computer is about to win, complete the win. If player about to win, block it.
function checkForImpendingWin() {
	
	//impendingWinInfo contains information that is used by function doWinOrBlock():
	//which dimension is about to win (e.g. row, column, downDiagonal); the starting index
	//number for that dimension; and which letter type is about to win
	var impendingWinInfo = {dimension: "", dimensionIndex: -1, type: ""};
	
	//If downdiagonal has two squares of same type and needs one more to win,
	//then return info about this diagonal
	if ( (downDiagonal.count == 2) && (downDiagonal.type != "T" ) ) {
		impendingWinInfo.dimension = "downDiagonal";
		impendingWinInfo.dimensionIndex = 0; //starting square number for downdiagonal
		impendingWinInfo.type = downDiagonal.type;
		
		//if downDiagonal.type is computersLetter then computer is about to win. Stop here and
		//return info so as to allow the win to proceed
		if (downDiagonal.type == computersLetter) {
			return impendingWinInfo;
		}
	}

	//If updiagonal has two squares of same type and needs one more to win,
	//then return info about this diagonal
	if ( (upDiagonal.count == 2) && (upDiagonal.type != "T") ) {
		impendingWinInfo.dimension = "upDiagonal";
		impendingWinInfo.dimensionIndex = 6;
		impendingWinInfo.type = upDiagonal.type;

		//if upDiagonal.type is computersLetter then computer is about to win. Stop here and
		//return info so as to allow the win to proceed
		if (upDiagonal.type == computersLetter) {
			return impendingWinInfo;
		}
	}
	
	//Cycle through rows, columns. 
	
	for (i=0; i<3; i++) {
			
			//If any row has two squares of the same type and needs one more to win,
			//then return info about this row
			if ( (rows[i].count == 2) && (rows[i].type != "T") ) {
				impendingWinInfo.dimension = "row";
				impendingWinInfo.dimensionIndex = i;
				impendingWinInfo.type = rows[i].type;
				//if rows[i].type is computersLetter then computer is about to win. Stop here and
				//return info so as to allow the win to proceed				
				if (rows[i].type == computersLetter) {
					return impendingWinInfo;						
				}		
			}

			//If any column has two squares with the same type and needs one more to win,
			//then return information about this column	
			if ( (columns[i].count == 2) && (columns[i].type != "T") ) {
				impendingWinInfo.dimension = "column";
				impendingWinInfo.dimensionIndex = i;
				impendingWinInfo.type = columns[i].type;
				
				//if columns[i].type is computersLetter then computer is about to win. Stop here and
				//return info so as to allow the win to proceed	
				if (columns[i].type == computersLetter) {
					return impendingWinInfo;						
				}
			}
	}
	
	//If there was an impending win for computer then by now it has been returned.
	//If there is an impending win for player than impendingWinInfo has information about it.
	//If there is no impending win then impendingWinInfo has default values.
	return impendingWinInfo;

}

// ---------  End Function checkForImpendingWin  ----

// ---------  Begin Function findSquareForWinOrBlock  ----

//Function called to complete a win, or block a win
//Argument: dimension specifies which dimension is about to win: row, column, downDiagonal, upDiagonal
function findSquareForWinOrBlock(dimension, dimensionIndex) {
	
	
	var squareNumber = 0; //Keeps track of square under question.	
	
	//if the win is about to occur across a row
	if (dimension == "row") {
		
		//The dimensionIndex passed as argument specifies row number e.g. row 0, 1, or 2
		//Use dimensionIndex to calculate first square of that row and store in squareNumber
		squareNumber = 3 * dimensionIndex;
		
		//Move across row until you find the blank square
		while (grid[squareNumber] != "") {
			squareNumber++;
		}
	}
	
	//if the win is about to occur across a column
	else if (dimension == "column") {
		
		//move to the the top square of that column and store its number in squareNumber.
		//dimensionIndex--passed as argument--gives that square number
		squareNumber = dimensionIndex;
		
		//Find the empty square in the column.
		//Adding 3 to square number makes you move to the next square down the column. 
		while (grid[squareNumber] != "") {
			squareNumber = squareNumber + 3;
		}
	}
	
	//else if the win is about to occur across downDiagonal
	else if (dimension == "downDiagonal") {
		
		//we start with the square in the first column of downDiagonal, which is square0
		//dimensionIndex passed when dimension is downDiagonal is 0
		//So squareNumber is set to equal dimensionIndex, which is 0
		squareNumber = dimensionIndex;
		
		//find the empty square in downDiagonal
		//Adding 4 moves us to the next square in downDiagonal. So when in square0, next is square4
		while ( grid[squareNumber] != "" ) {
			squareNumber = squareNumber + 4;
		}	
	}
	
	//if win is about to occur across upDiagonal
	else if (dimension == "upDiagonal") {
		
		//we start with the square in column0 of updiagonal, which is square6
		//Whenever dimension is upDiagonal, dimensionIndex is set to 6
		//So set squareNumber to dimensionIndex
		squareNumber = dimensionIndex;
		
		//Find the empty square in upDiagonal
		//Subtracting 2 from squareNumber makes us move up the upDiagonal. So from square6 we subtract 2
		//and move to square4
		while (grid[squareNumber] != "") {
			squareNumber = squareNumber - 2;
		}		
	}
	
	return squareNumber;
}

// ---------  End Function findSquareForWinOrBlock  ----




// ---------  Begin Function makeNonExpertMove  ----

function makeNonExpertMove() {
	
	var squareNumber; //the number of the square to modify
	var impendingWinInfo = {dimension: "", dimensionIndex: -1, type: ""};

	//if it's computer's first move regardless of who goes first
	if (moveCounter < 2) {
		
		//if square0 is empty then make move there
		if (grid[0] == "") {
			squareNumber = 0;
		}
		
		//if square0 not empty then make move in square 2
		else {
			squareNumber = 2;
		}	
	}
	
	//if moveCounter==2 and computer's move then no impendingWin can be possible. Don't waste time checking.
	else if ((moveCounter == 2) && (currentLetter == computersLetter) ) {

		squareNumber = findNextSquare();			
	}
	
	//For all other scenarios
	else {

		//first check if there is an impending win. If so, find square to win, or block players win		
		impendingWinInfo = checkForImpendingWin();
		if (impendingWinInfo.dimension != "") {
			squareNumber = findSquareForWinOrBlock(impendingWinInfo.dimension, impendingWinInfo.dimensionIndex);
		}
		else {
			//if there is no impending win then find next square

			squareNumber = findNextSquare();
		}
	}
				
	//Make call to square click to put computersLetter on that square in displayed grid
	updateGameStatus(squareNumber);
}

// ---------  End Function makeNonExpertMove  ----



// ---------  Begin Function findNextSquare  ----

function findNextSquare() {
	
	var emptySquare = -1;
	
	//Go through the squares of the grid
	for (i=0; i<9; i++) {
		
		//If difficulty level is 1 (moderate difficulty) or 2 (expert)
		if (difficultyLevel >0) {
			
			//Look for a square that has computersLetter in it then try to find an empty square
			//that is adjacent to it.
			if (grid[i] == computersLetter) {
				
				//check horizontally
				//If not in last column, check if one square to the right is empty. If so, return this square
				if ( (i%3 < 2) && (grid[i+1]=="") ) {
					emptySquare = i+1;
					if ( 	(difficultyLevel == 1) ||
								( (difficultyLevel ==2) && (rows[getRowNumberForSquare(i)].count < 2) )
							){
								return (i+1);
					}
				}
	
				//If not in first column, check if one square to the left is empty. If so, return this square
				else if ( (i%3 > 0) && (grid[i-1] == "") ) {
					return (i-1);
				}
				
				//check vertically
				//If not in last row, check if one square below is empty. If so, return this square			
				else if ( (Math.floor(i/3) < 2) && (grid[i+3] == "") ) {
					return (i+3);
				}
				
				//If not in first column, check if one square above is empty. If so, return this square			
				else if ( (Math.floor(i/3) > 0) && (grid[i-3] == "") ) {
					return (i-3);
				}
				
				//check if on downDiagonal
				else if (onDownDiagonal(i)) {
					
					//if not square 8, check if one square down diagonal is empty. If so, return it.
					if ( (i<8) && (grid[i+4] == "") ) {
						return(i+4);
					}
					
					//if not square 0, check if one square up the diagonal is empty. If so, return it.
					else if ( (i>0) && (grid[i-4] == "") ) {
						return(i-4);
					}
				}
				
				//check up diagonal
				else if (onUpDiagonal(i)) {
					
					//if not in the bottom row, check if one square up diagonal is empty. If so, return it.
					if ( (i<6) && (grid[i+2] == "") ) {
						return(i+2);
					}
					
					//if not in the top row, check if one square down diagonal is empty. If so, return it.
					else if ( (i>2) && (grid[i-2] == "") ) {
						return(i-2);
					}
				}			
			}
			
			//If nothing matches above then record this square as being empty in case we need to come
			//back to it if there is no other move possible.
			else if (grid[i] == "") {
				emptySquare = i;
			}			
		}
		//if difficulty level is 0 (novice difficulty) then return the first blank square found
		else if (grid[i] == "")
				return i;
	}
	
	//We will reach this point only after completing for loop to cycle through all squares
	//for difficultyLevel 1 or 2 and not finding an empty square adjacent to a square occupied by
	//computersLetter. So no moves possible to make the next move next to a previously made move.
	//In this case, make a move in an empty square. So return  value stored in emptySquare in for loop
	return emptySquare;
}

// ---------  End Function findNextSquare  ----

//-------------  End Functions that process the game  -------------------------




//-------------  Begin Functions that do clean up, reset  ---------------------

// ---------  Begin Function closeModal  ----

//Function called when X used to close modal, end game. Hide modal, do reset, clean up.
function closeModal() {
	
	//Hide modal
  document.getElementById('ticTacToeModal').style.display = "none";
  
	//Reset global variables
	reset();
	
	//Rest win, loss, ties table and data.
	document.getElementById('xWinsCell').innerHTML = "";
	document.getElementById('oWinsCell').innerHTML = "";
	document.getElementById('tiesCell').innerHTML = "";
	xWins = 0;
	oWins = 0;
	ties = 0;
	
	//Hide stats table.
	document.getElementById("statsTable").style.display = "none";

	
	//Hide play again button during clean up. This should no longer be visible until another game
	//has ended--not to be displayed for 1st game
	document.getElementById("playAgainButton").style.display = "none";
	
	//Reset radio button selections
	document.getElementById('2playersHere').checked = true;
	document.getElementById('playComputer').checked = false;
	document.getElementById('difficultyLevelRange').value = 1;
	document.getElementById('difficultyLevelDiv').style.display = "none";
}

// ---------  End Function closeModal  ----


// ---------  Begin Function reset  ----


//Does reset to prepare for a new game. Does not flush record of wins and losses.
function reset() {
	
	var squareNumber = 0;

	//toggle who goes first in next game
	if (playerMode == "playComputer") {
		if (computerGoesFirst) {
			currentLetter = computersLetter;
			computerGoesFirst = false;
		}
		else {
			currentLetter = playersLetter;
			computerGoesFirst = true;
		}		
	}


	//reset the globals used to determine if game over	
	moveCounter = 0;
	gameOver = false;
	
	//Cycle through all rows and columns. Reset type, count.
	for (i=0; i<3; i++) {
		rows[i].type = "";
		rows[i].count = 0;	
		columns[i].type = "";
		columns[i].count = 0;
		
		//For each row, make sure the superimposed lines that show a win is cleared.
		document.getElementById("row"+i+"Win").style.display = "none";
		
		//Use another counter to cycle through each square of a row
		for (j=0; j<3; j++) {
			
			squareNumber = i*3 + j;
			
			//Make sure its reset to be blank on grid
			document.getElementById("square"+squareNumber).innerHTML = "";
			
			//Reset arrays for grid and moveHistory
			grid[squareNumber] = "";
			moveHistory[i*3 + j] = "";
		}
	}
	
	//Make sure the superimposed lines that show a win across a column or diagonal hidden
	document.getElementById("columnWin").style.display = "none";	
	document.getElementById("upDiagonalWin").style.display = "none";
	document.getElementById("downDiagonalWin").style.display = "none";
	
	//Rest type and count of diagonals
	downDiagonal.type = "";
	downDiagonal.count = 0;
	upDiagonal.type = "";
	upDiagonal.count = 0;
	
	//Reset caption.
	document.getElementById("gameCaption").style.color = "#006";
	document.getElementById("gameCaption").style.fontSize = "medium";
	document.getElementById("gameCaption").innerHTML = "Game on! It's "+currentLetter+"'s move.";
	document.getElementById("statsTable").style.display = "none";
	document.getElementById("playAgainButton").style.display = "none";

}

// ---------  End Function reset  ----

//-------------  End Functions that do clean up, reset  ---------------------

