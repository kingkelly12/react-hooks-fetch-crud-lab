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

describe("displays question prompts after fetching", () => {
  test("renders question prompts after fetching", async () => {
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
    fireEvent.click(screen.queryByText(/Submit/));

    // verify new question is added
    fireEvent.click(screen.queryByText(/View Questions/));
    expect(await screen.findByText((content) => content.includes("Test Prompt"))).toBeInTheDocument();
  });

  test("displays an error message when the form is submitted with incomplete data", async () => {
    render(<App />);

    // navigate to form page
    fireEvent.click(screen.queryByText("New Question"));

    // submit form without filling it out
    fireEvent.click(screen.queryByText(/Submit/));

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
    fireEvent.click(screen.queryByText(/Submit/));

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

    // wait for the dropdown value to update
    await screen.findAllByDisplayValue("3");

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

  test("waits for question prompt to be removed and rerenders", async () => {
    const { rerender } = render(<App />);

    fireEvent.click(screen.queryByText(/View Questions/));

    await screen.findByText(/lorem testum 1/g);

    // wait for the element to be removed with timeout increased
    await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g), { timeout: 3000 });

    rerender(<App />);

    test("displays a loading message while fetching questions", async () => {
      render(<App />);

      // Check for loading message
      expect(screen.queryByText(/Loading.../)).toBeInTheDocument();

      // Wait for questions to load
      await screen.findByText(/lorem testum 1/g);

      // Ensure loading message is removed
      expect(screen.queryByText(/Loading.../)).not.toBeInTheDocument();
    });

    test("handles fetch failure gracefully", async () => {
      server.use(
        rest.get("http://localhost:4000/questions", (req, res, ctx) => {
          return res(ctx.status(500));
        })
      );

      render(<App />);

      // Check for error message
      expect(await screen.findByText(/Failed to load questions/)).toBeInTheDocument();
    });

    test("does not allow duplicate questions to be added", async () => {
      render(<App />);

      // Wait for initial questions to load
      await screen.findByText(/lorem testum 1/g);

      // Navigate to form page
      fireEvent.click(screen.queryByText("New Question"));

      // Fill out form with duplicate data
      fireEvent.change(screen.queryByLabelText(/Prompt/), {
        target: { value: "lorem testum 1" },
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

      // Submit form
      fireEvent.click(screen.queryByText(/Submit/));

      // Verify error message for duplicate question
      expect(await screen.findByText(/Question already exists/)).toBeInTheDocument();
    });

    test("removes a question when delete button is clicked", async () => {
      render(<App />);

      // Wait for questions to load
      await screen.findByText(/lorem testum 1/g);

      // Click delete button for the first question
      fireEvent.click(screen.queryAllByText(/Delete/)[0]);

      // Verify question is removed
      await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));
      expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
    });

    test("displays a confirmation dialog before deleting a question", async () => {
      render(<App />);

      // Wait for questions to load
      await screen.findByText(/lorem testum 1/g);

      // Click delete button for the first question
      fireEvent.click(screen.queryAllByText(/Delete/)[0]);

      // Verify confirmation dialog is displayed
      expect(screen.queryByText(/Are you sure you want to delete this question?/)).toBeInTheDocument();

      // Confirm deletion
      fireEvent.click(screen.queryByText(/Yes/));

      // Verify question is removed
      await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g));
      expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
    });

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
  fireEvent.click(screen.queryByText(/Submit/));

  // verify new question is added
  fireEvent.click(screen.queryByText(/View Questions/));
  expect(await screen.findByText("Test Prompt")).toBeInTheDocument();
});

test("updates the answer when the dropdown is changed", async () => {
  render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 2/g);

  fireEvent.change(screen.queryAllByLabelText(/Correct Answer/)[0], {
    target: { value: "3" },
  });

  // wait for the dropdown value to update
  expect(screen.queryAllByLabelText(/Correct Answer/)[0].value).toBe("3");
});

test("waits for question prompt to be removed and rerenders", async () => {
  const { rerender } = render(<App />);

  fireEvent.click(screen.queryByText(/View Questions/));

  await screen.findByText(/lorem testum 1/g);

  // simulate removal of the element
  await waitForElementToBeRemoved(() => screen.queryByText(/lorem testum 1/g), { timeout: 3000 });

  rerender(<App />);

  await screen.findByText(/lorem testum 2/g);

  expect(screen.queryByText(/lorem testum 1/g)).not.toBeInTheDocument();
});