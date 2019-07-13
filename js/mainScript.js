// by default the submit button is hidden 
$("#nextBtn").hide();
$("#restartBtn").hide();

var tempCollection = [];

var generateQuestions = () => {

    var questionCollection = [];

    // get 5 questions from each category and store them into the question collection
    AjaxWrapper.get("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple", (data) => {
        for (var i = 0; i < data.results.length; i++) {
            var questionEntity = data.results[i];
            questionCollection.push(questionEntity);
        }

        AjaxWrapper.get("https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple", (data) => {
            for (var i = 0; i < data.results.length; i++) {
                var questionEntity2 = data.results[i];
                questionCollection.push(questionEntity2);
            }

            AjaxWrapper.get("https://opentdb.com/api.php?amount=5&difficulty=hard&type=multiple", (data) => {
                for (var i = 0; i < data.results.length; i++) {
                    var questionEntity3 = data.results[i];
                    questionCollection.push(questionEntity3);
                }

                $("#start").hide();
                $("#nextBtn").show();

                var count = 0;
                var score = 0;

                var userChoice; // Stores users choice as the index of the selected answer in the array of all possible answers
                var answerIndex; // Stores the index of the correct answer in the array of all possible answers
                // Both variables compared when the user clicks next button. Score incremented if they match

                // UPDATE QUESTION 
                var allAnswers = [];
                var correctAnswer = questionCollection[count].correct_answer;
                $("#answerList").empty(); // Clear elements from previous question

                // Create an array from all of the answers
                questionCollection[count].incorrect_answers.forEach(function (answer) {
                    allAnswers.push(answer);
                });

                // Push correct answer into array at random index
                allAnswers.join();
                allAnswers.splice(Math.floor(Math.random() * 4), 0, correctAnswer);
                allAnswers.join();

                // Record the index of the correct answer in the array so it can be compared with the index of users choice
                answerIndex = allAnswers.indexOf(correctAnswer);

                // Append question to the DOM
                $("#questionField").html(questionCollection[count].question);

                for (var i = 0; i < allAnswers.length; i++) { // Loop through answers and append each to list
                    var li = document.createElement("li");
                    var text = document.createTextNode(decodeHTML(allAnswers[i]));
                    li.appendChild(text);
                    li.classList.add("answer");
                    li.id = i;
                    document.getElementById("answerList").appendChild(li);
                }

                // JOKERS
                $('#jokerFriendBtn').click(function () { 
                    var randomIndex = Math.floor(Math.random() * 4) + 1;

                    for (var i = 0; i < 4; i++) {
                        if (i == randomIndex) {
                            console.log(allAnswers[i]);
                            alert("You have decided to call one of your friends.\nHe thinks the answer is " + allAnswers[i]);
                            $("#suggestedAnswerByFriend").html("Suggested answer by your friend is: " + allAnswers[i]);
                        }
                    }
                    $(this).attr('disabled', true);
                });

                $("#jokerFiftyBtn").click(function () {
                    var indexToRemove = allAnswers.indexOf(correctAnswer);
                    allAnswers.splice(indexToRemove,1);
                    alert("The game says the right answer is not among " + allAnswers[1] +  " or " + allAnswers[2]);
                    $("#suggestedAnswerByFifty").html("The game elimates the following answers: " + allAnswers[1] + " and " + allAnswers[2]);
                    $(this).attr('disabled', true);
                });

                $("#jokerPublicBtn").click(function () {
                        alert("You have decided to ask the public.\n There are 70% votes for " + correctAnswer);
                        $("#suggestedAnswerByPublic").html("Suggested answer by public is: " + correctAnswer);
                        $(this).attr('disabled', true);
                });

                // SELECTING AN ANSWER 
                document.querySelector("#answerList").addEventListener("click", function () {
                    var answers = document.getElementsByClassName("answer");
                    if (event.target.id == "answerList") { // Prevent highlight from being applied to parent DIV
                        return;
                    }
                    // Remove previous highlight
                    for (var i = 0; i < answers.length; i++) {
                        if (answers[i].classList.contains("selectedAnswer")) {
                            answers[i].classList.remove("selectedAnswer");
                        }
                    }
                    // Highlight new selection
                    event.target.classList.add("selectedAnswer");
                    userChoice = event.target.id;
                });


                // SUMBITING ANSWER 
                $("#nextBtn").click(function () {
                    var answers = document.getElementsByClassName("answer");
                    if (userChoice == answerIndex) { // If users choice is correct...
                        answers[userChoice].classList.add("correctAnswer"); // Highlight green
                        score++;
                        count++; // Increment question counter

                        console.log("HI IM HERE");
                        console.log(score);
                        if (count < questionCollection.length) {
                            $("#answerList").empty(); // Clear elements from previous question
                            generateNewQuestion();
                            updateResult();
                        } else {
                            // another modal box perhaps congratulating you
                            console.log("You've won 1 million!");
                        }

                    } else {
                        $("questionCaption").html("");
                        $("#answerList").html("");
                        $("#nextBtn").hide();
                        $("#suggestedAnswerByFriend").hide();
                        $("#suggestedAnswerByPublic").hide();
                        $("#suggestedAnswerByFifty").hide();
                        $("#questionField").html("Sorry wrong answer. Game is over for you.");
                        $("#restartBtn").show();
                        console.log("Game over.");
                    }

                    function generateNewQuestion() {

                        var allAnswers = [];
                        var correctAnswer = questionCollection[count].correct_answer;
                        $("#answerList").empty(); // Clear elements from previous question

                        // Create an array from all of the answers
                        questionCollection[count].incorrect_answers.forEach(function (answer) {
                            allAnswers.push(answer);
                        });

                        // Push correct answer into array at random index
                        allAnswers.join();
                        allAnswers.splice(Math.floor(Math.random() * 4), 0, correctAnswer);
                        allAnswers.join();

                        // Record the index of the correct answer in the array so it can be compared with the index of users choice
                        answerIndex = allAnswers.indexOf(correctAnswer);

                        // Append question to the DOM
                        var countDisplay = count + 1;
                        $("#questionField").html("Question Number " + countDisplay + "<br>" + questionCollection[count].question);

                        for (var i = 0; i < allAnswers.length; i++) { // Loop through answers and append each to list
                            var li = document.createElement("li");
                            var text = document.createTextNode(decodeHTML(allAnswers[i]));
                            li.appendChild(text);
                            li.classList.add("answer");
                            li.id = i;
                            document.getElementById("answerList").appendChild(li);
                        }

                    }

                    function updateResult() {
                        switch (score) {
                            case 0:
                                $("#score").html("50$");
                                break;
                            case 1:
                                $("#score").html("100$");
                                break;
                            case 2:
                                $("#score").html("200$");
                                break;
                            case 3:
                                $("#score").html("300$");
                                break;
                            case 4:
                                $("#score").html("500$");
                                break;
                            case 5:
                                $("#score").html("700$");
                                break;
                            case 6:
                                $("#score").html("1000$");
                                break;
                            case 7:
                                $("#score").html("1500$");
                                break;
                            case 8:
                                $("#score").html("2000$");
                                break;
                            case 9:
                                $("#score").html("2500$");
                                break;
                            case 10:
                                $("#score").html("5000$");
                                break;
                            case 11:
                                $("#score").html("10000$");
                                break;
                            case 12:
                                $("#score").html("15000$");
                                break;
                            case 13:
                                $("#score").html("20000$");
                                break;
                            case 14:
                                $("#score").html("100000$");
                                break;
                            default:
                                $("#score").html("0$");
                                break;
                        }
                    };



                });

            });

        });

        console.log(questionCollection);
        return tempCollection;
    });
};

var startGame = () => {
    $("#score").html("0$");
    generateQuestions();
};

function decodeHTML(html) {
    var text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
}

// modal box logic
var modal = document.getElementById("myModal");
var btn = document.getElementById("modalBtn");
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}