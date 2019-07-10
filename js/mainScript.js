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

                //  $("#questionField").html("<br>" + questionCollection[0].question + "<br>");
                //  $("#questionOptions").html(questionCollection[0].correct_answer);

                var count = 0;
                var score = 1;

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
                        if (count < questionCollection.length) {
                            $("#answerList").empty(); // Clear elements from previous question
                            generateNewQuestion();
                        } else {
                            
                            console.log("You've won 1 million!");
                        }

                    } else {
                        $("questionCaption").html("");
                        $("#answerList").html("");
                        $("#nextBtn").hide();
                        $("#questionField").html("Sorry wrong answer. Game is over for you.");
                        // you've won edi kakvo si
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
                        $("#questionField").html(questionCollection[count].question);
                    
                        for (var i = 0; i < allAnswers.length; i++) { // Loop through answers and append each to list
                            var li = document.createElement("li");
                            var text = document.createTextNode(decodeHTML(allAnswers[i]));
                            li.appendChild(text);
                            li.classList.add("answer");
                            li.id = i;
                            document.getElementById("answerList").appendChild(li);
                        }

                    }
                });
                //kraq na ajax wrapper-a nai vutreshniq
            });

        });

        console.log(questionCollection);

        return tempCollection;
    });

};

var startGame = () => {
    generateQuestions();
};

function decodeHTML(html) {
    var text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
}

var updateQuestion = (questionCollection) => {

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

};

// modal box 
// Get the modal and the button that opens it
var modal = document.getElementById("myModal");
var btn = document.getElementById("modalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}