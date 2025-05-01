import React, { useState, useEffect, useRef } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);
  const isMounted = useRef(true);

  function fetchQuestions() {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted.current) {
          setQuestions(data);
        }
      });
  }

  useEffect(() => {
    fetchQuestions();

    return () => {
      isMounted.current = false;
    };
  }, []);

  function handleAddQuestion(newQuestion) {
    // Instead of appending, re-fetch questions to get fresh list
    fetchQuestions();
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onAddQuestion={handleAddQuestion} setPage={setPage} />
      ) : (
        <QuestionList questions={questions} setQuestions={setQuestions} />
      )}
    </main>
  );
}

export default App;
