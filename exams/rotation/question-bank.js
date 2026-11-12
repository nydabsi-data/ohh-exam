(function attachAircraftQuestionBank(global) {
  const LETTERS = ["A", "B", "C", "D", "E"];

  function mod360(value) {
    return ((value % 360) + 360) % 360;
  }

  function commandValue(text) {
    if (text === "0") return 0;
    const side = text.slice(-1);
    const degrees = Number(text.slice(0, -1));
    return side === "R" ? degrees : -degrees;
  }

  function commandClass(text) {
    if (text === "None" || text === "ไม่มีคำตอบ") return null;
    return mod360(commandValue(text));
  }

  function makePrng(seed) {
    let state = seed >>> 0;
    return function nextRandom() {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function pick(items, random) {
    return items[Math.floor(random() * items.length)];
  }

  function rotationText(targetClass, seed, unit, allowLarge) {
    const normalized = mod360(targetClass);
    const directionRight = (seed + normalized / unit) % 2 === 0;
    const signedBase = directionRight ? normalized : normalized === 0 ? 360 : normalized - 360;
    let degrees = Math.abs(signedBase);
    let side = signedBase >= 0 ? "R" : "L";

    if (degrees === 0) {
      degrees = 360;
      side = seed % 2 === 0 ? "R" : "L";
    }

    if (allowLarge) {
      const maxLoops = Math.max(0, Math.floor((900 - degrees) / 360));
      const loops = seed % (maxLoops + 1);
      degrees += 360 * loops;
    }

    return `${degrees}${side}`;
  }

  function makeOptions(correctClass, seed, unit, allowLarge) {
    const classes = [];
    const steps = 360 / unit;
    classes.push(mod360(correctClass));

    for (let offset = 1; classes.length < 4; offset += 1) {
      const candidate = mod360(correctClass + unit * ((seed + offset) % steps || offset));
      if (!classes.includes(candidate)) classes.push(candidate);
    }

    const optionTexts = classes.map((classValue, index) => {
      const textSeed = seed + index * 7;
      return rotationText(classValue, textSeed, unit, allowLarge);
    });

    optionTexts.push("ไม่มีคำตอบ");

    const correctText = optionTexts[0];
    const rotation = seed % optionTexts.length;
    const ordered = optionTexts.slice(rotation).concat(optionTexts.slice(0, rotation));
    const answerIndex = ordered.indexOf(correctText);

    return {
      options: ordered.map((text, index) => ({ label: LETTERS[index], text })),
      answer: LETTERS[answerIndex],
      answerText: correctText
    };
  }

  function makeQuestion(id, difficulty, unit, startIndex, commands, missingClass, optionSeed, allowLarge) {
    const startHeading = mod360(startIndex * unit);
    const visibleTotal = commands.reduce((sum, command) => sum + commandValue(command), 0);
    const targetHeading = mod360(startHeading + visibleTotal + missingClass);
    const optionSet = makeOptions(missingClass, optionSeed, unit, allowLarge);

    return {
      id,
      difficulty,
      startHeading,
      targetHeading,
      commands,
      options: optionSet.options,
      answer: optionSet.answer,
      answerText: optionSet.answerText,
      missingClass: mod360(missingClass)
    };
  }

  function questionSignature(question) {
    return [
      question.startHeading,
      question.targetHeading,
      question.commands.map((command) => commandClass(command)).join("|"),
      question.missingClass
    ].join("::");
  }

  function generateEasy() {
    const bank = [];
    const pool = [90, -90, 180, -180, 270, -270, 360, -360];
    const seen = new Set();
    let attempt = 0;

    while (bank.length < 200 && attempt < 20000) {
      const random = makePrng(11000 + attempt * 97);
      const startIndex = Math.floor(random() * 4);
      const commands = [];
      for (let step = 0; step < 5; step += 1) {
        commands.push(rotationText(pick(pool, random), 12000 + attempt + step * 13, 90, false));
      }
      const visibleClass = mod360(commands.reduce((sum, command) => sum + commandValue(command), 0));
      const targetClass = Math.floor(random() * 4) * 90;
      const missingClass = mod360(targetClass - visibleClass);
      const candidate = makeQuestion(`E-${String(bank.length + 1).padStart(3, "0")}`, "easy", 90, startIndex, commands, missingClass, 13000 + attempt, false);
      const signature = questionSignature(candidate);
      if (!seen.has(signature)) {
        seen.add(signature);
        bank.push(candidate);
      }
      attempt += 1;
    }

    return bank;
  }

  function generateMedium() {
    const bank = [];
    const pool = [90, -90, 180, -180, 270, -270, 360, -360, 450, -450, 540, -540, 630, -630, 720, -720, 810, -810, 900, -900];
    const largePool = pool.filter((value) => Math.abs(value) > 360);
    const seen = new Set();
    let attempt = 0;

    while (bank.length < 200 && attempt < 30000) {
      const random = makePrng(21000 + attempt * 131);
      const startIndex = Math.floor(random() * 4);
      const commands = [];
      for (let step = 0; step < 6; step += 1) {
        commands.push(rotationText(pick(pool, random), 22000 + attempt + step * 17, 90, step % 2 === 0));
      }
      if (!commands.some((command) => Number(command.slice(0, -1)) > 360)) {
        commands[2] = rotationText(pick(largePool, random), 23000 + attempt, 90, false);
      }
      const visibleClass = mod360(commands.reduce((sum, command) => sum + commandValue(command), 0));
      const targetClass = Math.floor(random() * 4) * 90;
      const missingClass = mod360(targetClass - visibleClass);
      const candidate = makeQuestion(`M-${String(bank.length + 1).padStart(3, "0")}`, "medium", 90, startIndex, commands, missingClass, 24000 + attempt, true);
      const signature = questionSignature(candidate);
      if (!seen.has(signature)) {
        seen.add(signature);
        bank.push(candidate);
      }
      attempt += 1;
    }

    return bank;
  }

  function generateHard() {
    const bank = [];
    const pool = [45, -45, 90, -90, 135, -135, 180, -180, 225, -225, 270, -270, 315, -315, 360, -360, 405, -405, 495, -495, 585, -585, 675, -675, 765, -765, 855, -855, 900, -900];
    const diagonalPool = pool.filter((value) => Math.abs(value) % 90 === 45);
    const largePool = pool.filter((value) => Math.abs(value) > 360);
    const seen = new Set();
    let attempt = 0;

    while (bank.length < 200 && attempt < 40000) {
      const random = makePrng(31000 + attempt * 149);
      const startIndex = Math.floor(random() * 8);
      const commands = [];
      for (let step = 0; step < 6; step += 1) {
        commands.push(rotationText(pick(pool, random), 32000 + attempt + step * 19, 45, true));
      }
      if (!commands.some((command) => Number(command.slice(0, -1)) % 90 === 45)) {
        commands[1] = rotationText(pick(diagonalPool, random), 33000 + attempt, 45, false);
      }
      if (!commands.some((command) => Number(command.slice(0, -1)) > 360)) {
        commands[3] = rotationText(pick(largePool, random), 34000 + attempt, 45, false);
      }
      const visibleClass = mod360(commands.reduce((sum, command) => sum + commandValue(command), 0));
      const targetClass = Math.floor(random() * 8) * 45;
      const missingClass = mod360(targetClass - visibleClass);
      const candidate = makeQuestion(`H-${String(bank.length + 1).padStart(3, "0")}`, "hard", 45, startIndex, commands, missingClass, 35000 + attempt, true);
      const signature = questionSignature(candidate);
      if (!seen.has(signature)) {
        seen.add(signature);
        bank.push(candidate);
      }
      attempt += 1;
    }

    return bank;
  }

  function validateQuestion(question) {
    const commandTotal = question.commands.reduce((sum, command) => sum + commandValue(command), 0);
    const expectedTarget = mod360(question.startHeading + commandTotal + commandValue(question.answerText));
    const matchingOptions = question.options.filter((option) => commandClass(option.text) === question.missingClass);
    const answerOption = question.options.find((option) => option.label === question.answer);

    return {
      id: question.id,
      validTarget: expectedTarget === question.targetHeading,
      matchingOptionCount: matchingOptions.length,
      answerMatches: Boolean(answerOption && answerOption.text === question.answerText),
      targetHeading: question.targetHeading,
      expectedTarget
    };
  }

  const banks = {
    easy: generateEasy(),
    medium: generateMedium(),
    hard: generateHard()
  };

  const validationErrors = Object.values(banks)
    .flat()
    .map(validateQuestion)
    .filter((result) => !result.validTarget || result.matchingOptionCount !== 1 || !result.answerMatches);

  if (validationErrors.length) {
    throw new Error(`Aircraft question bank validation failed: ${JSON.stringify(validationErrors.slice(0, 5))}`);
  }

  global.AircraftQuestionBank = {
    ...banks,
    validateQuestion,
    questionSignature,
    commandValue,
    mod360
  };
})(typeof window !== "undefined" ? window : globalThis);
