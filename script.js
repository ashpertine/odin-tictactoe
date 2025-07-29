function Gameboard() {
    let board = [[1,2,3], [4,5,6], [7,8,9]]
    
    const getUniqueValues = (arr) => {
        return arr.filter( (value, index, array) => array.indexOf(value) == index) 
    }
    const checkGameboard = () => {
        const straightCheck = checkGameboardStraight();
        const diagonalCheck = checkGameboardDiagonal();

        const winner = straightCheck.winner ? straightCheck.winner : diagonalCheck.winner;
        if(straightCheck.isOver || diagonalCheck.isOver) return {winner}
        else if(isGameboardFull()) return 'tie'; 
        else return 'round continue';
    }

    const isGameboardFull = () => {
        if(board.flat().every((el) => !Number.isInteger(el))) {
            return true;
        }
        else return false;
    }

    const checkGameboardDiagonal = () => {
        if((board[0][0] == board[1][1] && board[1][1] == board[2][2]) ||
            board[0][2] == board[1][1] && board[1][1] == board [2][0]) {
            const winner = board[1][1]
            return {isOver: true, winner};
        } else {
            return {isOver: false}
        }
    }

    const checkGameboardStraight = () => {
        for (let i = 0; i < 3; i++) {
            //check rows
            let rowArray = board[i];
            let uniqueValsRow = getUniqueValues(rowArray);
            if(uniqueValsRow.length === 1) {
                winner = uniqueValsRow[0];
                return {isOver: true, winner};
            }

            //check cols
            let colArray = []
            for (let j = 0; j < 3; j++) {
                colArray.push(board[j][i])
            }    
            let uniqueValuesCol = getUniqueValues(colArray);
            if(uniqueValuesCol.length === 1) {
                winner = uniqueValuesCol[0];
                return {isOver: true, winner};
            }
        }

        return {isOver: false};
    }

    const updateGameboard = (marker, chosen_index) => {
        board.forEach((row) => {
            row.forEach((ele, index, array) => {
                if(ele == chosen_index) {
                    return array[index] = marker;
                } else return;
            })
        })
        
    }

    const resetGameboard = () => {
        board = [[1,2,3], [4,5,6], [7,8,9]];
    }
    return {board, checkGameboard, updateGameboard, resetGameboard};
}

function Player(marker, name) {
    let score = 0;

    const incrementScore = () => score += 1;
    const resetScore = () => score = 0;
    const printScore = () => score;
    const changeName = (new_name) => name = new_name
    const getName = () => name;

    return {marker, getName, incrementScore, resetScore, printScore, changeName};
}

function createPlayers(player1Obj, player2Obj) {
    let playersObj = {
        player1: {
            obj: player1Obj,
            docScore: document.querySelector('#player1'),
            docName: document.querySelector('#player-name-1')
        }, 
        player2: {
            obj: player2Obj, 
            docScore: document.querySelector('#player2'),
            docName: document.querySelector('#player-name-2'),
        },
        //reach this score for a player to win
        targetScore: 5
    }
    
    return playersObj;
}

