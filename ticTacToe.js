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
			currentLetter = true;
//			document.getElementById('firstRowWin').style.display = "block";
		}
		moveCounter++;
		checkGameOver(row, column);
	}
}

function checkGameOver(row, column) {
	if (rows[row].count == 3) {
		window.alert(rows[row].type + " wins!");
	} else if (columns[column].count == 3) {
		window.alert(columns[column].type + " wins!");
	} else if (moveCounter == 9) {
		window.alert("It's a tie!");
//		document.getElementById('row0Horizontal').style.display = inline;
	}
}


