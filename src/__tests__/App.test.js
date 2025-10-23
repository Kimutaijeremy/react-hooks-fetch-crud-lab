
import React from "react";
import "whatwg-fetch";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { server } from "../mocks/server";

import App from "../components/App";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
  render(<App />);

  // Ensure the navbar is present
  await screen.findByText(/New Question/);
  
  // Click should now succeed
  fireEvent.click(screen.queryByText(/View Questions/)); 

  // Wait for the fetched data to appear
  expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
  expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
  render(<App />);

  // Wait for initial content load
  await screen.findByText(/View Questions/);

  // click form page
  fireEvent.click(screen.queryByText("New Question"));

  // fill out form (elements should now be found)
  fireEvent.change(screen.queryByLabelText(/Prompt/i), { // use /i for case-insensitivity just in case
    target: { value: "Test Prompt" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 1/i), {
    target: { value: "Test Answer 1" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 2/i), {
    target: { value: "Test Answer 2" },
  });
  // Change correct index, use the select element
  fireEvent.change(screen.queryByLabelText(/Correct Answer/i), {
    target: { value: "1" }, 
  });

  // submit form
  fireEvent.submit(screen.queryByText(/Add Question/));

  // view questions
  fireEvent.click(screen.queryByText(/View Questions/));

  // Assert new question appears
  expect(await screen.findByText(/Test Prompt/g)).toBeInTheDocument();
  expect(screen.queryByText(/lorem testum 1/g)).toBeInTheDocument(); // Original question is still there
});

test("deletes the question when the delete button is clicked", async () => {
  const { rerender } = render(<App />);

  await screen.findByText(/New Question/);
  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 1/g);

  // Click the delete button
  fireEvent.click(screen.queryAllByText("Delete Question")[0]);

  // Wait for the question to be removed from the DOM
  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

  rerender(<App />); // Rerender to confirm persistent change on server

  await screen.findByText(/lorem testum 2/g); // Check that the other question is still there

  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  await screen.findByText(/New Question/);
  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  // Find the correct answer dropdown (it's the first one in the list of two questions)
  const dropdown = screen.queryAllByLabelText(/Correct Answer/)[0];

  fireEvent.change(dropdown, {
    target: { value: "3" },
  });

  // Check state update in the DOM
  expect(dropdown.value).toBe("3");

  rerender(<App />); // Rerender to confirm persistent change on server

  // Check persistent change after rerender
  await screen.findByText(/lorem testum 2/g);
  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});
