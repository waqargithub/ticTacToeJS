var currentLetter = true;
var moveCounter = 0;
var win = false;

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
		window.alert(rows[row].type + " wins!");
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
		window.alert(columns[column].type + " wins!");
	} else if (downDiagonal.count == 3) {
		document.getElementById('downDiagonalWin').style.display = "block";
		window.alert(downDiagonal.type + " wins!");
	} else if (upDiagonal.count == 3) {
		document.getElementById('upDiagonalWin').style.display = "block";
		window.alert(upDiagonal.type + " wins!");
	} else if (moveCounter == 9) {
		window.alert("It's a tie!");
	}
}


