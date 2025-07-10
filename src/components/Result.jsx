import React from 'react';
export default function Result({ questions, answers, onRetry, user }) {
  const score = answers.reduce(
    (acc, ans, i) => (ans === questions[i].correctAnswer ? acc + 1 : acc),
    0
  );

  return (
    <div className="text-center bg-green-100 text-gray-900 p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-2">Well done, {user}!</h2>
      <p className="text-lg mb-4">
        You scored <span className="font-bold">{score}</span> / {questions.length}
      </p>
      <button
        onClick={onRetry}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Play Again
      </button>

      <div className="mt-6 text-left">
        <h3 className="text-xl font-bold mb-2">Review:</h3>
        <ul className="space-y-3">
          {questions.map((q, i) => (
            <li key={i} className="border-b pb-2">
              <p className="font-medium">{q.question}</p>
              <p>
                Your answer:{" "}
                <span
                  className={
                    answers[i] === q.correctAnswer ? "text-green-600" : "text-red-600"
                  }
                >
                  {answers[i] || "Skipped"}
                </span>
              </p>
              <p>Correct answer: <span className="text-green-600">{q.correctAnswer}</span></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
