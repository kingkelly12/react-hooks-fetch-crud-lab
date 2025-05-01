import React from "react";

function QuestionItem({ question, onDelete, onCorrectIndexChange }) {
  const { id, prompt, answers, correctIndex } = question;

  function handleChange(e) {
    const newIndex = parseInt(e.target.value, 10);
    onCorrectIndexChange(id, newIndex);
  }

  function handleDeleteClick() {
    onDelete(id);
  }

  // Ensure correctIndex is a valid number fallback to 0
  const safeCorrectIndex = typeof correctIndex === "number" && !isNaN(correctIndex) ? correctIndex : 0;

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select value={safeCorrectIndex} onChange={handleChange}>
          {answers.map((answer, index) => (
            <option key={index} value={index}>
              {answer}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleDeleteClick}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
