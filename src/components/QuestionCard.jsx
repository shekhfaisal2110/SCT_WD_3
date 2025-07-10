// import { useState } from 'react';

// export default function QuestionCard({ questionData, onAnswer, questionIndex, totalQuestions }) {
//   const [selected, setSelected] = useState(questionData.type === 'multi' ? [] : '');
//   const [fillText, setFillText] = useState('');
//   const [dropdown, setDropdown] = useState('');

//   const handleSubmit = () => {
//     if (questionData.type === 'fill') {
//       onAnswer(fillText.trim());
//     } else if (questionData.type === 'dropdown') {
//       onAnswer(dropdown);
//     } else {
//       onAnswer(selected);
//     }
//   };

//   const toggleMulti = (option) => {
//     if (selected.includes(option)) {
//       setSelected(selected.filter((o) => o !== option));
//     } else {
//       setSelected([...selected, option]);
//     }
//   };

//   return (
//     <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
//       <h2 className="text-xl font-semibold mb-4">
//         Q{questionIndex}/{totalQuestions}: {questionData.question}
//       </h2>
//       <div className="space-y-3">
//         {questionData.type === 'fill' && (
//           <input
//             type="text"
//             value={fillText}
//             onChange={(e) => setFillText(e.target.value)}
//             className="w-full p-2 rounded bg-gray-700 border border-gray-600"
//           />
//         )}
//         {questionData.type === 'dropdown' && (
//           <select
//             value={dropdown}
//             onChange={(e) => setDropdown(e.target.value)}
//             className="w-full p-2 rounded bg-gray-700 border border-gray-600"
//           >
//             <option value="">Select an answer</option>
//             {questionData.options.map((opt, i) => (
//               <option key={i} value={opt}>{opt}</option>
//             ))}
//           </select>
//         )}
//         {(questionData.type === 'single' || questionData.type === 'multi' || questionData.type === 'truefalse') && (
//           questionData.options.map((option, idx) => (
//             <label key={idx} className="flex items-center gap-2">
//               <input
//                 type={questionData.type === 'multi' ? 'checkbox' : 'radio'}
//                 name="option"
//                 value={option}
//                 checked={questionData.type === 'multi' ? selected.includes(option) : selected === option}
//                 onChange={() =>
//                   questionData.type === 'multi'
//                     ? toggleMulti(option)
//                     : setSelected(option)
//                 }
//               />
//               {option}
//             </label>
//           ))
//         )}
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="mt-6 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
//       >
//         Submit
//       </button>
//     </div>
//   );
// }



export default function QuestionCard({
  questionData,
  questionIndex,
  totalQuestions,
  onAnswer,
  selectedAnswer,
  showAnswerFeedback,
  onNext
}) {
  const { question, correctAnswer, incorrectAnswers } = questionData;
  const options = [...incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);

  const getButtonClass = (option) => {
    if (!showAnswerFeedback) return "bg-white text-gray-900";
    if (option === correctAnswer) return "bg-green-500 text-white";
    if (option === selectedAnswer) return "bg-red-500 text-white";
    return "bg-white text-gray-900 opacity-50";
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-bold mb-4">
        Q{questionIndex}/{totalQuestions}: {question}
      </h2>
      <div className="grid gap-3">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => !showAnswerFeedback && onAnswer(option)}
            disabled={!!showAnswerFeedback}
            className={`px-4 py-2 rounded font-semibold border ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>

      {showAnswerFeedback && (
        <div className="mt-4 text-center">
          
          <button
            onClick={onNext}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded font-semibold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
