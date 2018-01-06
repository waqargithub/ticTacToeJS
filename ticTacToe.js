//Global variables

	var xWins = 0;
	var oWins = 0;
	var ties = 0;
	var gameOver = false;
	var currentLetter = "";
	var computersLetter = "";	
	var moveCounter = 0;
	var moveHistory = new Array(9);
	var grid = new Array(9).fill("");		
	
	var rows = [
				{type: "", count: 0},
				{type: "", count: 0},
				{type: "", count: 0}
				 ];
	
	var columns = [
				{type: "", count: 0},
				{type: "", count: 0},
				{type: "", count: 0}
				 ];
	
	var downDiagonal = {type: "", count: 0};
	var upDiagonal = {type: "", count: 0};
	var playerMode = "";
	
function getPlayerMode() {

	if (document.getElementById("2playersHere").checked == true) {
		playerMode = "2playersHere";
		currentLetter = "X";
		return "2playersHere";
	}
	else if (document.getElementById("playComputer").checked == true) {
		setUpPlayComputer();
		return "playComputer";
	}
	else if (document.getElementByName("playerMode")[2].checked) {
		playerMode = "2playersSeparate";
		return "2playersSeparate";
	}
}	

function setUpPlayComputer() {
		currentLetter = "O";
		computersLetter = "X";
		document.getElementById("square00").innerHTML = computersLetter;
		moveHistory[0] = 0;
		grid[0] = "X";
		moveCounter++;
		rows[0].count = 1;
		rows[0].type = computersLetter;
		columns[0].count = 1;
		columns[0].type = computersLetter;
		downDiagonal.count = 1;
		downDiagonal.type = computersLetter;
}

function squareClick(element, row, column) {
	var squareNumber = 3*row + column;
//	var squareKey = "square" + squareNumber;
	if ( (element.innerHTML == "") && (gameOver == false) ) {
			element.innerHTML = currentLetter;
			grid[squareNumber] = currentLetter;
			moveHistory[moveCounter] = squareNumber;
			if (rows[row].type == "") {
				rows[row].type = currentLetter;
				rows[row].count = 1;
			}
			else if (rows[row].type == currentLetter) {
				rows[row].count = rows[row].count+1;
			}
			else if (rows[row].type != "") {
				rows[row].type = "T";
			}
			if (columns[column].type == "") {
				columns[column].type = currentLetter;
				columns[column].count = 1;
			}
			else if (columns[column].type == currentLetter) {
				columns[column].count = columns[column].count+1;
			}
			else if (columns[column].type != "") {
				columns[column].type = "T";
			}
			if ( ((row==0) && (column==0)) || ((row==1) && (column==1)) || ((row==2) && (column==2))  ) {
				if (downDiagonal.type == "") {
					downDiagonal.type = currentLetter;
					downDiagonal.count = 1;
				}
				else if (downDiagonal.type == currentLetter) {
					downDiagonal.count = downDiagonal.count+1;
				}
				else if (downDiagonal.type != "") {
					downDiagonal.type = "T";
				}
			}
			if ( ((row==2) && (column==0)) || ((row==1) && (column==1)) || ((row==0) && (column==2))  ) {
				if (upDiagonal.type == "") {
					upDiagonal.type = currentLetter;
					upDiagonal.count = 1;
				}
				else if (upDiagonal.type == currentLetter) {
					upDiagonal.count = upDiagonal.count+1;
				}
				else if (upDiagonal.type != "") {
					upDiagonal.type = "T";
				}
			}			
			if (currentLetter == "X")
				currentLetter = "O";
			else
				currentLetter = "X";
		moveCounter++;
		checkGameOver(row, column);
		if ( (playerMode == "playComputer") && (currentLetter == computersLetter) ) {
			makeMove();
		}
	}
}

function checkGameOver(row, column) {
	var winner = "";
	if (rows[row].count == 3) {
		winner = rows[row].type;
		gameOver = true;
		document.getElementById("row"+row+"Win").style.display = "block";
	}
	else if (columns[column].count == 3) {
		winner = columns[column].type;
		gameOver = true;
		var left = "";
		if (column == 0) {
			left = "14.5%";
		} else if (column == 1) {
			left = "47.5%";
		} else {
			left = "82%";
		}
		document.getElementById("columnWin").style.left = left;	
		document.getElementById("columnWin").style.display = "block";	
	}
	else if (downDiagonal.count == 3) {
		winner = downDiagonal.type;
		gameOver = true;
		document.getElementById('downDiagonalWin').style.display = "block";
	}
	else if (upDiagonal.count == 3) {
		winner = upDiagonal.type;
		gameOver = true;
		document.getElementById('upDiagonalWin').style.display = "block";
	}
	else if (moveCounter == 9) {
		winner = "T";
		gameOver = true;
	}
	if (winner != "") {
		document.getElementById("gameCaption").style.color = "#FFFFFF";
		document.getElementById("gameCaption").style.fontSize = "x-large";
		if (winner == "X") {
			xWins++;
  		document.getElementById("gameCaption").innerHTML = "X wins!";
		}
		else if (winner == "O") {
			oWins++;
  		document.getElementById("gameCaption").innerHTML = "O wins!";
		}
		else {
			ties++;
			document.getElementById("gameCaption").innerHTML = "It's a tie!";
		}
		updateStatsTable();		
	}

}

function openModal() {
  document.getElementById('ticTacToeModal').style.display = "block";
  document.getElementById('gameCaption').innerHTML = "Game on!";
}

