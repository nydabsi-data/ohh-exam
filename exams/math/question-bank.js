const MATH_QUESTION_BANK = (() => {
  const letters = ["A", "B", "C", "D"];
  const cleanNumberText = (value) => String(value).replace(/\d+\.\d{10,}/g, (number) => String(Number(Number(number).toPrecision(12))));

  const make = (id, category, question, options, answerIndex, explanation) => ({
    id,
    category,
    question: cleanNumberText(question),
    options: options.map((text, index) => ({ label: letters[index], text: cleanNumberText(text) })),
    answer: letters[answerIndex],
    explanation: cleanNumberText(explanation),
  });

  const records = [];
  let id = 1;

  const add = (category, question, options, answer, explanation) => {
    const answerIndex = options.findIndex((option) => String(option) === String(answer));
    if (answerIndex === -1) {
      throw new Error(`Missing answer option for ${question}`);
    }
    records.push(make(`M${String(id).padStart(3, "0")}`, category, question, options, answerIndex, explanation));
    id += 1;
  };

  const shuffleOptions = (correct, distractors) => {
    const values = [correct, ...distractors].map(String);
    const unique = [...new Set(values)];
    if (unique.length < 4) {
      let bump = Number(correct) || unique.length + 1;
      while (unique.length < 4) {
        bump += 1;
        unique.push(String(bump));
      }
    }
    return unique.slice(0, 4);
  };

  for (let n = 2; n <= 16; n += 1) {
    const a = n + 3;
    const b = n * 2 + 1;
    const c = a * b;
    add(
      "Algebra",
      `If ${a}x + ${b} = ${c + b}, what is the value of x?`,
      shuffleOptions(c / a, [c / a + 1, c / a - 1, c / a + 2]),
      c / a,
      `Subtract ${b} from both sides to get ${a}x = ${c}. Divide by ${a}, so x = ${c / a}.`
    );
  }

  for (let n = 3; n <= 17; n += 1) {
    const price = 40 + n * 5;
    const percent = n % 2 === 0 ? 20 : 15;
    const sale = price * (100 - percent) / 100;
    add(
      "Percent",
      `A jacket costs $${price}. It is discounted by ${percent}%. What is the sale price?`,
      shuffleOptions(sale, [sale + 5, sale - 5, price - percent]),
      sale,
      `A ${percent}% discount means paying ${100 - percent}% of the price. ${price} x ${(100 - percent) / 100} = ${sale}.`
    );
  }

  for (let n = 4; n <= 18; n += 1) {
    const rate = n + 2;
    const hours = n - 1;
    const distance = rate * hours;
    add(
      "Rates",
      `A cyclist travels at ${rate} miles per hour for ${hours} hours. How many miles does the cyclist travel?`,
      shuffleOptions(distance, [distance + rate, distance - rate, rate + hours]),
      distance,
      `Use distance = rate x time. ${rate} x ${hours} = ${distance}.`
    );
  }

  for (let n = 2; n <= 14; n += 1) {
    const width = n + 4;
    const length = width + 5;
    const area = width * length;
    add(
      "Geometry",
      `A rectangle has width ${width} and length ${length}. What is its area?`,
      shuffleOptions(area, [2 * (width + length), area + width, area - length]),
      area,
      `Area of a rectangle = width x length. ${width} x ${length} = ${area}.`
    );
  }

  for (let n = 3; n <= 15; n += 1) {
    const a = n;
    const b = n + 4;
    const slopeNum = b - a;
    add(
      "Linear Functions",
      `A line passes through the points (1, ${a}) and (3, ${b}). What is the slope of the line?`,
      shuffleOptions(slopeNum / 2, [slopeNum, slopeNum + 1, slopeNum / 2 + 1]),
      slopeNum / 2,
      `Slope = change in y / change in x = (${b} - ${a}) / (3 - 1) = ${slopeNum} / 2 = ${slopeNum / 2}.`
    );
  }

  for (let n = 2; n <= 13; n += 1) {
    const total = n * 12;
    const red = n * 3;
    const probability = `${red}/${total}`;
    add(
      "Probability",
      `A bag contains ${red} red marbles and ${total - red} blue marbles. What is the probability of choosing a red marble?`,
      [probability, `${total - red}/${total}`, `${red}/${total - red}`, `${total}/${red}`],
      probability,
      `Probability = favorable outcomes / total outcomes. There are ${red} red marbles out of ${total}, so the probability is ${probability}.`
    );
  }

  for (let n = 5; n <= 16; n += 1) {
    const values = [n, n + 2, n + 2, n + 5, n + 6];
    const median = n + 2;
    add(
      "Statistics",
      `What is the median of the numbers ${values.join(", ")}?`,
      shuffleOptions(median, [n, n + 5, n + 3]),
      median,
      `The numbers are already in order. The middle value is the third number, ${median}.`
    );
  }

  for (let n = 2; n <= 13; n += 1) {
    const x = n + 1;
    const value = x * x - 3 * x + 4;
    add(
      "Functions",
      `If f(x) = x^2 - 3x + 4, what is f(${x})?`,
      shuffleOptions(value, [value + x, value - x, x * x + 4]),
      value,
      `Substitute x = ${x}: f(${x}) = ${x}^2 - 3(${x}) + 4 = ${value}.`
    );
  }

  for (let n = 2; n <= 13; n += 1) {
    const first = 3 * n;
    const diff = n + 1;
    const fifth = first + 4 * diff;
    add(
      "Sequences",
      `The first term of an arithmetic sequence is ${first}, and the common difference is ${diff}. What is the fifth term?`,
      shuffleOptions(fifth, [first + 5 * diff, first + 3 * diff, fifth + diff]),
      fifth,
      `The fifth term is the first term plus 4 common differences: ${first} + 4(${diff}) = ${fifth}.`
    );
  }

  for (let n = 2; n <= 13; n += 1) {
    const base = n + 3;
    const height = n + 5;
    const area = base * height / 2;
    add(
      "Geometry",
      `A triangle has base ${base} and height ${height}. What is its area?`,
      shuffleOptions(area, [base * height, area + base, area + height]),
      area,
      `Area of a triangle = 1/2 x base x height. 1/2 x ${base} x ${height} = ${area}.`
    );
  }

  for (let n = 4; n <= 15; n += 1) {
    const groupA = n * 2;
    const groupB = n * 3;
    const ratio = `${groupA}:${groupB}`;
    const simplified = `2:3`;
    add(
      "Ratios",
      `A class has ${groupA} boys and ${groupB} girls. What is the simplified ratio of boys to girls?`,
      [simplified, ratio, `3:2`, `${groupA + groupB}:${groupB}`],
      simplified,
      `Divide both parts of ${ratio} by ${n}. The simplified ratio is ${simplified}.`
    );
  }

  for (let n = 2; n <= 13; n += 1) {
    const a = n + 1;
    const b = n + 5;
    const sum = a + b;
    const product = a * b;
    add(
      "Quadratics",
      `The numbers ${a} and ${b} are the roots of x^2 - sx + p = 0. What is s?`,
      shuffleOptions(sum, [product, sum + 1, sum - 1]),
      sum,
      `For x^2 - sx + p = 0, s is the sum of the roots. ${a} + ${b} = ${sum}.`
    );
  }

  for (let n = 3; n <= 14; n += 1) {
    const side = n + 2;
    const perimeter = 4 * side;
    add(
      "Geometry",
      `A square has side length ${side}. What is its perimeter?`,
      shuffleOptions(perimeter, [side * side, perimeter + 4, perimeter - 4]),
      perimeter,
      `Perimeter of a square = 4 x side. 4 x ${side} = ${perimeter}.`
    );
  }

  return records;
})();

window.MATH_QUESTION_BANK = MATH_QUESTION_BANK;
