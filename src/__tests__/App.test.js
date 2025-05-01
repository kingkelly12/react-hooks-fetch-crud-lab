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


beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("displays question prompts after fetching", async () => {
render(<App />);

fireEvent.click(screen.queryByText(/View Questions/));

expect(await screen.findByText(/lorem testum 1/g)).toBeInTheDocument();
expect(await screen.findByText(/lorem testum 2/g)).toBeInTheDocument();
});

test("creates a new question when the form is submitted", async () => {
render(<App />);

// wait for first render of list
await screen.findByText(/lorem testum 1/g);

// navigate to form page
fireEvent.click(screen.queryByText("New Question"));

// fill out form
fireEvent.change(screen.queryByLabelText(/Prompt/), {
  target: { value: "Test Prompt" },
});
fireEvent.change(screen.queryByLabelText(/Answer 1/), {
  target: { value: "Answer 1" },
});
fireEvent.change(screen.queryByLabelText(/Answer 2/), {
  target: { value: "Answer 2" },
});
fireEvent.change(screen.queryByLabelText(/Correct Answer/), {
  target: { value: "1" },
});
// submit form
fireEvent.submit(screen.queryByText(/Add Question/));

// verify new question is added
fireEvent.click(screen.queryByText(/View Questions/));
expect(await screen.findByText(/Test Prompt/)).toBeInTheDocument();

test("does not add a question if the form submission fails", async () => {
render(<App />);

// navigate to form page
fireEvent.click(screen.queryByText("New Question"));

// fill out form with invalid data
fireEvent.change(screen.queryByLabelText(/Prompt/), {
  target: { value: "" },
});
fireEvent.change(screen.queryByLabelText(/Answer 1/), {
  target: { value: "" },
});
fireEvent.change(screen.queryByLabelText(/Answer 2/), {
  target: { value: "" },
});
fireEvent.change(screen.queryByLabelText(/Correct Answer/), {
  target: { value: "" },
});

// submit form
fireEvent.submit(screen.queryByText(/Add Question/));

// verify no new question is added
fireEvent.click(screen.queryByText(/View Questions/));
expect(screen.queryByText(/Test Prompt/)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
render(<App />);

fireEvent.click(screen.queryByText(/View Questions/));

await screen.findByText(/lorem testum 2/g);

fireEvent.change(screen.queryAllByLabelText(/Correct Answer/)[0], {
  target: { value: "3" },
});

expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});

test("renders the correct initial page based on state", () => {
render(<App />);

// Check that the initial page is the Question List
expect(screen.queryByText(/View Questions/)).toBeInTheDocument();
expect(screen.queryByText(/New Question/)).toBeInTheDocument();
});

test("navigates to the form page when 'New Question' is clicked", () => {
render(<App />);

// Click the "New Question" button
fireEvent.click(screen.queryByText("New Question"));

// Check that the form is displayed
expect(screen.queryByLabelText(/Prompt/)).toBeInTheDocument();
expect(screen.queryByLabelText(/Answer 1/)).toBeInTheDocument();
expect(screen.queryByLabelText(/Answer 2/)).toBeInTheDocument();
expect(screen.queryByLabelText(/Correct Answer/)).toBeInTheDocument();
});

  // submit form
  fireEvent.submit(screen.queryByText(/Add Question/));

  // verify new question is added
  fireEvent.click(screen.queryByText(/View Questions/));
  expect(await screen.findByText(/Test Prompt/)).toBeInTheDocument();
});

test("displays an error message when the form is submitted with incomplete data", async () => {
  render(<App />);

  // navigate to form page
  fireEvent.click(screen.queryByText("New Question"));

  // submit form without filling it out
  fireEvent.submit(screen.queryByText(/Add Question/));

  // verify error message
  expect(await screen.findByText(/Please fill out all fields/)).toBeInTheDocument();
});

test("does not add a question if the form submission fails", async () => {
  render(<App />);

  // navigate to form page
  fireEvent.click(screen.queryByText("New Question"));

  // fill out form with invalid data
  fireEvent.change(screen.queryByLabelText(/Prompt/), {
    target: { value: "" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 1/), {
    target: { value: "" },
  });
  fireEvent.change(screen.queryByLabelText(/Answer 2/), {
    target: { value: "" },
  });
  fireEvent.change(screen.queryByLabelText(/Correct Answer/), {
    target: { value: "" },
  });

  // submit form
  fireEvent.submit(screen.queryByText(/Add Question/));

  // verify no new question is added
  fireEvent.click(screen.queryByText(/View Questions/));
  expect(screen.queryByText(/Test Prompt/)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  fireEvent.change(screen.queryAllByLabelText(/Correct Answer/)[0], {
    target: { value: "3" },
  });

  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});

  // click form page
  fireEvent.click(screen.queryByText("New Question"));

  // fill out form
  test("renders the correct initial page based on state", () => {
    render(<App />);

    // Check that the initial page is the Question List
    expect(screen.queryByText(/View Questions/)).toBeInTheDocument();
    expect(screen.queryByText(/New Question/)).toBeInTheDocument();
  });

  test("navigates to the form page when 'New Question' is clicked", () => {
    render(<App />);

    // Click the "New Question" button
    fireEvent.click(screen.queryByText("New Question"));

    // Check that the form is displayed
    expect(screen.queryByLabelText(/Prompt/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Answer 1/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Answer 2/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Correct Answer/)).toBeInTheDocument();
  });

  test("displays an error message when the form is submitted with incomplete data", async () => {
    render(<App />);

    // Navigate to the form page
    fireEvent.click(screen.queryByText("New Question"));

    // Submit the form without filling it out
    fireEvent.submit(screen.queryByText(/Add Question/));

    // Check for an error message
    expect(await screen.findByText(/Please fill out all fields/)).toBeInTheDocument();
  });

  test("does not add a question if the form submission fails", async () => {
    render(<App />);

    // Navigate to the form page
    fireEvent.click(screen.queryByText("New Question"));

    // Fill out the form with invalid data
    fireEvent.change(screen.queryByLabelText(/Prompt/), {
      target: { value: "" },
    });
    fireEvent.change(screen.queryByLabelText(/Answer 1/), {
      target: { value: "" },
    });
    fireEvent.change(screen.queryByLabelText(/Answer 2/), {
      target: { value: "" },
    });
    fireEvent.change(screen.queryByLabelText(/Correct Answer/), {
      target: { value: "" },
    });

    // Submit the form
    fireEvent.submit(screen.queryByText(/Add Question/));

    // Check that no new question is added
    fireEvent.click(screen.queryByText(/View Questions/));
    expect(screen.queryByText(/Test Prompt/)).not.toBeInTheDocument();
  });

  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));

  rerender(<App />);

  await screen.findByText(/lorem testum 2/g);

  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  fireEvent.change(screen.queryAllByLabelText(/Correct Answer/)[0], {
    target: { value: "3" },
  });

  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");

  rerender(<App />);

  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});
