import React, { useState, useEffect, useRef } from "react";

function QuestionForm({ onAddQuestion, setPage }) {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [error, setError] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  function handleAnswerChange(index, value) {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Form validation: all fields must be filled
    if (
      prompt.trim() === "" ||
      answers.some((answer) => answer.trim() === "") ||
      correctIndex === null ||
      isNaN(correctIndex)
    ) {
      setError("Please fill out all fields");
      return;
    }

    setError("");

    const newQuestion = {
      prompt,
      answers,
      correctIndex,
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((res) => res.json())
      .then((createdQuestion) => {
        if (isMounted.current) {
          onAddQuestion(createdQuestion);
          // Clear form
          setPrompt("");
          setAnswers(["", "", "", ""]);
          setCorrectIndex(0);
          setPage("List");
        }
      })
      .catch(() => {
        if (isMounted.current) {
          setError("Failed to add question");
        }
      });
  }

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>
          Prompt
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>

        <label>
          Answer 1
          <input
            type="text"
            value={answers[0]}
            onChange={(e) => handleAnswerChange(0, e.target.value)}
          />
        </label>

        <label>
          Answer 2
          <input
            type="text"
            value={answers[1]}
            onChange={(e) => handleAnswerChange(1, e.target.value)}
          />
        </label>

        <label>
          Answer 3
          <input
            type="text"
            value={answers[2]}
            onChange={(e) => handleAnswerChange(2, e.target.value)}
          />
        </label>

        <label>
          Answer 4
          <input
            type="text"
            value={answers[3]}
            onChange={(e) => handleAnswerChange(3, e.target.value)}
          />
        </label>

        <label>
          Correct Answer
          <select
            value={correctIndex !== null && !isNaN(correctIndex) ? correctIndex : 0}
            onChange={(e) => setCorrectIndex(parseInt(e.target.value, 10))}
          >
            <option value="0">Answer 1</option>
            <option value="1">Answer 2</option>
            <option value="2">Answer 3</option>
            <option value="3">Answer 4</option>
          </select>
        </label>

        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default QuestionForm;
