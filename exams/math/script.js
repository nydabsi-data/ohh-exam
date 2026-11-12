const TEST_CONFIG = {
  title: "Math Test (Free Version)",
  questionCount: 20,
  timeLimitSeconds: 30 * 60,
};

const state = {
  questions: [],
  answers: {},
  remainingSeconds: TEST_CONFIG.timeLimitSeconds,
  timerId: null,
  submitted: false,
};

const screens = {
  home: document.querySelector("#home-screen"),
  quiz: document.querySelector("#quiz-screen"),
  result: document.querySelector("#result-screen"),
};

const startButton = document.querySelector("#start-btn");
const quizForm = document.querySelector("#quiz-form");
const submitButton = document.querySelector("#submit-btn");
const timerElement = document.querySelector("#timer");
const topbarTimer = document.querySelector(".time-display");
const questionCountElement = document.querySelector("#question-count");
const answeredCountElement = document.querySelector("#answered-count");
const progressBar = document.querySelector("#progress-bar");
const resultTitle = document.querySelector("#result-title");
const resultIcon = document.querySelector("#result-icon");
const scorePercent = document.querySelector("#score-percent");
const scoreDetail = document.querySelector("#score-detail");
const scoreMessage = document.querySelector("#score-message");
const reviewList = document.querySelector("#review-list");
const restartButton = document.querySelector("#restart-btn");
const backButton = document.querySelector("#back-btn");
const statusDot = document.querySelector(".status-dot");

const showScreen = (name) => {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const shuffle = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const formatMathText = (value) => String(value)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/\^(-?\d+(?:\.\d+)?)/g, '<sup>$1</sup>');

const getAnswerText = (question, label) => {
  if (!label) return "Skipped";
  const option = question.options.find((item) => item.label === label);
  return option ? `${option.label}. ${formatMathText(option.text)}` : "Skipped";
};

const validateQuestionBank = () => {
  const bank = window.MATH_QUESTION_BANK || [];
  const problems = [];

  if (bank.length < TEST_CONFIG.questionCount) {
    problems.push(`Need at least ${TEST_CONFIG.questionCount} questions; found ${bank.length}.`);
  }

  bank.forEach((question, index) => {
    if (!question.id || !question.question || !Array.isArray(question.options) || question.options.length !== 4) {
      problems.push(`Question ${index + 1} is incomplete.`);
    }
    if (!question.options.some((option) => option.label === question.answer)) {
      problems.push(`Question ${question.id || index + 1} has an invalid answer key.`);
    }
    if (!question.explanation) {
      problems.push(`Question ${question.id || index + 1} is missing an explanation.`);
    }
  });

  if (problems.length) {
    throw new Error(problems.join("\n"));
  }
};

const renderQuestions = () => {
  quizForm.innerHTML = state.questions.map((question, index) => {
    const options = question.options.map((option) => `
      <label>
        <input type="radio" name="${question.id}" value="${option.label}" ${state.answers[question.id] === option.label ? "checked" : ""} />
        <span>${option.label}. ${formatMathText(option.text)}</span>
      </label>
    `).join("");

    return `
      <article class="question-card">
        <div class="question-head">
          <strong>Question ${index + 1}</strong>
          <span>${question.category}</span>
        </div>
        <h3>${formatMathText(question.question)}</h3>
        <div class="option-list">${options}</div>
      </article>
    `;
  }).join("");

  quizForm.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener("change", (event) => {
      state.answers[event.target.name] = event.target.value;
      updateProgress();
    });
  });
};

const updateProgress = () => {
  const answered = state.questions.filter((question) => state.answers[question.id]).length;
  const total = state.questions.length;
  questionCountElement.textContent = `Question ${Math.min(answered + 1, total)} of ${total}`;
  answeredCountElement.textContent = `${answered} answered`;
  progressBar.style.width = `${(answered / total) * 100}%`;
};

const tick = () => {
  state.remainingSeconds -= 1;
  timerElement.textContent = formatTime(state.remainingSeconds);
  topbarTimer.textContent = formatTime(state.remainingSeconds);

  if (state.remainingSeconds <= 0) {
    submitTest();
  }
};

const startTimer = () => {
  clearInterval(state.timerId);
  timerElement.textContent = formatTime(state.remainingSeconds);
  topbarTimer.textContent = formatTime(state.remainingSeconds);
  state.timerId = setInterval(tick, 1000);
};

const startTest = () => {
  validateQuestionBank();
  state.questions = shuffle(window.MATH_QUESTION_BANK).slice(0, TEST_CONFIG.questionCount);
  state.answers = {};
  state.remainingSeconds = TEST_CONFIG.timeLimitSeconds;
  state.submitted = false;
  statusDot.textContent = "Practice Mode";
  statusDot.classList.remove("complete");
  renderQuestions();
  updateProgress();
  showScreen("quiz");
  startTimer();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getResultBand = (percent) => {
  if (percent >= 85) return { title: "Excellent", icon: "*****", message: "Strong performance. Keep reviewing skipped and missed items." };
  if (percent >= 70) return { title: "Good", icon: "****", message: "Good work. A little more review can raise the score." };
  if (percent >= 50) return { title: "Developing", icon: "***", message: "You are building the foundation. Review the answer key and retry." };
  return { title: "Needs Practice", icon: "**", message: "Focus on accuracy first, then speed. Restart when ready." };
};

function submitTest() {
  if (state.submitted) return;
  state.submitted = true;
  clearInterval(state.timerId);

  const correct = state.questions.reduce((count, question) => (
    state.answers[question.id] === question.answer ? count + 1 : count
  ), 0);
  const percent = Math.round((correct / state.questions.length) * 100);
  const band = getResultBand(percent);

  resultTitle.textContent = band.title;
  resultIcon.textContent = band.icon;
  scorePercent.textContent = `${percent}%`;
  scoreDetail.textContent = `${correct} / ${state.questions.length} correct`;
  scoreMessage.textContent = band.message;
  statusDot.textContent = "Completed";
  statusDot.classList.add("complete");

  reviewList.innerHTML = state.questions.map((question, index) => {
    const userAnswer = state.answers[question.id];
    const correctAnswer = question.answer;
    const status = !userAnswer ? "skipped" : userAnswer === correctAnswer ? "correct" : "incorrect";
    const statusText = status === "correct" ? "Correct" : status === "skipped" ? "Skipped" : "Incorrect";

    return `
      <article class="review-item ${status}">
        <h4>${index + 1}. ${formatMathText(question.question)}</h4>
        <p><strong>Status:</strong> ${statusText}</p>
        <p><strong>Your answer:</strong> ${getAnswerText(question, userAnswer)}</p>
        <p><strong>Correct answer:</strong> ${getAnswerText(question, correctAnswer)}</p>
        <p><strong>Solution:</strong> ${formatMathText(question.explanation)}</p>
      </article>
    `;
  }).join("");

  showScreen("result");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const goHome = () => {
  clearInterval(state.timerId);
  state.remainingSeconds = TEST_CONFIG.timeLimitSeconds;
  topbarTimer.textContent = formatTime(TEST_CONFIG.timeLimitSeconds);
  statusDot.textContent = "Practice Mode";
  statusDot.classList.remove("complete");
  showScreen("home");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

startButton.addEventListener("click", startTest);
submitButton.addEventListener("click", submitTest);
restartButton.addEventListener("click", startTest);
backButton.addEventListener("click", goHome);

validateQuestionBank();
