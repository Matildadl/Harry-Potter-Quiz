document.addEventListener("DOMContentLoaded", function () {
    // Get references to all the elements we need to use
    const elements = {
      startButton: document.getElementById("start-btn"),
      nextButton: document.getElementById("next-btn"),
      questionContainerElement: document.getElementById("question-container"),
      questionElement: document.getElementById("question"),
      answerButtonsElement: document.getElementById("answer-buttons"),
      resultButton: document.querySelector(".result-button"),
      resultElement: document.getElementById("result"),
      summaryElement: document.getElementById("summary"),
    };
  
    // Quiz variables
    let shuffledQuestions, currentQuestionIndex, correctAnswers, totalQuestions;
  
    // Variables for high score and number of games played
    let highScore = localStorage.getItem("highScore") || 0;
    let gamesPlayed = parseInt(localStorage.getItem("gamesPlayed")) || 0;
  
    // Add event listeners for buttons and the modal
    elements.startButton.addEventListener("click", startGame);
    elements.nextButton.addEventListener("click", () => {
      currentQuestionIndex++;
      setNextQuestion();
    });
    elements.resultButton.addEventListener("click", showResults);
  
    // Function to start the game
    function startGame() {
      const gamesPlayedElement = document.getElementById("games-played");
      gamesPlayedElement.innerText = gamesPlayed;
      gamesPlayed++;
      localStorage.setItem("gamesPlayed", gamesPlayed);
  
      // Hide the start button and result button
      elements.startButton.classList.add("hide");
      elements.resultButton.classList.add("hide");
  
      // Shuffle the questions and restore index and number of correct answers
      shuffledQuestions = questions.sort(() => Math.random() - 0.5);
      currentQuestionIndex = 0;
      correctAnswers = 0;
      totalQuestions = questions.length;
  
      // Show query container and clear previous results
      elements.questionContainerElement.classList.remove("hide");
      elements.resultElement.innerText = "";
      elements.summaryElement.innerText = "";
  
      // Reset question status and show next question
      resetState();
      setNextQuestion();
    }
  
    // Function to display the next question
    function setNextQuestion() {
      resetState();
      showQuestionWithTransition(shuffledQuestions[currentQuestionIndex]);
    }
  
    // Feature to show question with transition effect
    function showQuestionWithTransition(question) {
      const questionContainer = document.getElementById("question-container");
      questionContainer.style.opacity = "0";
      setTimeout(() => {
        elements.questionElement.innerText = question.question;
        question.answers.forEach((answer) => {
          const button = document.createElement("button");
          button.innerText = answer.text;
          button.classList.add("btn");
          if (answer.correct) {
            button.dataset.correct = answer.correct;
          }
          button.addEventListener("click", selectAnswer);
          elements.answerButtonsElement.appendChild(button);
        });
        questionContainer.style.opacity = "1";
      }, 300);
    }
  
    // Function to restore game state
    function resetState() {
      clearStatusClass(document.body);
      elements.nextButton.classList.add("hide");
      while (elements.answerButtonsElement.firstChild) {
        elements.answerButtonsElement.removeChild(
          elements.answerButtonsElement.firstChild
        );
      }
    }
  
    // Function to manage reply clicks
    function selectAnswer(e) {
      const selectedButton = e.target;
      const correct = selectedButton.dataset.correct;
      if (correct) {
        correctAnswers++;
      }
      setStatusClass(document.body, correct);
      Array.from(elements.answerButtonsElement.children).forEach((button) => {
        setStatusClass(button, button.dataset.correct);
      });
      if (shuffledQuestions.length > currentQuestionIndex + 1) {
        elements.nextButton.classList.remove("hide");
      } else {
        elements.resultButton.classList.remove("hide");
      }
      updateSummary();
    }
  
    // Function to specify response status class
    function setStatusClass(element, correct) {
      clearStatusClass(element);
      if (correct) {
        element.classList.add("correct");
      } else {
        element.classList.add("wrong");
      }
    }
  
    // Function to remove response status class
    function clearStatusClass(element) {
      element.classList.remove("correct");
      element.classList.remove("wrong");
    }
  
    // Feature to display results after all questions are answered
    function showResults() {
      elements.startButton.innerText = "Restart";
      elements.startButton.classList.remove("hide");
      elements.resultElement.innerText = `Number of correct answers: ${correctAnswers} / ${totalQuestions}`;
      elements.resultElement.classList.remove("hide");
      document.getElementById("high-score-container").style.display = "block";
      endQuiz();
      displayHighScore();
    }
  
    // Function to update the summary information
    function updateSummary() {
      elements.summaryElement.innerText = `Number of correct answers: ${correctAnswers} / ${totalQuestions}`;
      elements.resultElement.classList.remove("hide");
    }
  
    // Function to display the high score container
    function showHighScoreContainer() {
      const highScoreContainer = document.getElementById("high-score-container");
      highScoreContainer.classList.remove("hide");
    }
  
    // Function to update high score
    function updateHighScore(score) {
      const currentHighScore =
        parseInt(localStorage.getItem("highScore"), 10) || 0;
      if (score > currentHighScore) {
        localStorage.setItem("highScore", score);
        displayHighScore();
      }
    }
  
    // Function to show high score
    function displayHighScore() {
      const highScore = localStorage.getItem("highScore");
      document.getElementById(
        "high-score"
      ).innerText = `High Score: ${highScore}`;
      showHighScoreContainer();
      }
  
    // Function to end the quiz
    function endQuiz() {
      const score = calculateScore();
      updateHighScore(score);
      displayHighScore();
    }
  
    // Function to calculate the score
    function calculateScore() {
      return correctAnswers;
    }
  
    // Call displayHighScore() when the page loads to display the high score from the start
    displayHighScore();
  });