var currentLetter = true;
var moveCounter = 0;
var win = false;

function squareClick(element) {
	if (element.innerHTML == "") {
		if (currentLetter == true) {
			element.innerHTML = "X";
			currentLetter = false;
		}
		else {
			element.innerHTML = "O";
			currentLetter = true;
			document.getElementById('firstRowWin').style.display = "block";
		}
		moveCounter++;
		checkGameOver();
	}
}

function checkGameOver() {
	if ( (win == true) || (moveCounter == 9) ) {
		window.alert('Game over!');
//		document.getElementById('row0Horizontal').style.display = inline;
	}
}
/*function squareClick(squareID) {
	var thisSquare = document.getElementById(squareID);
	if (thisSquare.innerHTML == "") {
		if (currentLetter == true) {
//			this.innerHTML = "X";
			thisSquare.innerHTML = "X";
			currentLetter = false;
		}
		else {
//			this.innerHTML = "O";
			thisSquare.innerHTML = "X";
			currentLetter = true;
		}
	}	
}*/

