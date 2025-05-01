import React, { useState } from "react";

function QuestionForm({ onAddQuestion }) {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  function handleAnswerChange(index, value) {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  }

  function handleSubmit(e) {
    e.preventDefault();

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
        onAddQuestion(createdQuestion);
        // Clear form
        setPrompt("");
        setAnswers(["", "", "", ""]);
        setCorrectIndex(0);
      });
  }

  return ( // <-- The return statement is now correctly placed here
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
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
          Correct Answer
          <select
            value={correctIndex}
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