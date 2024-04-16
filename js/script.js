const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultButton = document.querySelector('.result-button');
const resultElement = document.getElementById('result');
const summaryElement = document.getElementById('summary');

let shuffledQuestions, currentQuestionIndex, correctAnswers, totalQuestions;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
resultButton.addEventListener('click', showResults);

function startGame() {
    startButton.classList.add('hide');
    resultButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    totalQuestions = questions.length;
    questionContainerElement.classList.remove('hide');
    resultElement.innerText = '';
    summaryElement.innerText = '';
    resetState();
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestionWithTransition(shuffledQuestions[currentQuestionIndex]);
}

function showQuestionWithTransition(question) {
    const questionContainer = document.getElementById('question-container');
    questionContainer.style.opacity = '0';
    setTimeout(() => {
        questionElement.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            if (answer.correct) {
                button.dataset.correct = answer.correct;
            }
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        });
        questionContainer.style.opacity = '1';
    }, 300);
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    if (correct) {
        correctAnswers++;
    }
    setStatusClass(document.body, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        resultButton.classList.remove('hide');
    }
    updateSummary();
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showResults() {
    startButton.innerText = 'Restart';
    startButton.classList.remove('hide');
    resultElement.innerText = `Number of correct answers: ${correctAnswers} / ${totalQuestions}`;
    resultElement.classList.remove('hide');
}

function updateSummary() {
    summaryElement.innerText = `Number of correct answers: ${correctAnswers} / ${totalQuestions}`;
    resultElement.classList.remove('hide');
}

