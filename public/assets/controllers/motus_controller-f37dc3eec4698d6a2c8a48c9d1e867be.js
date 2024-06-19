import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect() {
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
        

        function initGame(player) {
            const parser = new DOMParser();
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

            grid.insertAdjacentHTML('beforeend', tableContent);
        }

        // Example : electronic
        // If user types elactronie if should have first e in red and last yellow
        // But if user types electronie last one should be grey
        // Return TRUE if letter is in the word AND misplaced
        function isLetterNeeded(char, guessWord, tempLetterOccurences) {
            console.log("Enter isLetterNeed / char = "+char+" / GuessWord = "+guessWord);

            let index = guessWord.indexOf(char);

            while (index != -1) {
                console.log("Index = "+index+" / guessWord[index] = "+guessWord[index]+" / inputContent[index] = "+ inputContent[index])

                if (guessWord[index] != inputContent[index]) {

                    console.log("tempLetterOccurences[char] = "+tempLetterOccurences[char])
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

                //let td = $("#grid treq(" + currentLine + ") td").eq(i - 1);
                let td = document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") > td")[i - 1];
                td.style.backgroundColor = "rgb(3, 122, 202)";
            }
        }

        function checkIfLost() {
            if (currentLine >= lineNumber) {
                document.getElementById("lose").style.display = "block"
                document.getElementById("answer").innerHTML = "The player was : " + playerToFind;
            }
        }

        // Check if user word = player to find
        function checkLine(player) {
            inputContent = inputContent.toLowerCase();

            let correctAnswers = 0;
            let tempLetterOccurences = [...letterOccurences]

            for (let i = 0; i < inputContent.length; i++) {
                let char = inputContent[i];
                let td = document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") > td")[i];
                let indexof = player.indexOf(char);
                
                if (char != player[i]) {
                    if (indexof != -1) {
                        // char is detected but on wrong place
                        if (isLetterNeeded(char, player, tempLetterOccurences)) {
                            td.style.backgroundColor = "rgb(255, 189, 0)";
                        }
                    } else {
                        // char not detected at all
                        td.style.backgroundColor = "rgb(3, 122, 202)";
                        audioNegative.play();
                    }
                } else {
                    // char in good place
                    td.style.backgroundColor = "rgb(231, 0, 42)";
                    correctAnswers++;
                    // Example : word is device, input is eleee
                    // At this moment, first 2 e will be yellow cause they don't know yet last E is red
                    // So if we found a red E but occurences already null we have to remove yellow from last E
                    checkLastYellowChar(char, tempLetterOccurences)
                    tempLetterOccurences[char]--;
                    audioPositive.play();
                }
            }

            if (correctAnswers == player.length) {
                document.getElementById("win").style.visibility = "block";
                audioApplause.play();
            } else {
                checkIfLost();
            }

            currentLine++;
            currentColumn = 0;

            inputContent = "";
        }

        function jumpLine() {
            let td = document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") > td").innerHTML = " ";
            td.innerHTML = " ";
            td.style.backgroundColor = "rgb(60, 108, 140)";

            audioNegative.play();

            checkIfLost();

            currentLine++;
            currentColumn = 0;
        }

        let playerList = [
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

        console.log(player);

        // Fill an associative array which count for every letter its occurence
        for (let i = 0; i < player.length; i++) {
            let totalOccurences = player.length - player.replaceAll(player[i], '').length;
            letterOccurences[player[i]] = totalOccurences;
        }

        initGame(player);

        document.onkeydown = keyInput;

        function keyInput (e) {
            if (e.keyCode === 13) {  // Enter
                // check player only if answer provided is long enough
                if (inputContent.length != player.length) {
                    jumpLine();
                    initTimer();
                } else {
                    checkLine(player)
                }
            } else if (e.keyCode === 8) { // Return - remove last char
                inputContent = inputContent.slice(0, -1);
                currentColumn--;
                document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") td")[currentColumn].innerHTML = '.';
            } else if ((e.keyCode >= 65 && e.keyCode <= 90) || e.keyCode >= 48 && e.keyCode <= 57) { // a-z 0-9
                var char = String.fromCharCode(e.which);

                document.querySelectorAll("#grid tr:nth-of-type(" + currentLine + ") td")[currentColumn].innerHTML = char;
                currentColumn++;

                let clic = new Audio(clickPath);
                clic.volume = 0.2;
                clic.play();

                inputContent += char;
            }
        };
    }
}
