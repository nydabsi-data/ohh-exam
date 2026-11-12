# Ohh-Exam

A website for practising pilot exam questions in short lessons, in the style of Duolingo: a learning path, hearts, XP, a streak and a daily goal. We build the website first and turn it into a mobile app later.

## Run it

- **Quickest:** double-click `index.html`. Everything works except offline mode.
- **Like a real website (PWA + offline):** open the folder in VS Code and use *Live Server*, or deploy to Vercel or Netlify as a static site.

No build step. Plain HTML, CSS and JavaScript.

## Structure

```
index.html            Single page (home path / lesson / result)
css/style.css         All styles
js/app.js             App logic: path, lessons, hearts, XP, streak
data/questions.js     Question bank (units → lessons → questions)
manifest.webmanifest  PWA manifest (install to home screen)
sw.js                 Service worker (offline cache)
icon.svg              App icon
```

## Adding questions

Edit `data/questions.js`. Each unit has `lessons`, and each lesson has `questions`:

```js
{ type: 'mc',    q: 'Question?', o: ['A', 'B', 'C', 'D'], a: 0, ex: 'Explanation' }   // a = index of the right option
{ type: 'tf',    q: 'Statement.', a: true, ex: '...' }
{ type: 'match', q: 'Match ...', pairs: [['Left', 'Right'], ...], ex: '...' }
```

Options are shuffled automatically. **Don't change a lesson `id` after release**, because saved progress is keyed by it.

> The current questions are samples for building the app. Check them against official material (CAAT / ICAO / ATPL theory) before real use.

## How the game works

- Lessons unlock in order. A finished lesson turns gold and can be replayed.
- A wrong answer costs 1 heart and the question comes back at the end of the lesson.
- 5 hearts. 1 heart refills every 30 minutes.
- 10 XP per correct answer. Daily goal 50 XP. Finishing a lesson each day keeps the streak.
- Keyboard: `1`–`9` picks an answer, `Enter` checks or continues, `Esc` quits the lesson.

Progress is saved in the browser (`localStorage`).

## Roadmap

1. **Content:** a real question bank and an Excel/CSV import tool.
2. **Accounts:** sign-in and progress sync with Supabase (so progress follows you across devices).
3. **Mock exam mode:** timed, real exam length, score by subject.
4. **Review mistakes:** collect questions you got wrong and repeat them (spaced repetition).
5. **Leaderboard:** weekly XP leagues.
6. **Mobile app:** wrap this web code with Capacitor (iOS/Android), or install it as a PWA.
