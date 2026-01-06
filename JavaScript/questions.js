const QUESTIONS = {
  mathematics: [
    // ===== Easy MCQ =====
    {
      question: "If x² − 9 = 0, what is the value of x?",
      options: ["3 only", "−3 only", "3 or −3", "0"],
      correct: 2,
      difficulty: "easy",
      type: "mcq",
      explanation: "x² − 9 = 0 ⇒ x² = 9. Taking square root gives x = ±3.",
    },
    {
      question: "What is the value of (2³ × 2⁴)?",
      options: ["2⁷", "2¹²", "2⁸", "2¹"],
      correct: 0,
      difficulty: "easy",
      type: "mcq",
      explanation: "Using the law of indices: aᵐ × aⁿ = aᵐ⁺ⁿ, so 2³ × 2⁴ = 2⁷.",
    },
    {
      question: "If a = 3, find the value of a² − 2a.",
      options: ["3", "6", "9", "12"],
      correct: 0,
      difficulty: "easy",
      type: "mcq",
      explanation: "a² − 2a = 3² − 2×3 = 9 − 6 = 3.",
    },
    {
      question: "Which of the following is NOT a rational number?",
      options: ["0.25", "√2", "−3/7", "0.75"],
      correct: 1,
      difficulty: "easy",
      type: "mcq",
      explanation:
        "√2 cannot be expressed as a ratio of integers, so it is irrational.",
    },
    {
      question: "What is the solution of the equation 2x + 5 = 13?",
      options: ["3", "4", "5", "6"],
      correct: 1,
      difficulty: "easy",
      type: "mcq",
      explanation: "2x + 5 = 13 ⇒ 2x = 8 ⇒ x = 4.",
    },
    {
      question:
        "If the perimeter of a square is 20 cm, what is the length of one side?",
      options: ["4 cm", "5 cm", "6 cm", "8 cm"],
      correct: 1,
      difficulty: "easy",
      type: "mcq",
      explanation: "Perimeter of square = 4 × side. So side = 20 ÷ 4 = 5 cm.",
    },
    {
      question: "What is the value of 9⁰?",
      options: ["0", "1", "9", "Undefined"],
      correct: 1,
      difficulty: "easy",
      type: "mcq",
      explanation: "Any non-zero number raised to the power 0 is equal to 1.",
    },
    {
      question: "If x : y = 2 : 3 and x = 8, what is the value of y?",
      options: ["10", "12", "14", "16"],
      correct: 1,
      difficulty: "easy",
      type: "mcq",
      explanation: "x : y = 2 : 3 ⇒ x = 2k = 8 ⇒ k = 4. So y = 3k = 12.",
    },
    {
      question: "Which angle is formed between the hands of a clock at 3:00?",
      options: ["0°", "90°", "120°", "180°"],
      correct: 1,
      difficulty: "easy",
      type: "mcq",
      explanation:
        "At 3:00, the minute hand is at 12 and the hour hand is at 3, forming a right angle of 90°.",
    },
    {
      question:
        "If the area of a rectangle is 48 cm² and its length is 6 cm, find its breadth.",
      options: ["6 cm", "8 cm", "10 cm", "12 cm"],
      correct: 1,
      difficulty: "easy",
      type: "mcq",
      explanation:
        "Area = length × breadth ⇒ 48 = 6 × breadth ⇒ breadth = 8 cm.",
    },

    // ===== Easy TRUE/FALSE =====

    {
      question: "The square of any real number is always non-negative.",
      options: ["True", "False"],
      correct: 0,
      difficulty: "easy",
      type: "truefalse",
      explanation:
        "The square of a number is obtained by multiplying it by itself. A negative number squared also becomes positive.",
    },
    {
      question: "√49 is equal to ±7.",
      options: ["True", "False"],
      correct: 0,
      difficulty: "easy",
      type: "truefalse",
      explanation:
        "Since 7² = 49 and (−7)² = 49, the square root equation x² = 49 has two solutions: ±7.",
    },
    {
      question: "A linear equation in one variable has exactly one solution.",
      options: ["True", "False"],
      correct: 1,
      difficulty: "easy",
      type: "truefalse",
      explanation:
        "A linear equation like ax + b = 0 (where a ≠ 0) always has one and only one solution.",
    },
    {
      question: "Zero is neither positive nor negative.",
      options: ["True", "False"],
      correct: 0,
      difficulty: "easy",
      type: "truefalse",
      explanation:
        "Zero lies between positive and negative numbers and does not belong to either group.",
    },
    {
      question: "The value of a⁰ is 0 for any real number a.",
      options: ["True", "False"],
      correct: 1,
      difficulty: "easy",
      type: "truefalse",
      explanation: "For any non-zero real number a, a⁰ = 1, not 0.",
    },
    {
      question: "The sum of the angles of a triangle is 180°.",
      options: ["True", "False"],
      correct: 0,
      difficulty: "easy",
      type: "truefalse",
      explanation:
        "In Euclidean geometry, the sum of all interior angles of a triangle is always 180°.",
    },
    {
      question: "All prime numbers are odd.",
      options: ["True", "False"],
      correct: 1,
      difficulty: "easy",
      type: "truefalse",
      explanation:
        "The number 2 is a prime number and it is even, so not all prime numbers are odd.",
    },
    {
      question: "The product of two negative numbers is positive.",
      options: ["True", "False"],
      correct: 0,
      difficulty: "easy",
      type: "truefalse",
      explanation:
        "According to the rules of integers, multiplying two negative numbers gives a positive result.",
    },
    {
      question: "The value of π is exactly equal to 22/7.",
      options: ["True", "False"],
      correct: 1,
      difficulty: "easy",
      type: "truefalse",
      explanation:
        "π is an irrational number. 22/7 is only an approximate value of π.",
    },
    {
      question: "A square is a special type of rectangle.",
      options: ["True", "False"],
      correct: 0,
      difficulty: "easy",
      type: "truefalse",
      explanation:
        "A square satisfies all properties of a rectangle but has the additional condition that all sides are equal.",
    },
  ],
};
