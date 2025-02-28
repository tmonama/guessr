import {rightSound, wrongSound, errorSound} from './sound-effects.js';

let words = ["Apples", "Cream", "Encyclopedia", "Earth", 
    "Movies", "Cantankerous"];

let chosenWord = chooseWord(words);
let guesses = [];
let userScore = {"right": 0, "strike": 0, "revealed": ""};

function endResult(userScore, chosenWord) {
    if (userScore.revealed === chosenWord) {
        document.getElementById('app-response').innerHTML= "You got it! Start a new game?";
        document.getElementById("submit").disabled = true;
    }
}

function editRevealed (index, guess, revealed) {
    return revealed.substring(0,index) + guess + revealed.substring(index+1);
}

function chooseWord(words) {
    let index = Math.floor(Math.random()*5);
    let chosenWord = words[index];
    return chosenWord; 
}

function generateWord(chosenWord) {
    let hiddenWord = '';
    for (let i=0 ; i < chosenWord.length ; i++) {
        hiddenWord += "_";
    }
    document.getElementById('hidden-word').innerHTML = hiddenWord;
}

function displayScore(userScore) {
    let string1 = '';
    let string2 = '';
    for (let i=0; i < userScore.right; i++) {
        string1 += 'X ';
    }
    document.getElementById('right').innerHTML= string1;

    for (let i=0; i < userScore.strike; i++) {
        string2 += 'X ';
    }
    document.getElementById('wrong').innerHTML= string2;
}

function guessCheck(guess, chosenWord, userScore, guesses) {
    guess = guess.replace(/\s+/g, '');
    if (guess.length === 1) {
        return guessCheckLetter(guess, userScore, chosenWord, guesses);
    } 
    
    else {
        return guessCheckWord(guess, userScore, chosenWord, guesses)
    }
}

function guessValidate(chosenWord, userScore, guesses) {
    let guess = document.getElementById("user-input").value;
    if (typeof guess === 'string' && !Number.isFinite(+guess)) {
        return guessCheck(guess, chosenWord, userScore, guesses);
    } else {
        document.getElementById('app-response').innerHTML= "Invalid answer. Make sure to type a letter or word.";
        errorSound();
    }
}


function guessCheckLetter(guess, userScore, chosenWord, guesses) {
    let userScoreCopy = JSON.parse(JSON.stringify(userScore));
    let rightNow = userScoreCopy.right;
    let index = 0;
    let revealed = document.getElementById('hidden-word').innerHTML;
    let count = 0;
    for (let i=0 ; i < chosenWord.length ; i++) {
        if (guess === chosenWord[index]) {
            revealed = editRevealed(index, guess, revealed);
            if (!(guesses.includes(guess))) {
                rightNow ++
            } else {
                count ++;
                document.getElementById('app-response').innerHTML = "You've already guessed that.";
                errorSound();
            }
            guesses.push(guess);
        } else {
            if ((guesses.includes(guess))) {
                count ++;
                document.getElementById('app-response').innerHTML = "You've already guessed that.";
                errorSound();
            }
        }

        if (guess.toUpperCase() === chosenWord[index]) {
            guess = guess.toUpperCase();
            revealed = editRevealed(index, guess, revealed);
            if (!(guesses.includes(guess))){
                guesses.push(guess);
                rightNow ++
            } else {
                count ++;
                document.getElementById('app-response').innerHTML = "You've already guessed that.";
                errorSound();
            }
            guess = guess.toLowerCase();
        } else {
            if ((guesses.includes(guess))) {
                count ++;
                document.getElementById('app-response').innerHTML = "You've already guessed that.";
                errorSound();
            }
        }

        index ++;
        Object.defineProperty(userScore, "revealed", {value : revealed});
    }

    guesses.push(guess);

    if (rightNow === userScore.right) {
        if (count === 0) {
            document.getElementById('app-response').innerHTML = "Wrong! Try again?";
            userScore.strike ++; 
            document.getElementById('hidden-word').innerHTML = userScore.revealed;
            wrongSound();
        }
        return displayScore(userScore);

    } else {
        userScore.right ++;
        document.getElementById('app-response').innerHTML = "That's right!";
        document.getElementById('hidden-word').innerHTML = userScore.revealed;
        rightSound();
        endResult(userScore, chosenWord);
        return displayScore(userScore);
    }
    
}

function guessCheckWord(guess, userScore, chosenWord) {
    let test1 = guess.toLowerCase();
    let test2 = chosenWord.toLowerCase();
    if (test1 === test2) {
        userScore.right ++;
        userScore.revealed = chosenWord;
        document.getElementById('hidden-word').innerHTML= chosenWord;
        correctSound();
        endResult(userScore, chosenWord);
        
    } else {
        document.getElementById('app-response').innerHTML= "Nah. Try again!";
        if (!(guesses.includes(guess))) {
            userScore.strike ++;
            wrongSound();
        }
        guesses.push(guess);
    }

    return displayScore(userScore);
}

function reset(userScore, guesses, words) {
    guesses = [];
    userScore.right = 0;
    userScore.strike = 0;
    userScore.revealed = '';
    document.getElementById("user-input").value = '';
    document.getElementById('app-response').innerHTML= "Ready for guess";
    chosenWord = chooseWord(words);
    generateWord(chosenWord);
    displayScore(userScore);
}

document.getElementById('submit').addEventListener('click', function() {
    guessValidate(chosenWord, userScore, guesses);
  });

document.addEventListener('keydown', function(e) {
    if (e.key === "Enter") {
        guessValidate(chosenWord, userScore, guesses);
    }
  });

document.getElementById('new-game').addEventListener('click', function() {
    reset(userScore, guesses, words);
});

window.addEventListener('load', generateWord(chosenWord));