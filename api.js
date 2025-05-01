const API_BASE_URL = "http://localhost:3000/questions";

export async function fetchQuestions() {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }
  return response.json();
}

export async function addQuestion(questionData) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(questionData),
  });
  if (!response.ok) {
    throw new Error("Failed to add question");
  }
  return response.json();
}

export async function updateQuestion(id, updatedData) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Failed to update question");
  }
  return response.json();
}

export async function deleteQuestion(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete question");
  }
}