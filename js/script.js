const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultElement = document.getElementById('result');

let shuffledQuestions, currentQuestionIndex, correctAnswers, totalQuestions, timerInterval;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

function startGame() {
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    totalQuestions = questions.length;
    questionContainerElement.classList.remove('hide');
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
        startButton.innerText = 'Restart';
        startButton.classList.remove('hide');
        resultElement.innerText = `Number of correct Answer: ${correctAnswers} / ${totalQuestions}`;
    }
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

const questions = [{
        question: 'Who is Harry Potter?',
        answers: [
            { text: 'The most famous Wizard on earth', correct: true },
            { text: 'Voldemort', correct: false },
            { text: 'A dog', correct: false },
            { text: 'A cat', correct: false }
        ]
    },
    {
        question: 'What is the name of Harry Potters School?',
        answers: [
            { text: 'Gringotts', correct: false },
            { text: 'Hogwarts', correct: true },
            { text: 'Slytherin', correct: false },
            { text: 'Azkaban', correct: false }
        ]
    },
    {
        question: 'Who killed Harrys parents?',
        answers: [
            { text: 'Prof. Dumbledore', correct: false },
            { text: 'Madame Pomfrey', correct: false },
            { text: 'Lord Voldemort', correct: true },
            { text: 'Prof. Snape', correct: false }
        ]
    },
    {
        question: 'What kind of animal does Harry Potter have?',
        answers: [
            { text: 'A Cat', correct: false },
            { text: 'A Dog', correct: false },
            { text: 'An Owl', correct: true },
            { text: 'A Rabbit', correct: false }
        ]
    }
];