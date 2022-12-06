// Select elements and create jQuery objects.
const viewHighScoresEl = $(".view-high-scores");
const timerEl = $(".timer");
const mainEl = $("main");
const gameIntroContainerEl = $(".game-intro-container");
const questionContainerEl = $(".question-container");
const answerCheckContainerEl = $(".answer-check-container");
const gameResultContainerEl = $(".game-result-container");

// Create variables for question and answers.
const startButton = $("<button>").attr("class", "start-btn").text("Start Quiz");
const currentQuestion = $("<h1>").attr("class", "current-question");
const currentAnswersList = $("<ol>").attr("class", "answers-list");
const currentAnswersItem = $("<li>").attr("class", "answers-item");
const correctMessage = $("<h2>").attr("class", "correct-or-wrong").text("Correct!");
const wrongMessage = $("<h2>").attr("class", "correct-or-wrong").text("Wrong!");
let currentQuestionIdx;
let playerAnswer;

// Create variables to save scores.
const initialsInput = $("<input>").attr({ name: "initials-input", class: "initials-input" });
const submitButton = $("<button>").attr("class", "submit-btn").text("Submit");
const saveScoresForm = $("<form>").append("<label> Enter initials:</label>", initialsInput, submitButton);
let timeInterval;
let timeLeft;
let playerCurrentScores;
let isGameOver;

// Create variables to view high scores.
const highScoresList = $("<ol>").attr("class", "high-scores-list");
const highScoresItem = $("<li>").attr("class", "high-scores-item");
const goBackButton = $("<button>").attr("class", "go-back-btn").text("Go Back");
const clearHighScoresButton = $("<button>").attr("class", "clear-high-scores-btn").text("Clear High Scores");
const buttonContainer = $("<div>").attr("class", "button-container").append(goBackButton, clearHighScoresButton);
let scoresArr = [];

// Create an array to make quiz.
let questionsArray = [
    {
        question: "Commonly used data types DO NOT include:",
        answers: [
            "strings",
            "booleans",
            "alerts",
            "numbers"
        ],
        correctAnswer: "alerts"
    },
    {
        question: "Inside which HTML element do we put the JavaScript?",
        answers: [
            "<scripting>",
            "<js>",
            "<script>",
            "<javascript>"
        ],
        correctAnswer: "<script>"
    },
    {
        question: "The condition in an if/else statement is enclosed with ________.",
        answers: [
            "quotes",
            "curly brackets",
            "parenthesis",
            "square brackets"
        ],
        correctAnswer: "parenthesis"
    },
    {
        question: "How can you add a comment in a JavaScript?",
        answers: [
            "'This is a comment",
            "<!--This is a comment-->",
            "//this is a comment",
        ],
        correctAnswer: "//this is a comment"
    }
]

// The initGame function is called when the page loads.
function initGame () {
    // Reset default values.
    timerEl.text("Time: 0");
    gameIntroContainerEl.empty();
    questionContainerEl.empty();
    answerCheckContainerEl.empty();
    gameResultContainerEl.empty();
    currentQuestionIdx = 0;
    playerAnswer = "";
    playerCurrentScores = 0;
    isGameOver = false;
    playerAnswer = "";

    // Render the introduction to the game.
    gameIntroContainerEl.append(
        $("<h1>").text("Coding Quiz Challenge"),
        $("<p>").text("Try to answer the following code-related questions with the time limit. Keep in mind that incorrect answers will penalize your score/time by 15 seconds!"),
        startButton
    );

    // When the start quiz button is clicked, start quiz.
    startButton.on("click", startQuiz);
};

// The startQuiz function is called when the Start Quiz button is clicked.
function startQuiz () {
    // Clear the inside of .game-intro-container.
    gameIntroContainerEl.empty();
    // Start timer and show question.
    startTimer();
    renderQuestion();
}

// Show question.
function renderQuestion () {
    // Clear the inside of elements for creating quiz.
    questionContainerEl.empty();
    answerCheckContainerEl.empty();
    currentAnswersList.empty();
    currentAnswersItem.empty();
    // Set the current question.
    currentQuestion.text(questionsArray[currentQuestionIdx].question);
    // Set the list of answer choices.
    $(questionsArray[currentQuestionIdx].answers).each(function (i) {
        currentAnswersItem.text(questionsArray[currentQuestionIdx].answers[i]);
        currentAnswersList.append(currentAnswersItem.clone());
    })
    // Append the current question and answers list to .question-container.
    questionContainerEl.append(currentQuestion, currentAnswersList);

    // Check if answer is correct or not when it is clicked.
    currentAnswersList.on("click", ".answers-item", function () {
        answerCheckContainerEl.empty();
        // Set the clicked text to player answer.
        playerAnswer = $(this).text();
        // If the answer is correct, move on to the next question.
        if (playerAnswer === questionsArray[currentQuestionIdx].correctAnswer) {
            renderNextQuestion();
            answerCheckContainerEl.append($("<hr>"), correctMessage);
        }
        // If the answer is wrong, penalize time or finish the quiz.
        else {
            // If the remaining time is greater than 15, reduce time by 15 sec and show the next question.
            if (timeLeft > 15) {
                timeLeft = timeLeft - 15;
                renderNextQuestion();
                answerCheckContainerEl.append($("<hr>"), wrongMessage);
            }
            // If the remaining time is less than or equal to 15, finish the quiz.
            else {
                timeLeft = 0;
                isGameOver = true;
                answerCheckContainerEl.append($("<hr>"), wrongMessage);
                return;
            }
        }
    })
}

