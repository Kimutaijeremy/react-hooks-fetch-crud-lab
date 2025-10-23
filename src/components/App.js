
import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  // Initial Fetch and Memory Leak Fix (GET /questions)
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch("http://localhost:4000/questions", { signal })
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error("Fetch error:", err);
        }
      });

    // Cleanup function to prevent memory leak
    return () => {
      controller.abort();
    };
  }, []);

  // ----------------------------------------------------
  // FIX: Use spread operator to append the new question 
  // ----------------------------------------------------
  function handleAddQuestion(newQuestion) {
    // Correctly appends the new question to the existing list
    setQuestions(prevQuestions => [...prevQuestions, newQuestion]); 
  }

  // DELETE handler: Called by QuestionItem to remove the deleted question from state
  function handleDeleteQuestion(deletedId) {
    setQuestions(questions.filter(q => q.id !== deletedId));
  }

  // PATCH handler: Called by QuestionItem to update the correctIndex in state
  function handleUpdateQuestion(updatedQuestion) {
    setQuestions(questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    ));
  }

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm 
          onAddQuestion={handleAddQuestion}
          onChangePage={setPage}
        />
      ) : (
        <QuestionList 
          questions={questions} 
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateQuestion={handleUpdateQuestion}
        />
      )}
    </main>
  );
}

export default App;