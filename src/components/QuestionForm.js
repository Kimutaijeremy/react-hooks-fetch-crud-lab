import React, { useState } from "react";

// Accept the state handlers as props
function QuestionForm({ onAddQuestion, onChangePage }) {
  const [formData, setFormData] = useState({
    prompt: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    correctIndex: "0", // Must be a string to match select value
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    
    // Format the data for the API (POST /questions)
    const newQuestionData = {
      prompt: formData.prompt,
      answers: [
        formData.answer1,
        formData.answer2,
        formData.answer3,
        formData.answer4,
      ],
      correctIndex: parseInt(formData.correctIndex), // Convert back to integer
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestionData),
    })
      .then((res) => res.json())
      .then((newQuestion) => {
        // 1. Update state in App component
        onAddQuestion(newQuestion); 
        // 2. Navigate back to the list view
        onChangePage("List");
      })
      .catch(error => console.error("Error creating question:", error));
  }

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 1:
          <input
            type="text"
            name="answer1"
            value={formData.answer1}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 2:
          <input
            type="text"
            name="answer2"
            value={formData.answer2}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 3:
          <input
            type="text"
            name="answer3"
            value={formData.answer3}
            onChange={handleChange}
          />
        </label>
        <label>
          Answer 4:
          <input
            type="text"
            name="answer4"
            value={formData.answer4}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="correctIndex">
          Correct Answer:
          <select
            id="correctIndex"
            name="correctIndex"
            value={formData.correctIndex}
            onChange={handleChange}
          >
            {/* Options must use index values as strings */}
            <option value="0">{formData.answer1 || 'Answer 1'}</option>
            <option value="1">{formData.answer2 || 'Answer 2'}</option>
            <option value="2">{formData.answer3 || 'Answer 3'}</option>
            <option value="3">{formData.answer4 || 'Answer 4'}</option>
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;