function closeModal() {
  document.getElementById('ticTacToeModal').style.display = "none";
  reset();
	document.getElementById('xWinsCell').innerHTML = "";
	document.getElementById('oWinsCell').innerHTML = "";
	document.getElementById('tiesCell').innerHTML = "";
	xWins = 0;
	oWins = 0;
	ties = 0;
	document.getElementById("statsTable").style.display = "none";
	document.getElementById("playAgainButton").style.display = "none";
}

function reset() {

/*

	var moveHistory = new Array(9);


*/


	currentLetter = "X";
	moveCounter = 0;
	gameOver = false;
	for (i=0; i<3; i++) {
		rows[i].type = "";
		rows[i].count = 0;	
		columns[i].type = "";
		columns[i].count = 0;		
		document.getElementById("row"+i+"Win").style.display = "none";
		for (j=0; j<3; j++) {
			document.getElementById("square"+i+j).innerHTML = "";
			grid[i*3 + j] = "";
			moveHistory[i*3 + j] = "";
		}
	}
	document.getElementById("columnWin").style.display = "none";	
	document.getElementById("upDiagonalWin").style.display = "none";
	document.getElementById("downDiagonalWin").style.display = "none";
	downDiagonal.type = "";
	downDiagonal.count = 0;
	upDiagonal.type = "";
	upDiagonal.count = 0;
	
	document.getElementById("gameCaption").style.color = "#006";
	document.getElementById("gameCaption").style.fontSize = "medium";
	document.getElementById("gameCaption").innerHTML = "Game on!";
	document.getElementById("statsTable").style.display = "none";
	document.getElementById("playAgainButton").style.display = "none";

}

function updateStatsTable() {
	document.getElementById("statsTable").style.display = "block";
	document.getElementById("playAgainButton").style.display = "block";
	document.getElementById('xWinsCell').innerHTML = xWins;
	document.getElementById('oWinsCell').innerHTML = oWins;
	document.getElementById('tiesCell').innerHTML = ties;	
}

function makeMove() {

	if (moveCounter == 2) { //	It's time for X's second move
		
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
			else if (moveHistory[1] <= 2) { //If O used square 1 or 2 for its 1st move (X claimed square0)
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
				//Pur X in square2
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
	
	else if ( (moveCounter == 6) || (moveCounter == 8) ) { //It's time for X's 4th or 5th move
		checkForImpendingWin();
	}
}

function checkForImpendingWin() {
//First check if it's possible to complete a win
	if ( (downDiagonal.type == computersLetter) && (downDiagonal.count == 2) ) {
		doWinOrBlock("downDiagonal", 0);		
	}
	else if ( (upDiagonal.type == computersLetter) && (upDiagonal.count == 2) ) {
		doWinOrBlock("upDiagonal", 6);		
	}
	else {
		for (i=0; i<3; i++) {
				if ( (rows[i].type == computersLetter) && (rows[i].count == 2) ) {
					doWinOrBlock("row", i);
					break;
				}
				if ( (columns[i].type == computersLetter) && (columns[i].count == 2) ) {
					doWinOrBlock("column", i);
					break;
				}
		}		
	}
	
	//If no win possible then check if there is a need to block a win
	if ( (downDiagonal.type == "O") && (downDiagonal.count == 2) ) {
		doWinOrBlock("downDiagonal", 0);		
	}
	else if ( (upDiagonal.type == "O") && (upDiagonal.count == 2) ) {
		doWinOrBlock("upDiagonal", 6);		
	}
	else {
		for (i=0; i<3; i++) {
				if ( (rows[i].type == "O") && (rows[i].count == 2) ) {
					doWinOrBlock("row", i);
					break;
				}
				if ( (columns[i].type == "O") && (columns[i].count == 2) ) {
					doWinOrBlock("column", i);
					break;
				}
		}		
	}	
}

function doWinOrBlock(dimension, index) {
	var gridIndex = 0;
	var row = 0;
	var column = 0;
	var squareID;
	var squareToUpdate;
	if (dimension == "row") {
		gridIndex = 3 * index;
		while (grid[gridIndex] != "") {
			gridIndex++;
		}
		row = index;
		column = gridIndex % 3;
		squareID = "square" + row + column;
		squareToUpdate = document.getElementById(squareID);
		squareClick(squareToUpdate, row, column);
	}
	else if (dimension == "column") {
		gridIndex = index;
		while (grid[gridIndex] != "") {
			gridIndex = gridIndex + 3;
		}
		row = Math.floor(gridIndex/3);
		column = index;
		squareID = "square" + row + column;
		squareToUpdate = document.getElementById(squareID);
		squareClick(squareToUpdate, row, column);
	}
	else if (dimension == "downDiagonal") {
		gridIndex = index;
		while (grid[gridIndex] != "") {
			gridIndex = gridIndex + 4;
		}
		row = Math.floor(gridIndex/3);
		column = gridIndex % 3;
		squareID = "square" + row + column;
		squareToUpdate = document.getElementById(squareID);
		squareClick(squareToUpdate, row, column);		
	}
	else if (dimension == "upDiagonal") {
		gridIndex = index;
		while (grid[gridIndex] != "") {
			gridIndex = gridIndex - 2;
		}
		row = Math.floor(gridIndex/3);
		column = gridIndex % 3;
		squareID = "square" + row + column;
		squareToUpdate = document.getElementById(squareID);
		squareClick(squareToUpdate, row, column);			
	}
}