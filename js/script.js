document.addEventListener('DOMContentLoaded', function() {
    // Hämta referenser till alla element vi behöver använda
    const elements = {
        startButton: document.getElementById('start-btn'),
        nextButton: document.getElementById('next-btn'),
        questionContainerElement: document.getElementById('question-container'),
        questionElement: document.getElementById('question'),
        answerButtonsElement: document.getElementById('answer-buttons'),
        resultButton: document.querySelector('.result-button'),
        resultElement: document.getElementById('result'),
        summaryElement: document.getElementById('summary'),
        
    };

    // Variabler för frågespel
    let shuffledQuestions, currentQuestionIndex, correctAnswers, totalQuestions;

    // Variabler för high score och antal spelade spel
    let highScore = localStorage.getItem('highScore') || 0;
    let gamesPlayed = parseInt(localStorage.getItem('gamesPlayed')) || 0;

    // Lägg till händelselyssnare för knappar och modalen
    elements.startButton.addEventListener('click', startGame);
    elements.nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
    elements.resultButton.addEventListener('click', showResults);
    
    // Funktion för att starta spelet
    function startGame() {
        const gamesPlayedElement = document.getElementById('games-played');
        gamesPlayedElement.innerText = gamesPlayed;
        gamesPlayed++;
        localStorage.setItem('gamesPlayed', gamesPlayed);

        // Dölj startknappen och resultatkknappen
        elements.startButton.classList.add('hide');
        elements.resultButton.classList.add('hide');

        // Blanda frågorna och återställ index och antal korrekta svar
        shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        correctAnswers = 0;
        totalQuestions = questions.length;

        // Visa frågecontainer och rensa tidigare resultat
        elements.questionContainerElement.classList.remove('hide');
        elements.resultElement.innerText = '';
        elements.summaryElement.innerText = '';

        // Återställ frågestatus och visa nästa fråga
        resetState();
        setNextQuestion();
    }

    
    // Funktion för att visa nästa fråga
    function setNextQuestion() {
        resetState();
        showQuestionWithTransition(shuffledQuestions[currentQuestionIndex]);
    }

    // Funktion för att visa fråga med övergångseffekt
    function showQuestionWithTransition(question) {
        const questionContainer = document.getElementById('question-container');
        questionContainer.style.opacity = '0';
        setTimeout(() => {
            elements.questionElement.innerText = question.question;
            question.answers.forEach(answer => {
                const button = document.createElement('button');
                button.innerText = answer.text;
                button.classList.add('btn');
                if (answer.correct) {
                    button.dataset.correct = answer.correct;
                }
                button.addEventListener('click', selectAnswer);
                elements.answerButtonsElement.appendChild(button);
            });
            questionContainer.style.opacity = '1';
        }, 300);
    }

    // Funktion för att återställa spelstatus
    function resetState() {
        clearStatusClass(document.body);
        elements.nextButton.classList.add('hide');
        while (elements.answerButtonsElement.firstChild) {
            elements.answerButtonsElement.removeChild(elements.answerButtonsElement.firstChild);
        }
    }

    // Funktion för att hantera svarsklick
    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct;
        if (correct) {
            correctAnswers++;
        }
        setStatusClass(document.body, correct);
        Array.from(elements.answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct);
        });
        if (shuffledQuestions.length > currentQuestionIndex + 1) {
            elements.nextButton.classList.remove('hide');
        } else {
            elements.resultButton.classList.remove('hide');
        }
        updateSummary();
    }

    // Funktion för att ange klass för svarstatus
    function setStatusClass(element, correct) {
        clearStatusClass(element);
        if (correct) {
            element.classList.add('correct');
        } else {
            element.classList.add('wrong');
        }
    }

    // Funktion för att ta bort klass för svarstatus
    function clearStatusClass(element) {
        element.classList.remove('correct');
        element.classList.remove('wrong');
    }

    // Funktion för att visa resultat efter att alla frågor har besvarats
    function showResults() {
        elements.startButton.innerText = 'Restart';
        elements.startButton.classList.remove('hide');
        elements.resultElement.innerText = `Number of correct answers: ${correctAnswers} / ${totalQuestions}`;
        elements.resultElement.classList.remove('hide');
        endQuiz();
        displayHighScore();
    }

    // Funktion för att uppdatera summeringsinformationen
    function updateSummary() {
        elements.summaryElement.innerText = `Number of correct answers: ${correctAnswers} / ${totalQuestions}`;
        elements.resultElement.classList.remove('hide');
    }

    // Funktion för att visa behållaren för high score
    function showHighScoreContainer() {
        const highScoreContainer = document.getElementById('high-score-container');
        highScoreContainer.classList.remove('hide');
    }

    // Funktion för att uppdatera high score
    function updateHighScore(score) {
        const currentHighScore = parseInt(localStorage.getItem('highScore'), 10) || 0;
        if (score > currentHighScore) {
            localStorage.setItem('highScore', score);
            displayHighScore();
        }
    }

    // Funktion för att visa high score
    function displayHighScore() {
        const highScore = localStorage.getItem('highScore');
        document.getElementById('high-score').innerText = `High Score: ${highScore}`;
        showHighScoreContainer();
        console.log(highScore);
    }

    // Funktion för att avsluta frågespelet
    function endQuiz() {
        const score = calculateScore();
        updateHighScore(score);
        displayHighScore();
    }

    // Funktion för att beräkna poängen
    function calculateScore() {
        return correctAnswers;
    }

    // Anropa displayHighScore() när sidan laddas för att visa high score från början
    displayHighScore();
});