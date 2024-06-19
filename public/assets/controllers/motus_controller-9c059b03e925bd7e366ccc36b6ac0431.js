import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect() {
        console.log("motus controller")

        // Global Variables
        var playerToFind = "";
        var currentLine = 0;
        var currentColumn = 0;
        var audioPositive = new Audio("../audio/positive_beep.mp3");
        audioPositive.volume = 0.2;
        var audioNegative = new Audio("../audio/negative_beep.mp3");
        audioNegative.volume = 0.2;
        var audioApplause = new Audio("../audio/applause.mp3");
        audioApplause.volume = 0.2;
        const lineNumber = 6;
        var letterOccurences = [];
        var inputContent = "";

        function initGame(player) {
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

            grid.append(tableContent);
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

                //let td = $("#grid tr:eq(" + currentLine + ") td").eq(i - 1);
                let td = document.querySelector("#grid tr:eq(" + currentLine + ") td")[i - 1];
                td.css("background-color", "rgb(3, 122, 202)");
            }
        }

        function checkIfLost() {
            if (currentLine >= lineNumber - 1) {
                document.getElementById("lose").style.display = "block"
                document.getElementById("answer").innerHTML = "The player was : " + playerToFind;
            }
        }

        // Check if user word = player to find
        function checkLine(player) {
            console.log("inputContent = " + inputContent);
            console.log("player = " + player);
            inputContent = inputContent.toLowerCase();

            let correctAnswers = 0;
            let tempLetterOccurences = [...letterOccurences]

            for (let i = 0; i < inputContent.length; i++) {
                let char = inputContent[i];
                let td = document.querySelector("#grid tr:eq(" + currentLine + ") td")[i];
                let indexof = player.indexOf(char);
                if (char != player[i]) {
                    if (indexof != -1) {
                        // char is detected but on wrong place
                        if (isLetterNeeded(char, player, tempLetterOccurences)) {
                            td.css("background-color", "rgb(255, 189, 0)");
                        }
                    } else {
                        // char not detected at all
                        td.css("background-color", "rgb(3, 122, 202)");
                        audioNegative.play();
                    }
                } else {
                    // char in good place
                    td.css("background-color", "rgb(231, 0, 42)");
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
            let td = document.querySelector("#grid tr:eq(" + currentLine + ") td").innerHTML = " ";
            td.innerHTML = " ";
            td.style.backgroundColor = "rgb(60, 108, 140)";

            audioNegative.play();

            checkIfLost();

            currentLine++;
            currentColumn = 0;
        }
    }
}
