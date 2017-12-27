var currentLetter = true;
var moveCounter = 0;

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

function squareClick(element, row, column) { 	
	if (element.innerHTML == "") {
		if (currentLetter == true) {
			element.innerHTML = "X";
			if (rows[row].type == "") {
				rows[row].type = "X";
				rows[row].count = 1;
			}
			else if (rows[row].type == "X") {
				rows[row].count = rows[row].count+1;
			}
			else if (rows[row].type == "O") {
				rows[row].type = "T";
			}
			if (columns[column].type == "") {
				columns[column].type = "X";
				columns[column].count = 1;
			}
			else if (columns[column].type == "X") {
				columns[column].count = columns[column].count+1;
			}
			else if (columns[column].type == "O") {
				columns[column].type = "T";
			}
			if ( ((row==0) && (column==0)) || ((row==1) && (column==1)) || ((row==2) && (column==2))  ) {
				if (downDiagonal.type == "") {
					downDiagonal.type = "X";
					downDiagonal.count = 1;
				}
				else if (downDiagonal.type == "X") {
					downDiagonal.count = downDiagonal.count+1;
				}
				else if (downDiagonal.type == "O") {
					downDiagonal.type = "T";
				}
			}
			if ( ((row==2) && (column==0)) || ((row==1) && (column==1)) || ((row==0) && (column==2))  ) {
				if (upDiagonal.type == "") {
					upDiagonal.type = "X";
					upDiagonal.count = 1;
				}
				else if (upDiagonal.type == "X") {
					upDiagonal.count = upDiagonal.count+1;
				}
				else if (upDiagonal.type == "O") {
					upDiagonal.type = "T";
				}
			}			
			currentLetter = false;
		}
		else {
			element.innerHTML = "O";
			if (rows[row].type == "") {
				rows[row].type = "O";
				rows[row].count = 1;
			}
			else if (rows[row].type == "O") {
				rows[row].count = rows[row].count+1;
			}
			else if (rows[row].type == "X") {
				rows[row].type = "T";
			}
			if (columns[column].type == "") {
				columns[column].type = "O";
				columns[column].count = 1;
			}
			else if (columns[column].type == "O") {
				columns[column].count = columns[column].count+1;
			}
			else if (columns[column].type == "X") {
				columns[column].type = "T";
			}
			if ( ((row==0) && (column==0)) || ((row==1) && (column==1)) || ((row==2) && (column==2))  ) {
				if (downDiagonal.type == "") {
					downDiagonal.type = "O";
					downDiagonal.count = 1;
				}
				else if (downDiagonal.type == "O") {
					downDiagonal.count = downDiagonal.count+1;
				}
				else if (downDiagonal.type == "X") {
					downDiagonal.type = "T";
				}
			}
			if ( ((row==2) && (column==0)) || ((row==1) && (column==1)) || ((row==0) && (column==2))  ) {
				if (upDiagonal.type == "") {
					upDiagonal.type = "O";
					upDiagonal.count = 1;
				}
				else if (upDiagonal.type == "O") {
					upDiagonal.count = upDiagonal.count+1;
				}
				else if (upDiagonal.type == "X") {
					upDiagonal.type = "T";
				}
			}				
			currentLetter = true;
//			document.getElementById('firstRowWin').style.display = "block";
		}
		moveCounter++;
		checkGameOver(row, column);
	}
}

function checkGameOver(row, column) {
	if (rows[row].count == 3) {
		document.getElementById("row"+row+"Win").style.display = "block";
		document.getElementById("gameCaption").style.color = "#FFFFFF";
		document.getElementById("gameCaption").style.fontSize = "x-large";		
		document.getElementById("gameCaption").innerHTML = rows[row].type + " wins!";		
//		window.alert(rows[row].type + " wins!");
	} else if (columns[column].count == 3) {
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
		document.getElementById("gameCaption").style.color = "#FFFFFF";
		document.getElementById("gameCaption").style.fontSize = "x-large";			
		document.getElementById("gameCaption").innerHTML = columns[column].type + " wins!";
//		window.alert(columns[column].type + " wins!");
	} else if (downDiagonal.count == 3) {
		document.getElementById('downDiagonalWin').style.display = "block";
		document.getElementById("gameCaption").style.color = "#FFFFFF";
		document.getElementById("gameCaption").style.fontSize = "x-large";	
		document.getElementById("gameCaption").innerHTML = downDiagonal.type + " wins!";
//		window.alert(downDiagonal.type + " wins!");
	} else if (upDiagonal.count == 3) {
		document.getElementById('upDiagonalWin').style.display = "block";
		document.getElementById("gameCaption").style.color = "#FFFFFF";
		document.getElementById("gameCaption").style.fontSize = "x-large";
		document.getElementById("gameCaption").innerHTML = upDiagonal.type + " wins!";
//		window.alert(upDiagonal.type + " wins!");
	} else if (moveCounter == 9) {
		document.getElementById("gameCaption").style.color = "#FFFFFF";
		document.getElementById("gameCaption").style.fontSize = "x-large";
		document.getElementById("gameCaption").innerHTML = "It's a tie!";
//		window.alert("It's a tie!");
	}
}

function openModal() {
  document.getElementById('ticTacToeModal').style.display = "block";
  document.getElementById('gameCaption').innerHTML = "Game on!";
}

function closeModal() {
  document.getElementById('ticTacToeModal').style.display = "none";
  reset();
}

function reset() {
	currentLetter = true;
	moveCounter = 0;
	for (i=0; i<3; i++) {
		rows[i].type = "";
		rows[i].count = 0;	
		columns[i].type = "";
		columns[i].count = 0;		
		document.getElementById("row"+i+"Win").style.display = "none";
		for (j=0; j<3; j++) {
			document.getElementById("square"+i+j).innerHTML = "";
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
	document.getElementById("startButton").innerHTML = "Play again!";
}
