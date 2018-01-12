//Global variables

//Variables to store numbers of wins, ties
	var xWins = 0;
	var oWins = 0;
	var ties = 0;

	var currentLetter = ""; //Letter to be placed on grid in the next move
	var computersLetter = "";		//Letter assigned to computer in play computer mode
	
	var gameOver = false; //Used to prevent any moves after game is over

	var moveCounter = 0; //Number of moves used to determine tie
	var moveHistory = new Array(9); //Move number keeps track of square used. Letter not tracked.
	
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

	//Keep track of type and count for downDiagonal--diagonal from square00 to 22	
	var downDiagonal = {type: "", count: 0};

	//Keep track of type and count for upDiagonal--diagonal from square20 to 02	
	var upDiagonal = {type: "", count: 0};
	
	//Stores player mode. Used to determine when playing against computer and when
	//program should make a move
	var playerMode = "";




/**Functions**/

//Function to read radio buttons from web page and get playerMode	
function getPlayerMode() {


	//if two players playing each other, return the mode and set current letter to X
	if (document.getElementById("2playersHere").checked == true) {
		playerMode = "2playersHere";
		currentLetter = "X";
		
		//Display whose move it is
	  document.getElementById('gameCaption').innerHTML = "Game on! " + currentLetter+"'s move.";		
		return "2playersHere";
	}
	
	//if one player playing against computer, return the mode and set up variables to
	//play computer
	else if (document.getElementById("playComputer").checked == true) {
		setUpPlayComputer();
		return "playComputer";
	}
	
	//if two players playing each other from different machines, return that mode.
	//This option not yet exposed and is for future.
	else if (document.getElementByName("playerMode")[2].checked) {
		playerMode = "2playersSeparate";
		return "2playersSeparate";
	}
}	


//Function to set up grid and variables for a game against computer
function setUpPlayComputer() {
	
		computersLetter = "X"; //Computer takes X. Makes first move.

		//To make first move, set square00 to computer's letter, which is X
		document.getElementById("square00").innerHTML = computersLetter;
		
		//Record that the first move occupied square0
		moveHistory[0] = 0;
		
		//Record that square0 has X
		grid[0] = "X";
		
		//increment count of moves
		moveCounter++;
		
		//Since first move in square00, set row 0 count to 1, type to X
		rows[0].count = 1;
		rows[0].type = computersLetter;
		
		//Since first move in square00, set column 0 count to 1, type to X
		columns[0].count = 1;
		columns[0].type = computersLetter;
		
		//Since first move in square00, set downDiagonal count to 1, type to X		
		downDiagonal.count = 1;
		downDiagonal.type = computersLetter;
		
		//Now players's move. Set current letter--the move about to occur--to O.
		currentLetter = "O"; 

		//update whose move it is
	  document.getElementById('gameCaption').innerHTML = "Computer is X. It's " + currentLetter+"'s move.";
		
}