//this function updates DOM and corresponds DOM to internal logic
function DOMInteraction (gameboard, players, markers, currentMarker) {

    
    //DOM Query Selections
    const mainContainer = document.querySelector('#main-container');
    const statusDialog = document.querySelector('#status');
    const playerNameDialog = document.querySelector('#player-name');
    const playerSubmitBtn = document.querySelector('#player-submit');
    //DOM Create Elements
    const statusText = document.createElement('p');
    const resetButton = document.createElement('button');
    
    //DOM Append Elements
    statusDialog.appendChild(statusText);
    
    
    function getPlayerNames () {
        const player1Name = document.querySelector('#first-player').value;
        const player2Name = document.querySelector('#second-player').value;
        return {player1Name, player2Name};
    }
    
    function tieRoundCleanup() { 
        statusText.innerText = 'It is a tie! Move to next round?';
        resetButton.innerText = 'Yes';
        statusDialog.appendChild(resetButton);
        statusDialog.showModal();
    }
    
    function winRoundCleanup() {
        let winningMarker = gameboard.checkGameboard().winner;
        let winningPlayer = players.player1.obj.marker == winningMarker ? players.player1 : players.player2;
        updateScore(winningPlayer.obj, winningPlayer.docScore);
        let playerReachedTarget = checkScoreOutcome();
        
        if(statusDialog.lastChild.tagName === 'BUTTON') statusDialog.removeChild(statusDialog.lastChild);
        
        if(playerReachedTarget != false) { 
            statusText.innerText = `${playerReachedTarget.obj.getName()} won the game! Play again?`
            resetButton.innerText = 'Play Again!';
            resetButton.setAttribute('class', 'hard-reset');
            statusDialog.appendChild(resetButton);
            statusDialog.showModal();
        }else { 
            statusText.innerText = `${winningPlayer.obj.getName()} won this round! Move to next round?`;
            resetButton.innerText = 'Yes';
            resetButton.setAttribute('class', 'reset')
            statusDialog.appendChild(resetButton);
            statusDialog.showModal();
        }
    }
    
    function checkScoreOutcome() {
        if(players.player1.obj.printScore() == players.targetScore) return players.player1;
        else if (players.player2.obj.printScore() == players.targetScore) return players.player2;
        else return false;
    }
    
    function markerSwitcher(markers, currentMarker = null) {
        if(currentMarker == null) {
            return markers[Math.floor(Math.random() * markers.length)];
        }else {
            return (markers.filter((elem) => elem != currentMarker))[0];
        }
    }
    
    //event variable for use with gameLoop's mainContainer event listener
    function putMarker(marker, event) {
        const cell = event.target;
        const index = event.target.getAttribute('data-index');
        const selection = document.querySelector(`[data-index="${index}"]`)
        const newImg = document.createElement('img');

        cell.classList.remove('pop-in');
        void cell.offsetWidth;
        cell.classList.add('pop-in');
        
        newImg.setAttribute('src', `images/letter-${marker.toLowerCase()}.svg`);
        selection.append(newImg);
        gameboard.updateGameboard(marker, chose_index=index);
    }
    
    
    function updateScore(playerObj, playerDoc) {
        playerObj.incrementScore();
        playerDoc.innerText = parseInt(playerDoc.innerText) + 1;
    }
    
    function startEventListeners() {
        const clickBlocklist = {
            existingMarker: 'IMG', 
            borders: 'main-container'
        }
        function checkPlayerNames() {
            if(players.player1.obj.getName() == null || players.player2.obj.getName() == null) {
                playerNameDialog.showModal();
            }
        }
        //Event Listeners
        window.addEventListener('mouseover', checkPlayerNames);

        mainContainer.addEventListener('click', (event) => {
            if(event.target.tagName == clickBlocklist.existingMarker || event.target.getAttribute('id') == clickBlocklist.borders) {
                return;
            }
            
            putMarker(currentMarker, event);
            currentMarker = markerSwitcher(markers, currentMarker=currentMarker);
            if(gameboard.checkGameboard() === 'tie') {
                tieRoundCleanup();
            }
            else if(gameboard.checkGameboard() !== 'round continue'){
                winRoundCleanup();
            }
        });
        
        resetButton.addEventListener('click', () => {
            let isHardReset = resetButton.className == 'hard-reset' ? true : false;
            statusDialog.close();
            const boardCells = document.querySelectorAll('.cell');
            //img is the firstChild
            boardCells.forEach((cell) => {
                if(cell.firstChild) return cell.removeChild(cell.firstChild);
                else return;
            });
            
            gameboard.resetGameboard();
            
            if(isHardReset) {
                players.player1.obj.resetScore();
                players.player2.obj.resetScore();
                players.player1.docScore.innerText = 0;
                players.player2.docScore.innerText = 0;
            }
        })

        playerSubmitBtn.addEventListener('click', () => {
            playerNameDialog.close();
            let playerNames = getPlayerNames();
            console.log(playerNames);
            players.player1.obj.changeName(playerNames.player1Name);
            players.player1.docName.innerText = playerNames.player1Name;
            
            players.player2.obj.changeName(playerNames.player2Name);
            players.player2.docName.innerText = playerNames.player2Name;

            window.removeEventListener('mouseover', checkPlayerNames);
        });
        
    }
    
    return {startEventListeners};
}


const gameLoop = (function() { 
    const gameboard = Gameboard();
    const players = createPlayers(Player('X', null), Player('O', null));
    const markers = [players.player1.obj.marker, players.player2.obj.marker];
    let currentMarker = markers[Math.floor(Math.random() * markers.length)];
    const dom = DOMInteraction(gameboard, players, markers, currentMarker);
    dom.startEventListeners();
})();

