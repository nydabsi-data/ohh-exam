const TEST_SIZE = 10;
const TEST_SECONDS = 3 * 60;
const PROMPT = "Which key below, when fitted into the piece above, will complete the whole shape?";

const screens = {
  home: document.getElementById("home-screen"),
  quiz: document.getElementById("quiz-screen"),
  result: document.getElementById("result-screen")
};

const quizForm = document.getElementById("quiz-form");
const timerEl = document.getElementById("timer");
const timerCard = document.querySelector(".timer-card");
const topbarTime = document.querySelector(".time-display");
const topbarStatus = document.querySelector(".status-dot");
const progressBar = document.getElementById("progress-bar");
const questionCount = document.getElementById("question-count");
const answeredCount = document.getElementById("answered-count");

let currentQuestions = [];
let selectedAnswers = {};
let secondsLeft = TEST_SECONDS;
let timerId = null;
let submitted = false;

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("submit-btn").addEventListener("click", () => finishQuiz());
document.getElementById("back-btn").addEventListener("click", showHome);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
updateTimer();

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo(0, 0);
}

function showHome() {
  clearInterval(timerId);
  submitted = false;
  secondsLeft = TEST_SECONDS;
  updateTimer();
  topbarStatus.textContent = "Practice Mode";
  topbarStatus.classList.remove("complete");
  showScreen("home");
}

function startQuiz() {
  selectedAnswers = {};
  submitted = false;
  secondsLeft = TEST_SECONDS;
  currentQuestions = buildTestSet();
  renderQuiz();
  updateTimer();
  topbarStatus.textContent = "Active Test";
  topbarStatus.classList.remove("complete");
  clearInterval(timerId);
  timerId = setInterval(tick, 1000);
  showScreen("quiz");
}

function buildTestSet() {
  const bank = window.SPATIAL_JIGSAW_BANK || { easy: [] };
  return shuffle([...bank.easy]).slice(0, TEST_SIZE).map((item, index) => ({
    ...item,
    displayNumber: index + 1
  }));
}

function renderQuiz() {
  quizForm.innerHTML = currentQuestions.map((item, index) => renderQuestion(item, index)).join("");

  quizForm.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener("change", (event) => {
      const index = Number(event.target.name.replace("q", ""));
      selectedAnswers[index] = event.target.value;
      updateChoiceSelection(event.target.name);
      updateProgress();
    });
  });

  updateProgress();
}

function updateChoiceSelection(groupName) {
  quizForm.querySelectorAll(`input[name="${groupName}"]`).forEach((input) => {
    input.closest(".option").classList.toggle("selected", input.checked);
  });
}

function renderQuestion(item, index) {
  const options = item.choices
    .map((choice) => `
      <label class="option">
        <input type="radio" name="q${index}" value="${choice.letter}" />
        ${svgPolygon(choice.polygon, `choice ${choice.letter}`, "choice-svg")}
        <span>${choice.letter}</span>
      </label>
    `)
    .join("");

  return `
    <article class="question-card">
      <div class="question-head">
        <span class="question-index">${index + 1}</span>
        <p class="question-text">${PROMPT}</p>
      </div>
      <div class="stem-wrap">${svgPolygon(item.stem, "incomplete jigsaw key", "stem-svg")}</div>
      <div class="options-grid">${options}</div>
    </article>
  `;
}

function tick() {
  secondsLeft -= 1;
  updateTimer();
  if (secondsLeft <= 0) {
    finishQuiz(true);
  }
}

function updateTimer() {
  const safeSeconds = Math.max(0, secondsLeft);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
  topbarTime.textContent = `${minutes}:${seconds}`;
  timerCard.classList.toggle("warning", safeSeconds <= 60);
}

function updateProgress() {
  const answered = Object.keys(selectedAnswers).length;
  const nextQuestion = Math.min(answered + 1, TEST_SIZE);
  questionCount.textContent = `Question ${nextQuestion} of ${TEST_SIZE}`;
  answeredCount.textContent = `${answered} answered`;
  progressBar.style.width = `${(answered / TEST_SIZE) * 100}%`;
}

function finishQuiz() {
  if (submitted) return;
  submitted = true;
  clearInterval(timerId);
  topbarStatus.textContent = "Completed";
  topbarStatus.classList.add("complete");

  const score = currentQuestions.reduce((total, item, index) => {
    return total + (selectedAnswers[index] === item.answer ? 1 : 0);
  }, 0);

  renderResult(score);
  showScreen("result");
}

function renderResult(score) {
  const percent = Math.round((score / TEST_SIZE) * 100);
  const band = getBand(percent);

  document.getElementById("result-title").textContent = band.title;
  document.getElementById("result-icon").textContent = band.icon;
  document.getElementById("score-percent").textContent = `${percent}%`;
  document.getElementById("score-detail").textContent = `${score} / ${TEST_SIZE} correct`;
  document.getElementById("result-message").textContent = band.message;

  document.getElementById("review-list").innerHTML = currentQuestions
    .map((item, index) => renderReviewItem(item, index))
    .join("");
}

function renderReviewItem(item, index) {
  const selected = selectedAnswers[index];
  const isCorrect = selected === item.answer;
  const correctChoice = item.choices.find((choice) => choice.letter === item.answer);
  const userAnswer = selected || "No answer";

  return `
    <article class="review-card ${isCorrect ? "correct" : "wrong"}">
      <h4>${index + 1}. ${PROMPT}</h4>
      <p class="${isCorrect ? "answer-good" : "answer-bad"}">Your answer: ${userAnswer}</p>
      <p><strong>Correct answer:</strong> ${item.answer}</p>
      <div class="review-figures">
        <div class="review-figure">${svgPolygon(item.stem, "review incomplete jigsaw key", "")}</div>
        <div class="review-figure">${svgPolygon(correctChoice.polygon, "review correct key", "")}</div>
      </div>
    </article>
  `;
}

function getBand(percent) {
  if (percent >= 85) {
    return {
      title: "Excellent",
      icon: "★★★★★",
      message: "ทำได้ยอดเยี่ยมมาก มอง pattern ของชิ้นส่วนและรอยต่อได้แม่น"
    };
  }
  if (percent >= 70) {
    return {
      title: "Very Good",
      icon: "★★★★",
      message: "ทำได้ดีมาก เหลือเพียงเพิ่มความเร็วและความละเอียดในการเทียบมุม"
    };
  }
  if (percent >= 50) {
    return {
      title: "Need More Practice",
      icon: "★★★",
      message: "พื้นฐานใช้ได้แล้ว แนะนำฝึกเทียบแนวขอบ มุม และจำนวนรอยหยักให้เร็วขึ้น"
    };
  }
  return {
    title: "Study More",
    icon: "★★",
    message: "ควรฝึกดูทิศทางของรอยตัดและจุดเริ่ม-จุดจบของ key เพิ่มเติม"
  };
}

function svgPolygon(points, label, className) {
  const classAttr = className ? ` class="${className}"` : "";
  return `
    <svg${classAttr} viewBox="-6 -6 112 112" role="img" aria-label="${label}">
      <polygon class="piece" points="${pointsText(points)}"></polygon>
    </svg>
  `;
}

function pointsText(points) {
  return points.map(([x, y]) => `${Number(x).toFixed(1)},${Number(y).toFixed(1)}`).join(" ");
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
