const TEST_SIZE = 12;
const TEST_SECONDS = 3 * 60;

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

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("submit-btn").addEventListener("click", () => finishQuiz(false));
document.getElementById("back-btn").addEventListener("click", showHome);
document.getElementById("restart-btn").addEventListener("click", startQuiz);

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo(0, 0);
}

function showHome() {
  clearInterval(timerId);
  secondsLeft = TEST_SECONDS;
  updateTimer();
  topbarStatus.textContent = "Practice Mode";
  topbarStatus.classList.remove("complete");
  showScreen("home");
}

function startQuiz() {
  selectedAnswers = {};
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
  const bank = window.AircraftQuestionBank;
  const usedSignatures = new Set();
  return pickUnique(bank.easy, TEST_SIZE, usedSignatures);
}

function renderQuiz() {
  quizForm.innerHTML = currentQuestions
    .map((item, index) => {
      const options = item.options
        .map((option) => `
          <label class="option">
            <input type="radio" name="q${index}" value="${option.label}" />
            <span>${option.label}. ${escapeHtml(option.text)}</span>
          </label>
        `)
        .join("");

      return `
        <article class="question-card">
          <div class="question-head">
            <span class="question-index">${index + 1}</span>
            <p class="question-text">What is the missing rotation?</p>
          </div>
          ${renderRotationStrip(item, true)}
          <div class="options-grid">${options}</div>
        </article>
      `;
    })
    .join("");

  quizForm.querySelectorAll("input[type='radio']").forEach((input) => {
    input.addEventListener("change", (event) => {
      const index = Number(event.target.name.replace("q", ""));
      selectedAnswers[index] = event.target.value;
      updateProgress();
    });
  });

  updateProgress();
}

function renderRotationStrip(item, includeMissing) {
  const sequence = item.commands
    .map((command) => `<span>${escapeHtml(command)}</span>`)
    .join("");
  const missing = includeMissing ? `<span class="missing-step">?</span>` : `<span>${escapeHtml(item.answerText)}</span>`;

  return `
    <div class="rotation-strip">
      <div class="plane-slot">${renderPlane(item.startHeading)}</div>
      <div class="sequence-row">${sequence}${missing}</div>
      <div class="plane-slot">${renderPlane(item.targetHeading)}</div>
    </div>
  `;
}

function renderPlane(heading) {
  const rotation = heading - 90;
  return `<img class="plane" src="assets/aircraft-sprite.png" alt="" style="transform: rotate(${rotation}deg)" />`;
}

function tick() {
  secondsLeft -= 1;
  updateTimer();
  if (secondsLeft <= 0) {
    finishQuiz(true);
  }
}

function updateTimer() {
  const minutes = Math.max(0, Math.floor(secondsLeft / 60)).toString().padStart(2, "0");
  const seconds = Math.max(0, secondsLeft % 60).toString().padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;
  topbarTime.textContent = `${minutes}:${seconds}`;
  timerCard.classList.toggle("warning", secondsLeft <= 60);
}

function updateProgress() {
  const answered = Object.keys(selectedAnswers).length;
  questionCount.textContent = `Question ${Math.min(answered + 1, TEST_SIZE)} of ${TEST_SIZE}`;
  answeredCount.textContent = `${answered} answered`;
  progressBar.style.width = `${(answered / TEST_SIZE) * 100}%`;
}

function finishQuiz(timedOut) {
  clearInterval(timerId);
  topbarStatus.textContent = timedOut ? "Time Up" : "Completed";
  topbarStatus.classList.add("complete");

  const score = currentQuestions.reduce((total, item, index) => {
    return total + (selectedAnswers[index] === item.answer ? 1 : 0);
  }, 0);

  renderResult(score, timedOut);
  showScreen("result");
}

function renderResult(score, timedOut) {
  const percent = Math.round((score / TEST_SIZE) * 100);
  const band = getBand(percent);

  document.getElementById("result-title").textContent = band.title;
  document.getElementById("result-icon").textContent = band.icon;
  document.getElementById("score-percent").textContent = `${percent}%`;
  document.getElementById("score-detail").textContent = `${score} / ${TEST_SIZE} correct`;
  document.getElementById("score-message").textContent = timedOut ? "หมดเวลาแล้ว ระบบส่งคำตอบให้อัตโนมัติ ตรวจเฉลยรายข้อด้านล่างได้เลย" : band.message;

  document.getElementById("review-list").innerHTML = currentQuestions
    .map((item, index) => {
      const selected = selectedAnswers[index];
      const isCorrect = selected === item.answer;
      const userAnswer = selected ? `${selected}. ${optionText(item, selected)}` : "No answer";
      const correctAnswer = `${item.answer}. ${item.answerText}`;

      return `
        <article class="review-card ${isCorrect ? "correct" : "wrong"}">
          <h4>${index + 1}. What is the missing rotation?</h4>
          ${renderRotationStrip(item, true)}
          <p class="${isCorrect ? "answer-good" : "answer-bad"}">Your answer: ${escapeHtml(userAnswer)}</p>
          <p><strong>Correct answer:</strong> ${escapeHtml(correctAnswer)}</p>
        </article>
      `;
    })
    .join("");
}

function getBand(percent) {
  if (percent >= 90) {
    return { title: "Excellent", icon: "★★★★★", message: "ยอดเยี่ยมมาก จับทิศทางและมุมหมุนพื้นฐานได้แม่นยำ" };
  }
  if (percent >= 75) {
    return { title: "Very Good", icon: "★★★★☆", message: "ทำได้ดีมาก เหลือเพียงเก็บรายละเอียดบางข้อ" };
  }
  if (percent >= 60) {
    return { title: "Pass", icon: "★★★☆☆", message: "ผ่านเกณฑ์แล้ว แนะนำฝึกความเร็วและความนิ่งเพิ่ม" };
  }
  return { title: "Keep Practicing", icon: "★★☆☆☆", message: "ควรฝึกเพิ่ม โดยเริ่มจากการรวมมุมให้เหลือ 0, 90, 180, 270 ก่อน" };
}

function optionText(item, label) {
  const option = item.options.find((entry) => entry.label === label);
  return option ? option.text : "";
}

function pickUnique(items, count, usedSignatures) {
  const picked = [];
  const shuffled = shuffle([...items]);

  for (const item of shuffled) {
    const signature = window.AircraftQuestionBank.questionSignature(item);
    if (usedSignatures.has(signature)) continue;
    picked.push(item);
    usedSignatures.add(signature);
    if (picked.length === count) break;
  }

  if (picked.length !== count) {
    throw new Error(`Not enough unique aircraft questions for this test section: ${picked.length}/${count}`);
  }

  return picked;
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
