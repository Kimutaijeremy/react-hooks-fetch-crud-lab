import React from "react";

// Accept delete/update handlers from App component
function QuestionItem({ question, onDeleteQuestion, onUpdateQuestion }) {
  const { id, prompt, answers, correctIndex } = question;

  // ------------------------------------------
  // DELETE Logic (DELETE /questions/:id)
  // ------------------------------------------
  function handleDelete() {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Update state in App component by removing the question
        onDeleteQuestion(id);
      })
      .catch(error => console.error("Error deleting question:", error));
  }

  // ------------------------------------------
  // PATCH Logic (PATCH /questions/:id)
  // ------------------------------------------
  function handleUpdate(event) {
    const newCorrectIndex = parseInt(event.target.value);
    
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((res) => res.json())
      .then((updatedQuestion) => {
        // Update state in App component with the new correctIndex
        onUpdateQuestion(updatedQuestion);
      })
      .catch(error => console.error("Error updating question:", error));
  }

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label htmlFor={`correct-answer-${id}`}>
        Correct Answer:
        <select 
          id={`correct-answer-${id}`}
          defaultValue={correctIndex}
          onChange={handleUpdate} // Attach PATCH handler
        >
          {options}
        </select>
      </label>
      <button onClick={handleDelete}>Delete Question</button> {/* Attach DELETE handler */}
    </li>
  );
}

export default QuestionItem;
