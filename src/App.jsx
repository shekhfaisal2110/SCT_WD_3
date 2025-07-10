import { useEffect, useState, useRef } from 'react';
import QuestionCard from './components/QuestionCard';
import Result from './components/Result';
import Header from './components/Header';

const CATEGORIES = [
  { key: 'film_and_tv', label: '🎬 Film & TV' },
  { key: 'sport_and_leisure', label: '🏏 Sports' },
  { key: 'music', label: '🎵 Music' },
  { key: 'history', label: '📜 History' },
  { key: 'science', label: '🔬 Science' },
  { key: 'food_and_drink', label: '🍔 Food' },
  { key: 'geography', label: '🌍 Geography' },
  { key: 'arts_and_literature', label: '🎨 Arts' },
  { key: 'general_knowledge', label: '🧠 General' },
  { key: 'society_and_culture', label: '👥 Culture' },
  { key: 'religion_and_mythology', label: '📖 Religion' },
];

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('quiz-user') || '');
  const [category, setCategory] = useState(CATEGORIES[0].key);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionTimer, setQuestionTimer] = useState(15);
  const [timeoutTriggered, setTimeoutTriggered] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const beep = useRef(null);
  const endBeep = useRef(null);

  const fetchQuestions = async (cat) => {
    const res = await fetch(`https://the-trivia-api.com/api/questions?limit=5&categories=${cat}`);
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    if (user) fetchQuestions(category);
  }, [user, category]);

  useEffect(() => {
    if (!showResult && questionTimer > 0 && !showAnswerFeedback) {
      const interval = setInterval(() => {
        setQuestionTimer((prev) => {
          if (prev <= 5 && prev > 1 && beep.current && userInteracted) beep.current.play().catch(() => {});
          if (prev === 1 && endBeep.current && userInteracted) {
            endBeep.current.play().catch(() => {});
            if (navigator.vibrate) navigator.vibrate([100, 100, 100]);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else if (questionTimer === 0 && !showAnswerFeedback) {
      setTimeoutTriggered(true);
      setPulse(true);
      if (navigator.vibrate) navigator.vibrate([200]);
      setTimeout(() => {
        setPulse(false);
        handleAnswer(null);
      }, 1200);
    }
  }, [questionTimer, showResult, showAnswerFeedback, userInteracted]);

  const handleLogin = () => {
    const name = prompt('Enter your name:');
    if (name) {
      localStorage.setItem('quiz-user', name);
      setUser(name);
    }
  };

  const handleAnswer = (selected) => {
    setUserInteracted(true);
    setSelectedAnswer(selected);
    const correct = selected === questions[current].correctAnswer;
    setIsCorrect(correct);
    setShowAnswerFeedback(true);
    setTimeoutTriggered(false);

    const updatedAnswers = [...answers];
    updatedAnswers[current] = selected;
    setAnswers(updatedAnswers);

    if (navigator.vibrate) navigator.vibrate(correct ? [100, 50, 100] : [200]);
  };

  const nextQuestion = () => {
    setShowAnswerFeedback(false);
    setSelectedAnswer(null);
    setQuestionTimer(15);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
      saveScore();
    }
  };

  const saveScore = () => {
    const score = answers.reduce((acc, ans, i) =>
      ans === questions[i].correctAnswer ? acc + 1 : acc, 0);
    const scores = JSON.parse(localStorage.getItem('quiz-scores') || '{}');
    scores[user] = [...(scores[user] || []), { category, score }];
    localStorage.setItem('quiz-scores', JSON.stringify(scores));
  };

  const resetQuiz = () => {
    setCurrent(0);
    setAnswers([]);
    setShowResult(false);
    setQuestionTimer(15);
    fetchQuestions(category);
  };

  const progress = questions.length ? ((current + (showAnswerFeedback ? 1 : 0)) / questions.length) * 100 : 0;
  const timerPercent = (questionTimer / 15) * 100;

  return (
    <div
      className="bg-gray-900 text-white min-h-screen p-4"
      onClick={() => setUserInteracted(true)}
      onTouchStart={() => setUserInteracted(true)}
    >
      <audio ref={beep} src="/beep.mp3" preload="auto" />
      <audio ref={endBeep} src="/timeout.mp3" preload="auto" />

      <div className="flex justify-between items-center">
        <Header />
        <div className="flex items-center gap-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 p-2 rounded"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.key} value={cat.key}>{cat.label}</option>
            ))}
          </select>
          <button onClick={handleLogin} className="underline">
            {user ? `👋 ${user}` : 'Login'}
          </button>
        </div>
      </div>

      {user && questions.length > 0 ? (
        <div className="max-w-2xl mx-auto mt-8">
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {!showResult && (
            <div
              className={`relative w-20 h-20 mx-auto mb-4 transition duration-200 ${pulse ? 'animate-ping rounded-full border-4 border-yellow-400' : ''}`}
            >
              <svg className="absolute top-0 left-0 transform -rotate-90" width="80" height="80">
                <circle cx="40" cy="40" r="32" stroke="#4B5563" strokeWidth="8" fill="none" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#F59E0B"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * timerPercent) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-yellow-400 font-bold text-xl">
                {questionTimer}s
              </div>
            </div>
          )}

          {showResult ? (
            <Result
              questions={questions}
              answers={answers}
              onRetry={resetQuiz}
              user={user}
            />
          ) : (
            <QuestionCard
              questionData={questions[current]}
              questionIndex={current + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              selectedAnswer={selectedAnswer}
              showAnswerFeedback={showAnswerFeedback}
              isCorrect={isCorrect}
              onNext={nextQuestion}
            />
          )}
        </div>
      ) : (
        <p className="text-center mt-20 text-lg">Please login to start the quiz.</p>
      )}
    </div>
  );
}