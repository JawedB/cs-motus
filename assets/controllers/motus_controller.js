import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect() {
        // Init Modal
        var modal = new bootstrap.Modal(document.getElementById('modal-result'));
        var modalInfo = new bootstrap.Modal(document.getElementById('modal-info'));

        document.getElementById("modal-info-button").addEventListener("click", function () { modalInfo.show() }, false);
        document.getElementById("modal-share-button").addEventListener("click", function () { modal.show() }, false);
        document.getElementById("close-modal-info").addEventListener("click", function () { modalInfo.hide() }, false);
        document.getElementById("close-modal").addEventListener("click", function () { modal.hide() }, false);

        // Sound
        document.getElementById("sound").addEventListener("click", function () {
            if (this.innerHTML === "🔊") {
                this.innerHTML = "🔈";
                isAudio = 0;
            } else {
                this.innerHTML = "🔊";
                isAudio = 1;
            }
        }, false);

        // Global Variables
        var playerToFind = "";
        var currentLine = 1;
        var currentColumn = 0;
        var audioPositive = new Audio(positivePath);
        audioPositive.volume = 0.2;
        var audioNegative = new Audio(negativePath);
        audioNegative.volume = 0.2;
        var audioApplause = new Audio(applausePath);
        audioApplause.volume = 0.2;
        const lineNumber = 6;
        var letterOccurences = [];
        var inputContent = "";
        var isStreakMode = 0;
        var currentStreak = 0;
        var isAudio = 1;
        var playerList = []; // todo : supprimer après passage en BDD

        function playAudio(elem) {
            if (isAudio) {
                elem.play();
            }
        }

        function initKeyboard() {
            let keyboard = document.getElementById("keyboard");
            keyboard.replaceChildren();

            let row1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
            let row2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "m"];
            let row3 = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            let row4 = ["⌫", "z", "x", "c", "v", "b", "n", "↲"];

            let rows = [row1, row2, row3, row4];

            for (let row in rows) {
                let div = document.createElement("div");
                div.classList.add("row");

                keyboard.appendChild(div);

                for (let letter in rows[row]) {
                    let divLetter = document.createElement("div");
                    divLetter.classList.add("col", "letter");
                    divLetter.setAttribute('data-letter', rows[row][letter]);
                    divLetter.innerHTML = rows[row][letter];

                    div.appendChild(divLetter);
                }
            }
        }

        function initGame() {
            currentLine = 1;
            currentColumn = 0;
            inputContent = "";
            let motus = document.getElementById("container-motus");
            let gametype = motus.getAttribute("data-type");
            if (gametype === "streak") {
                isStreakMode = 1;
            }

            playerList = [
                "magixx", "zont1x", "donk", "niko", "hunter", "nexa", "hooxi", "m0nesy", "aleksib", "wonderful", "fl1t", "jame", "norbert", "fame", "snappi", "magisk", "maden",
                "sunpayus", "boros", "electronic", "siuhy", "torzsi", "jimpphat", "xertion", "gla1ve", "goofy", "dycha", "hades", "kylar", "s1mple", "senzu", "mzinho", "brollan",
                "br0", "art", "910", "naf", "sdy", "nbk", "b1t", "karrigan", "apex", "rain", "frozen", "magisk", "zywoo", "mezii", "chopper", "hobbit", "ropz", "broky", "sh1ro",
                "ax1le", "flamez", "spinx", "nertz", "teses", "nicoodoz", "sjuush", "kyxsan", "device", "stavn", "blamef", "jabbi", "staehr", "snax", "acor", "keoz",
                "isak", "volt", "cadian", "twistzz", "yekindar", "skullz", "bodyy", "krimz", "afro", "kyuubii", "matys", "demqq", "krasnal", "styko", "jkaem", "nawwk", "sense",
                "cacanito", "maj3r", "xantares", "woxic", "calyx", "wicadia", "elige", "floppy", "hallzerk", "grim", "fallen", "chelo", "kscerato", "chelo", "yuurih", "blitz", "techno",
                "k1to"
            ];
            let player = playerList[Math.floor(Math.random() * playerList.length)];
            playerToFind = player;

            // Fill an associative array which count for every letter its occurence
            letterOccurences = [];
            for (let i = 0; i < player.length; i++) {
                let totalOccurences = player.length - player.replaceAll(player[i], '').length;
                letterOccurences[player[i]] = totalOccurences;
            }

            let columnNumber = player.length;
            let tableContent = "";
            let grid = document.getElementById("grid");

            for (let i = 0; i < lineNumber; i++) {
                tableContent += "<tr>"

                for (let j = 0; j < columnNumber; j++) {
                    tableContent += "<td>.</td>"
                }

                tableContent += "</tr>"
            }

            grid.replaceChildren();
            grid.insertAdjacentHTML('beforeend', tableContent);

            console.log(player);
        }

        // Example : electronic
        // If user types elactronie if should have first e in red and last yellow
        // But if user types electronie last one should be grey
        // Return TRUE if letter is in the word AND misplaced
        function isLetterNeeded(char, guessWord, tempLetterOccurences) {
            let index = guessWord.indexOf(char);

            while (index != -1) {

                if (guessWord[index] != inputContent[index]) {

                    if (tempLetterOccurences[char] > 0) {
                        tempLetterOccurences[char]--;
                        return true;
                    }
                }

                index = guessWord.indexOf(char, index + 1);
            }

            return false;
        }

        // After validating a red char, remove last yellow if needed
        function checkLastYellowChar(char, tempLetterOccurences) {
            let occurenceToRemove = letterOccurences[char] - 1;
            let currentOcurrence = 0;

            if (tempLetterOccurences[char] == 0) {
                let i = 0;
                for (i; i < inputContent.length && currentOcurrence < occurenceToRemove; i++) {
                    if (char == inputContent[i]) {
                        currentOcurrence++;
                    }
                }

                let td = document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") > td")[i - 1];
                td.classList.remove("letter-yellow");
            }
        }

        function checkIfLost() {
            if (currentLine > lineNumber) {
                document.onkeydown = null;
                let inputLetters = document.getElementsByClassName("letter");
                for (let i = 0; i < inputLetters.length; i++) {
                    inputLetters[i].removeEventListener("click", keyClick);
                }

                showModal("lose");
            }
        }

        function notValidPlayer() {
            var notValid = document.getElementById("not-valid");
            notValid.style.transition = '0.8s';
            notValid.style.opacity = 1;
            setTimeout(() => {
                notValid.style.opacity = 0;
            }, "1500");
            inputContent = "";
            currentColumn = 0;
            let tds = document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") td");
            tds.forEach(td => td.innerHTML = '.');            
        }

        // Check if user word = player to find
        function checkLine(player) {
            inputContent = inputContent.toLowerCase();

            let correctAnswers = 0;
            let tempLetterOccurences = [];

            for (var key in letterOccurences) {
                tempLetterOccurences[key] = letterOccurences[key];
            }

            for (let i = 0; i < inputContent.length; i++) {
                let char = inputContent[i];
                let td = document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") > td")[i];
                let indexof = player.indexOf(char);
                let letter = document.querySelectorAll("[data-letter='" + char + "']")[0];

                if (char != player[i]) {
                    if (indexof != -1) {
                        // char is detected but on wrong place
                        if (isLetterNeeded(char, player, tempLetterOccurences)) {
                            td.classList.add("letter-yellow");
                            if (!letter.classList.contains("letter-red")) {
                                letter.classList.add("letter-yellow");
                            }
                        }
                    } else {
                        // char not detected at all
                        td.classList.add("letter-none");
                        if (!letter.classList.contains("letter-gray")) {
                            letter.classList.add("letter-gray");
                        }

                        playAudio(audioNegative);
                    }
                } else {
                    // char in good place
                    td.classList.add("letter-red");
                    letter.classList.remove("letter-yellow");
                    letter.style.backgroundColor = "rgb(231, 0, 42)";

                    correctAnswers++;
                    // Example : word is device, input is eleee
                    // At this moment, first 2 e will be yellow cause they don't know yet last E is red
                    // So if we found a red E but occurences already null we have to remove yellow from last E
                    checkLastYellowChar(char, tempLetterOccurences)
                    tempLetterOccurences[char]--;

                    playAudio(audioPositive);
                }
            }

            currentLine++;
            currentColumn = 0;
            inputContent = "";

            if (correctAnswers == player.length) {
                if (!isStreakMode) {
                    showModal("win");
                    playAudio(audioApplause);
                    document.onkeydown = null;
                    let inputLetters = document.getElementsByClassName("letter");
                    for (let i = 0; i < inputLetters.length; i++) {
                        inputLetters[i].removeEventListener("click", keyClick);
                    }
                } else {
                    setTimeout(function () {
                        initKeyboard();
                        initGame();
                        currentStreak++;
                        updateStreak();
                    }, 1500);

                }
            } else {
                checkIfLost();
            }
        }

        function resumeGame(score, attempts) {
            var table = document.getElementById("grid");
            let red = "🟥";
            let black = "🟦";
            let yellow = "🟨";
            let result = "";
            let streak = "";
            let players = (currentStreak > 1) ? "players in a row" : "player";
            let wordleCount = 456;

            for (let i = 0, row; row = table.rows[i]; i++) {

                if (i >= attempts) { break; }

                for (let j = 0, col; col = row.cells[j]; j++) {
                    if (col.classList == "letter-red") {
                        result += red;
                    } else if (col.classList == "letter-yellow") {
                        result += yellow;
                    } else {
                        result += black;
                    }
                    result += " ";
                }
                result += "<br />"
            }

            let emoji = "";
            if (score === "win") {
                emoji = "✅";
            } else {
                emoji = "❌";
            }

            if (isStreakMode) {
                emoji = (currentStreak > 0) ? "✅" : "❌";
                streak = "I have guessed " + currentStreak + " CS " + players + "%0A%0A";
                wordleCount = "- STREAK MODE";
            }

            document.getElementById("resume").innerHTML = result;
            document.getElementById("twitter-share-button").href = "https://twitter.com/intent/tweet?text=" + emoji + " CS WORDLE " + wordleCount + " %0A%0A" + streak + result.replaceAll("<br />", "%0A")
                + "%0Ahttps://cs-wordle.com";
        }

        function showModal(result) {
            let attempts = currentLine - 1;
            let modalTitle = "";
            let modalAttempts = "";
            document.getElementById("modal-share-button").style.display = "block";
            resumeGame(result, attempts);

            if (isStreakMode) {
                document.getElementById("potd").style.display = "block";
                document.getElementById("streak").style.display = "none";
            } else {
                document.getElementById("potd").style.display = "none";
                document.getElementById("streak").style.display = "block";
            }

            if (result === "win") {
                modalTitle = "Congratulations";
                modalAttempts = "You found the player of the day after " + attempts + " attempts";
            } else {
                modalTitle = "Too bad";
                modalAttempts = "The player was : " + playerToFind;

                if (isStreakMode) modalTitle = "You guessed " + currentStreak + " players in a row !";
            }

            document.getElementById("attempts").innerHTML = modalAttempts;
            document.getElementById("modal-title").innerHTML = modalTitle;
            modal.show();
        }

        function updateStreak() {
            document.getElementById("current-streak").innerHTML = "Current streak : " + currentStreak;
        }

        function convertToKeyCode(target) {
            if (target === "↲") {
                return 13;
            } else if (target === "⌫") {
                return 8;
            } else {
                var keyCode = target.toUpperCase().charCodeAt(0);
                return keyCode;
            }
        }

        // Starting game
        initKeyboard();
        initGame();

        let inputLetters = document.getElementsByClassName("letter");
        for (let i = 0; i < inputLetters.length; i++) {
            inputLetters[i].addEventListener("click", keyClick, false);
        }

        document.onkeydown = keyInput;

        function keyClick() {
            let object = {
                keyCode: convertToKeyCode(this.getAttribute("data-letter"))
            }
            keyInput(object);
        }

        function keyInput(e) {
            if (e.keyCode === 13) {  // Enter
                // check player only if answer provided is long enough
                if (inputContent.length == playerToFind.length) {
                    if (playerList.includes(inputContent.toLowerCase())) {
                        checkLine(playerToFind);
                    } else {
                        notValidPlayer();
                    }
                }
            } else if (e.keyCode === 8) { // Return - remove last char
                inputContent = inputContent.slice(0, -1);
                currentColumn--;
                document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") td")[currentColumn].innerHTML = '.';
            } else if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode >= 48 && e.keyCode <= 57) { // a-z 0-9
                if (currentColumn < playerToFind.length) {
                    var char = String.fromCharCode(e.keyCode);

                    document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") td")[currentColumn].innerHTML = char;
                    currentColumn++;

                    let clic = new Audio(clickPath);
                    clic.volume = 0.2;
                    playAudio(clic);

                    inputContent += char;
                }
            }
        };
    }
}