//Function called when player clicks a square, or when computer makes move
//to put a letter on grid. Arguments: element is the square to be modified.
//row and column identify row and column of square to be modified.
function squareClick(element, row, column) {
	
	//Calculate square number using row and column
	var squareNumber = 3*row + column;
	
	//Proceed only if square is empty and game not over
	if ( (element.innerHTML == "") && (gameOver == false) ) {
		
			//Set empty square to currentLetter--the letter for the current move		
			element.innerHTML = currentLetter;
			
			//Record in grid that current letter put in the square number being modified
			grid[squareNumber] = currentLetter;
			
			//Record in move history which square was modified
			moveHistory[moveCounter] = squareNumber;
			
			//If it's a blank row then set row type to current letter, set count to 1
			if (rows[row].type == "") {
				rows[row].type = currentLetter;
				rows[row].count = 1;
			}
			
			//If row not blank but of same type as currentLetter, leave its type unchanged
			//Increment its count.
			else if (rows[row].type == currentLetter) {
				rows[row].count = rows[row].count+1;
			}
			
			//If not an empty row and row type different than current letter
			//Set type to T to indicate this row cannot result in a win, is tied
			else if (rows[row].type != "") {
				rows[row].type = "T";
			}
			
			//If it's a blank column then set column type to current letter, set count to 1
			if (columns[column].type == "") {
				columns[column].type = currentLetter;
				columns[column].count = 1;
			}

			//If column not blank but of same type as currentLetter, leave its type unchanged
			//Increment its count.
			else if (columns[column].type == currentLetter) {
				columns[column].count = columns[column].count+1;
			}

			//If not an empty column and column type different than current letter
			//Set type to T to indicate this column cannot result in a win, is tied
			else if (columns[column].type != "") {
				columns[column].type = "T";
			}
			
			//if it is a square that is part of downDiagonal
			if ( ((row==0) && (column==0)) || ((row==1) && (column==1)) || ((row==2) && (column==2))  ) {
				
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
				//Set type to T to indicate downDiagonal cannot result in a win, is tied
				else if (downDiagonal.type != "") {
					downDiagonal.type = "T";
				}
			}

			//if it is a square that is part of upDiagonal
			if ( ((row==2) && (column==0)) || ((row==1) && (column==1)) || ((row==0) && (column==2))  ) {

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
				//Set type to T to indicate upDiagonal cannot result in a win, is tied
				else if (upDiagonal.type != "") {
					upDiagonal.type = "T";
				}
			}

		//increment count of number of moves	
		moveCounter++;
			
			//Move now displayed on grid, variables updated
			//Toggle letter to prepare for next move
			if (currentLetter == "X")
				currentLetter = "O";
			else
				currentLetter = "X";
			document.getElementById("gameCaption").innerHTML = "It's " +currentLetter+"'s move.";

		//Check if the last move resulted in a win		
		checkGameOver(row, column);
		
		//If playerMode is to play computer, and its now computers move
		if ( (playerMode == "playComputer") && (currentLetter == computersLetter) ) {

			//Call function that calculates and completes computers next move
			makeMove();
		}
	}
}

//Function to check rows, columns, and diagonals to see if a win has occurred
function checkGameOver(row, column) {
	
	var winner = "";

	//Cycle through rows and see if a count of any row has reached 3.
	if (rows[row].count == 3) {

		//If so then win has happened. Winner is type of that row. Record that game is over.
		winner = rows[row].type;
		gameOver = true;

		//Display superimposed line on top of letters to cross them and show a win has occurred
		document.getElementById("row"+row+"Win").style.display = "block";
	}
	
	//If no win across rows, cycle through columns and see if a count of any column has reached 3.	
	else if (columns[column].count == 3) {
		
		//If so, win has happened. Winner is type of that column. Record that game is over.
		winner = columns[column].type;
		gameOver = true;
		
		//Display superimposed vertical line that crosses letter in winning column.
		//First, calculate what CSS margin-left should be to align with winning column
		var left = "";
		if (column == 0) {
			left = "14.5%";
		} else if (column == 1) {
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
	
	//if no win has occurred across rows, counters, diagonals then check of 9 moves have occurred
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
		
		//If winner is not blank, and it's neither X nor O then it must be TT
		else {
			
			//Increment number of ties. Announce tie in caption.
			ties++;
			document.getElementById("gameCaption").innerHTML = "It's a tie!";
		}
		//Update stat table showing number of X wins, O wins, and ties and display it.
		updateStatsTable();		
	}

}

//Function that opens modal that holds tic tac toe grid. Announce whose move it is.
function openModal() {
  document.getElementById('ticTacToeModal').style.display = "block";
}

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
}

