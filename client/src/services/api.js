const API_URL = "http://localhost:8080";

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function loginUser(loginData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });
  return response.json();
}

export async function fetchUserProfile(email) {
  const response = await fetch(`${API_URL}/auth/profile/${email}`);
  return response.json();
}

export async function updateUserProfile(email, userData) {
  const response = await fetch(`${API_URL}/auth/profile/${email}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Failed to logout");
  }
}

export async function fetchArticles() {
  const response = await fetch(`${API_URL}/articles`);
  return response.json();
}

export async function fetchArticlebyid(id) {
  const response = await fetch(`${API_URL}/articles/${id}`);
  return response.json();
}

export async function searchArticles(query) {
  const response = await fetch(`${API_URL}/search/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  return response.json();
}

export async function createArticle(articleData) {
  const response = await fetch(`${API_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  });
  return response.json();
}

export async function updateArticle(id, articleData) {
  const response = await fetch(`${API_URL}/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  });
  return response.json();
}

export async function deleteArticle(id) {
  const response = await fetch(`${API_URL}/articles/${id}`, {
    method: "DELETE",
  });
  return response.json();
}
