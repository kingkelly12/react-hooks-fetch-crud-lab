import React from "react";


const handleDelete = (id) => {
  fetch(`http://localhost:4000/questions/${id}`, {
    method: 'DELETE'
  })
  .then(() => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  });
};

const handleCorrectIndexChange = (id, newIndex) => {
  fetch(`http://localhost:4000/questions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ correctIndex: newIndex })
  })
  .then(res => res.json())
  .then(updatedQuestion => {
    setQuestions(prev =>
      prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    );
  });
};


function QuestionList() {

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>
        {questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onDelete={handleDelete}
            onCorrectIndexChange={handleCorrectIndexChange}
          />
        ))}
      </ul>
    </section>
  );
}

export default QuestionList;