function reset() {

	//X will make the first move regardless of player mode
	currentLetter = "X";

	//reset globals used to determine if game over	
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
			
			//Make sure its reset to be blank on grid
			document.getElementById("square"+i+j).innerHTML = "";
			
			//Reset arrays for grid and moveHistory
			grid[i*3 + j] = "";
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


//Update cells showing counts of win and ties using corresponding values of global variables.
function updateStatsTable() {
	document.getElementById("statsTable").style.display = "block";
	document.getElementById("playAgainButton").style.display = "block";
	document.getElementById('xWinsCell').innerHTML = xWins;
	document.getElementById('oWinsCell').innerHTML = oWins;
	document.getElementById('tiesCell').innerHTML = ties;	
}

//Function to calculate and make computer's move in playComputer mode
function makeMove() {

	//computer goes first. If move counter is 2 then it's computer's second move.
	if (moveCounter == 2) {
		
		
		//For computer's 1st, 2nd, and 3rd move, use program author's strategy to seek win or tie
		//based on where player puts the O's in theirs moves
		if ( 	(moveHistory[1] == 1) || (moveHistory[1] == 2) || (moveHistory[1] == 5) ||
					(moveHistory[1] == 7) || (moveHistory[1] == 8)
			 )
			 { //If O's first move is square 1, 2, 5, 7, or 8, put 2nd X in square6
			currentElement = document.getElementById("square20");
			squareClick(currentElement, 2, 0);
		}
		
		if ( 	(moveHistory[1] == 3) || (moveHistory[1] == 6) ) { //If O's 1st move is square 3 or 6
			//put 2nd X in square 2
			currentElement = document.getElementById("square02");
			squareClick(currentElement, 0, 2);
		}

		if (moveHistory[1] == 4) { //If O's first move is square4
			//Put second X in square8
			currentElement = document.getElementById("square22");
			squareClick(currentElement, 2, 2);
		}		
		
	}
	
	else if (moveCounter == 4) { // If it's time for X's 3rd move
		
		if (moveHistory[2] == 6) { //If X's second move used square6
			
			if (moveHistory[3] != 3) { //if O's 2nd move did not block by using square3
				//then put 3rd X in square3 for win
				currentElement = document.getElementById("square10");
				squareClick(currentElement, 1, 0);				
			}
			else if (moveHistory[1] <= 2) { //If O used square 1 or 2 for its 1st move (X would then use square0)
				//then put 3rd X in square8
				currentElement = document.getElementById("square22");
				squareClick(currentElement, 2, 2);
			}
			else if (moveHistory[1] > 6) { //if O used square7 or 8 for its 1st move
				//Put 3rd X in square2
				currentElement = document.getElementById("square02");
				squareClick(currentElement, 0, 2);					
			}
			else if (moveHistory[1] == 5) { //if O used square5 for its 1st move
				//Put 3rd X in square4
				currentElement = document.getElementById("square11");
				squareClick(currentElement, 1, 1);					
			}
		}
		else if (moveHistory[2] == 2) { //if second X was placed in square2
			if (moveHistory[3] != 1) { //if 2nd O did not use square1 to block
				//Put 3rd X in square1 for win
				currentElement = document.getElementById("square01");
				squareClick(currentElement, 0, 1);					
			}
			else { //this scenario occurs when O's first move was square3 or 6
				//Put X in square8
				currentElement = document.getElementById("square22");
				squareClick(currentElement, 2, 2);					
			}
		}
		
		else if (moveHistory[1] == 4) { //1st O in square4 (means 2nd X in square8)
			if (moveHistory[3] == 2) {//2nd O in square2
				//Put 3rd X in square 6
				currentElement = document.getElementById("square20");
				squareClick(currentElement, 2, 0);						
			}
			else if (moveHistory[3] == 6) { //2nd O in square6
				//Put X in square2
				currentElement = document.getElementById("square02");
				squareClick(currentElement, 0, 2);				
			}
			else if (moveHistory[3] == 1) { //2nd O in square01
				currentElement = document.getElementById("square21");
				squareClick(currentElement, 2, 1);				
			}
			else if (moveHistory[3] == 5) { //2nd O in square12
				currentElement = document.getElementById("square10");
				squareClick(currentElement, 1, 0);				
			}			
			else if (moveHistory[3] == 7) { //2nd O in square21
				currentElement = document.getElementById("square01");
				squareClick(currentElement, 0, 1);				
			}			
			else if (moveHistory[3] == 3) { //2nd O in square10
				currentElement = document.getElementById("square12");
				squareClick(currentElement, 1, 2);				
			}			
		}		
		
	}
	
	//If it's time for computer's 4th or 5th move
	else if ( (moveCounter == 6) || (moveCounter == 8) ) {
		
		//Call function that checks for impending win and then seek a win or block
		checkForImpendingWin();
	}
}

//If computer is about to win, complete the win. If player about to win, block it.
function checkForImpendingWin() {
	
//First check if it's possible to complete a win

	//If downdiagonal has two squares with computer's type and needs one more to win,
	//Call function to complete the win
	if ( (downDiagonal.type == computersLetter) && (downDiagonal.count == 2) ) {
		doWinOrBlock("downDiagonal", 0);		
	}

	//Else If updiagonal has two squares with computer's type and needs one more to win,
	//Call function to complete the win
	else if ( (upDiagonal.type == computersLetter) && (upDiagonal.count == 2) ) {
		doWinOrBlock("upDiagonal", 6);		
	}
	
	//Cycle through rows, columns. 
	else {
		for (i=0; i<3; i++) {
			
				//If any row has two squares with computer's type and needs one more to win,
				//Call function to complete the win	
				if ( (rows[i].type == computersLetter) && (rows[i].count == 2) ) {
					doWinOrBlock("row", i);
					break;
				}

				//If any column has two squares with computer's type and needs one more to win,
				//Call function to complete the win	
				if ( (columns[i].type == computersLetter) && (columns[i].count == 2) ) {
					doWinOrBlock("column", i);
					break;
				}
		}		
	}
	
	//If no win possible then check if there is a need to block a win by player

	//If player about to win downDiagonal
	if ( (downDiagonal.type == "O") && (downDiagonal.count == 2) ) {
		
		//Block that win
		doWinOrBlock("downDiagonal", 0);		
	}
	
	//If player about to win upDiagonal
	else if ( (upDiagonal.type == "O") && (upDiagonal.count == 2) ) {
		//Block that win
		doWinOrBlock("upDiagonal", 6);		
	}
	else {
		
		//Cycle through rows and columns
		for (i=0; i<3; i++) {
			
				//If player about to win across any row, block it
				if ( (rows[i].type == "O") && (rows[i].count == 2) ) {
					doWinOrBlock("row", i);
					break;
				}
				
				//If player about to win across any column, block it
				if ( (columns[i].type == "O") && (columns[i].count == 2) ) {
					doWinOrBlock("column", i);
					break;
				}
		}		
	}	
}

//Function called to complete a win, or block a win
//Argument: dimension specifies which dimension is about to win: row, column, downDiagonal, upDiagonal
function doWinOrBlock(dimension, dimensionIndex) {
	
	
	var gridIndex = 0; //Keeps track of square under question.
	var row = 0;	
	var column = 0;
	
	
	//squareID is used to construct a string ID to be used in document.getElementById
	//For example, squareID may be used to construct string "square00"
	//which is then used in a call document.getElemenyById("square00")
	var squareID; 
	
	//squareToUpdate is used to reference the element that holds a letter in the displayed grid.
	//squareToUpdate = document.getElementById("square00")
	var squareToUpdate;
	
		/******Difference between square number and squareToUpdate******/
		
	//square number 5 means the 3rd square (column 2) of the second row (row 1).
	//gridIndex refers to the square number. So square number 5 is called square5
	//and has gridIndex = 5
	//The squareID for this square is the string "square12"
	//The squareToUpdate in this function refers to element (in this case the div 
	//within the grid that is displayed to the player) which holds the square under focus. 
	//So in this case squareToUpdate = document.getElementById("square12")
	
	//if the win is about to occur across a row
	if (dimension == "row") {
		
		//The dimensionIndex passed as argument specifies row number e.g. row 0, 1, or 2
		//Use dimensionIndex to calculate first square of that row and store in gridIndex
		gridIndex = 3 * dimensionIndex;
		
		//Move across row until you find index of blank square
		while (grid[gridIndex] != "") {
			gridIndex++;
		}
		
		//row number is the dimensionIndex passed as an argument
		//It specifies the row number for the empty square to be populated
		row = dimensionIndex;
		
		//gridIndex is square number of empty square which must now be populated.
		//The square number modulus 3 gives the column number. E.g. square 4 gives column 1.
		column = gridIndex % 3;
		
		//Construct string for squareID using row and column of square to be populated
		squareID = "square" + row + column;
		
		//get reference to the element of grid which must be populated e.g. the Div with id="square00"
		squareToUpdate = document.getElementById(squareID);
		
		//Make call to squareClick to populate that element
		squareClick(squareToUpdate, row, column);
	}
	
	//if the win is about to occur across a column
	else if (dimension == "column") {
		
		//move to the the top square of that column and store its number in gridIndex.
		//dimensionIndex--passed as argument--gives that square number
		gridIndex = dimensionIndex;
		
		//Find the empty square in the column.
		//Adding 3 to square number makes you move to the next square down the column. 
		while (grid[gridIndex] != "") {
			gridIndex = gridIndex + 3;
		}
		
		//Dividing the square number by 3 and taking the quotient gives the row of empty
		//square to be populated. E.g. Squares 3 through 5 divided by 3 give a quotient of 1: row1
		row = Math.floor(gridIndex/3);
		
		//Column number is given to us via dimensionIndex
		column = dimensionIndex;
		
		//Construct squareID using row and column calculated for empty square to be populated
		squareID = "square" + row + column;
		
		//Get reference to empty element of grid that is to be populated
		squareToUpdate = document.getElementById(squareID);
		
		//make Call to squareClick to populate that square
		squareClick(squareToUpdate, row, column);
	}
	
	//else if the win is about to occur across downDiagonal
	else if (dimension == "downDiagonal") {
		
		//we start with the square in the first column of downDiagonal, which is square0
		//dimensionIndex passed when dimension is downDiagonal is 0
		//So gridIndex is set to equal dimensionIndex, which is 0
		gridIndex = dimensionIndex;
		
		//find the empty square in downDiagonal
		//Adding 4 moves us to the next square in downDiagonal. So when in square0, next is square4
		while (grid[gridIndex] != "") {
			gridIndex = gridIndex + 4;
		}
		
		//Once we have found empty square, dividing its square number (given by gridIndex)
		//by 3 and taking quotient gives us the row number for that square
		row = Math.floor(gridIndex/3);
		
		//We get column by taking gridIndex modulus 3
		column = gridIndex % 3;
		
		//With row and column number now known, construct squareID
		squareID = "square" + row + column;
		
		//Get reference to the element that has the empty square to be populated
		squareToUpdate = document.getElementById(squareID);
		
		//Make call to squareClick to populate that square
		squareClick(squareToUpdate, row, column);		
	}
	//if win is about to occur across upDiagonal
	else if (dimension == "upDiagonal") {
		
		//we start with the square in column0 of updiagonal, which is square6
		//Whenever dimension is upDiagonal, dimensionIndex is set to 6
		//So set gridIndex to dimensionIndex
		gridIndex = dimensionIndex;
		
		//Find the empty square in upDiagonal
		//Subtracting 2 from gridIndex makes us move up the upDiagonal. So from square6 we subtract 2
		//and move to square4
		while (grid[gridIndex] != "") {
			gridIndex = gridIndex - 2;
		}
		
		//Upon finding empty square, dividing its gridIndex by 3 and taking quotient gives us row of
		//empty square
		row = Math.floor(gridIndex/3);
		
		//Taking the modulus of gridIndex of empty square gives us the column number
		column = gridIndex % 3;
		
		//Construct the string for squareID
		squareID = "square" + row + column;
		
		//Get element for square in displayed grid to populate
		squareToUpdate = document.getElementById(squareID);
		
		//Call squareClick to populate the required element
		squareClick(squareToUpdate, row, column);			
	}
}