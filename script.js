//Tic-Tac-Toe

//define gameboard object
function Gameboard() {
    let board = [[1,2,3], [4,5,6], [7,8,9]];

    const getAvailableIndexes = (player_markers) =>  {
        return board.flat().filter((element) => !player_markers.includes(element))
    }

    const checkIfIndexIsAvailable = (board_index, player_markers) => {
        let availableIndexes = getAvailableIndexes(player_markers);
        if(availableIndexes.includes(board_index) == false) return false;  //not available 
        else return true;
    }

    const putMarker = (player, board_index) => {
        const marker = player.playerInfo.marker;
        board.forEach(row => {
            row = row.map((element) => {
                if(element == board_index) {
                    const row_index = row.indexOf(board_index);
                    return row[row_index] = marker;
                }
            });
        });
    }

    const checkBoardStraight = () =>  {
        const onlyUnique = (value, index, array) => {
            return array.indexOf(value) == index;
        }

        for(let i = 0; i < 2; i++) {
            let uniqueValues = board[i].filter(onlyUnique);

            if((board[0][i] === board[1][i]) && (board[1][i] === board[2][i])) {
                return {winner: board[0][i]};
            }
            else if (uniqueValues.length == 1) {
                return {winner: uniqueValues[0]}; 
            }
        }

        return false;
    }

    const checkBoardDiagonal = () => {
        if(((board[0][0] === board[1][1]) && (board[1][1] === board[2][2])) || 
        ((board[0][2] === board[1][1]) && (board[1][1] === board[2][0])))  {
            return {winner: board[1][1]};
        } else {
            return false;
        }
    }

    const isGameOver = (player_markers) => {
        //check if game is over
        //first, check if there are already winning slots, if there is, declare the winner
        //if there aren't, check if there any available index
        //if there are still available index, then continue the game, or else, declare a game over (tie)
        const hasWinStraight = checkBoardStraight(); 
        const hasWinDiagonal = checkBoardDiagonal();
        const availableIndexes = getAvailableIndexes(player_markers);
        if(hasWinStraight.winner) return hasWinStraight;
        else if(hasWinDiagonal.winner) return hasWinDiagonal;
        else if(availableIndexes.length === 0) return {winner: 'tie'};
        else return false;
    }

   // const gameLoop = (player1, player2, player_markers) => {
   //     while(!isGameOver(player_markers)) {
   //         let player1Index = parseInt(prompt(`choose an index, ${player1.playerInfo.name}`, '1-9'));
   //         while(!checkIfIndexIsAvailable(player1Index, player_markers)) {
   //             alert('This index is already taken!')
   //             player1Index = parseInt(prompt(`choose an index, ${player1.playerInfo.name}`, '1-9'));
   //         }

   //         putMarker(player1, player1Index);


   //         console.log(board);
   //         if(isGameOver(player_markers)) return isGameOver(player_markers);

   //  
   //         let player2Index = parseInt(prompt(`choose an index, ${player2.playerInfo.name}`, '1-9'));
   //         while(!checkIfIndexIsAvailable(player2Index, player_markers)) {
   //             alert('This index is already taken!')
   //             player2Index = parseInt(prompt(`choose an index, ${player2.playerInfo.name}`, '1-9'));
   //         }
   //         putMarker(player2, player2Index);

   //         console.log(board);
   //     }   

   //     return console.log(isGameOver(player_markers));
   // }



    return { board , checkBoardDiagonal, checkBoardDiagonal, putMarker };
}




//define player object
function Player(name, marker) {
    
    const checkMarkerValidity = (marker) => {
        if(!marker.length == 1) return false;
        return true 
    }
        
    let score = 0;
    if(!checkMarkerValidity(marker)) return 'Invalid Marker!'; 
    
    const incrementScore = () => score++;
    const getScore = () => score;
    
    return {
        playerInfo: {
            name,
            marker
        },
        incrementScore, 
        getScore
    };
}


function writeToDom (player) {
    const putMarkerOnBoard = (player, board_index) => {
        let targetCell = document.querySelector(`div[data-index="${board_index}"]`);
        let markerImage = document.createElement('img');
        markerImage.setAttribute('src', associateMarkers(player.playerInfo.marker));
        if(targetCell.childElementCount === 0) return targetCell.appendChild(markerImage);
        else return;
    }

    const handleClick = (event) => {
        let target = event.target;
        if(target.tagName === 'IMG') return;
        let targetIndex = target.dataset.index;
        putMarkerOnBoard(player, targetIndex);
    }

    const associateMarkers = (marker) => {
        switch(marker) {
            case 'X':
                return 'imgs/X.svg';
            case 'O':
                return 'imgs/O.svg';
            default:
                break;
        }
    }


    const write = () => {
        let mainContainer = document.querySelector('#main-container');
        mainContainer.addEventListener('click', handleClick);
    }


    return { write };
}

const initDOM = (() => {
    const mainContainer = document.querySelector('#main-container');
    for(let i = 0; i < 9; i++) {
        let newCell = document.createElement('div');
        newCell.classList.add('cell');
        newCell.setAttribute('data-index', i+1);
        mainContainer.appendChild(newCell);
    }
})();





//define gameplay
//const startGame = (() => {
    //    let gameboard = Gameboard();
    //    let player1 = Player('player1', 'X');
    //    let player2 = Player('player2', 'O');
    //
    //    gameboard.gameLoop(player1, player2, [player1.playerInfo.marker, player2.playerInfo.marker]);
    //})();
    
    
    
    
    
    