// Show the next question.
function renderNextQuestion () {
    // If there are more questions left, increase the index and show the next question.
    if (currentQuestionIdx < questionsArray.length - 1) {
        currentQuestionIdx++;
        // Call back the renderQuestion function.
        renderQuestion();
    }
    // If there is no more question left, finish the quiz.
    else if (currentQuestionIdx === questionsArray.length - 1) {
        isGameOver = true;
        return;
    }
}

// The startTimer function is called when the start quiz button is clicked.
function startTimer () {
    // Timer counts down from 60.
    timeLeft = 60;
    timerEl.text("Time: " + timeLeft);
    // Use the `setInterval()` method to call a function to be executed every 1000 milliseconds.
    timeInterval = setInterval(function () {
        // If player finishes quiz in time, set the scores and clear interval.
        if (isGameOver) {
            clearInterval(timeInterval);
            playerCurrentScores = timeLeft;
            timerEl.text("Time: " + timeLeft);
            saveScores();
            return false;
        }
        timeLeft--;
        timerEl.text("Time: " + timeLeft);

        // If time has run out, clear interval and show result.
        if (timeLeft === 0) {
            timerEl.text("Time: 0");
            clearInterval(timeInterval);
            saveScores();
        }
    }, 1000);
}

// Create a function to insert the new object in array in descending order by scores.
function insertObjToArr (arr, newObj) {
    // If array is empty, add the new object to the array.
    if (arr.length === 0) {
        arr.push(newObj);
    }
    // If array is not empty, compare the scores of the new object and each element in array.
    else {
        $(arr).each(function (i) {
            // If current element has higher scores and next element exists, move to the next element.
            if (arr[i].scores > newObj.scores && arr[i + 1]) {
                return true;
            }
            // If the new object has higher or equal scores, insert the object at the index of current element in array.
            else if (arr[i].scores <= newObj.scores) {
                arr.splice(i, 0, newObj);
                return false;
            }
            // If the new object has smaller scores than all the elements in array, add the object to the end of array.
            else {
                arr.push(newObj);
                return false;
            }
        })
    }
};

// Create a function to store an array in local storage.
function storeArr (arr) {
    localStorage.setItem("storedScoresList", JSON.stringify(arr));
};

// The saveScores function is called when player finishes quiz in time or when time has run out.
function saveScores () {
    questionContainerEl.empty();

    // Render the game result.
    gameResultContainerEl.append(
        $("<h1>").text("All done!"),
        $("<p>").text("Your final score is " + playerCurrentScores + "."),
        saveScoresForm
    );

    // When the submit button is clicked, save the scores and show the stored high scores.
    submitButton.on("click", function handleFormSubmit (e) {
        e.preventDefault();

        // If input field is empty, prompt player to enter initials.
        if (!initialsInput.val()) {
            window.alert("Please enter your initials!");
        }
        else {
            // Create a new object to be saved.
            const newPlayer = {
                initials: initialsInput.val(),
                scores: playerCurrentScores
            }

            // Call the insertObjToArr function to store current player's scores in array.
            insertObjToArr(scoresArr, newPlayer);
            // Call the storeArr function to store the newly added list in local storage.
            storeArr(scoresArr);

            // Clear the input form.
            initialsInput.val("");
            // Show high scores.
            renderHighScores();
        }
    });
}

// The renderHighScores function is called when initials form is submitted.
function renderHighScores () {
    timerEl.text("Time: 0");
    gameIntroContainerEl.empty();
    gameResultContainerEl.empty();
    questionContainerEl.empty();
    answerCheckContainerEl.empty();
    highScoresList.empty();
    highScoresItem.empty();

    // Get stored high scores from localStorage.
    scoresArr = JSON.parse(localStorage.getItem("storedScoresList"));

    // Show the high scores.
    const highScoresHeadings = $("<h1>").text("High scores");
    $.each(scoresArr, function (i, val) {
        highScoresItem.text(scoresArr[i].initials + " - " + scoresArr[i].scores)
        highScoresList.append(highScoresItem.clone());
    });
    gameResultContainerEl.append(highScoresHeadings, highScoresList, buttonContainer);

    // If the Go Back button is clicked, call back the initGame function.
    goBackButton.on("click", initGame);

    // If the Clear High Scores button is clicked, clear the scoresArr and local storage.
    clearHighScoresButton.on("click", function () {
        scoresArr = [];
        localStorage.clear();
        highScoresList.empty();
        highScoresItem.empty();
    })
}

// When 'View high Scores' is clicked, stop the timer and show high scores.
viewHighScoresEl.on("click", function () {
    clearInterval(timeInterval);
    renderHighScores();
});

// Run the game when page is loaded.
initGame();