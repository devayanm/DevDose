import React, { useState } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    // Replace with the actual API call to search articles
    // const response = await fetch(`/api/search?q=${query}`);
    // const data = await response.json();
    // setResults(data);

    // Placeholder data for now
    setResults([
      { id: 1, title: "Sample Article 1", summary: "This is a sample article." },
      { id: 2, title: "Sample Article 2", summary: "This is another sample article." }
    ]);
  };

  return (
    <div>
      <h1>Search Articles</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>
      <div className="search-results">
        {results.length ? (
          results.map((article) => (
            <div key={article.id}>
              <h2>{article.title}</h2>
              <p>{article.summary}</p>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
