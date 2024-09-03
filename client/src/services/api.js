const API_URL = 'http://localhost:8080';

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function loginUser(loginData) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}


export async function fetchArticles() {
  const response = await fetch(`${API_URL}/articles`);
  return response.json();
}

export async function fetchArticle(id) {
  const response = await fetch(`${API_URL}/articles/${id}`);
  return response.json();
}

export async function searchArticles(query) {
  const response = await fetch(`${API_URL}/search?q=${query}`);
  return response.json();
}
