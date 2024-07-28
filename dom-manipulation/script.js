document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    // Add more default quotes as needed
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const addQuoteButton = document.getElementById('addQuote');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const categoryFilter = document.getElementById('categoryFilter');

  function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }

  function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    if (filteredQuotes.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes available for this category. Add a new quote!</p>";
    } else {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const randomQuote = filteredQuotes[randomIndex];
      quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
    }
    localStorage.setItem('selectedCategory', selectedCategory);
  }

  function showRandomQuote() {
    filterQuotes();
  }

  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
      const newQuote = { text, category };
      quotes.push(newQuote);
      localStorage.setItem('quotes', JSON.stringify(quotes));
      postQuoteToServer(newQuote); // Post the new quote to the server
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      alert('Quote added successfully!');
      populateCategories();
      filterQuotes();
    } else {
      alert('Please enter both a quote and a category.');
    }
  }

  function loadLastQuote() {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
      quoteDisplay.innerHTML = `<p>${lastQuote.text}</p><p><em>${lastQuote.category}</em></p>`;
    }
  }

  function loadLastSelectedCategory() {
    const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
    categoryFilter.value = selectedCategory;
    filterQuotes();
  }

  function fetchQuotesFromServer() {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(serverQuotes => {
        const serverQuotesFormatted = serverQuotes.map(quote => ({ text: quote.title, category: "General" }));
        resolveConflicts(serverQuotesFormatted);
        populateCategories();
        filterQuotes();
      })
      .catch(error => console.error('Error fetching quotes from server:', error));
  }

  function postQuoteToServer(quote) {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    })
    .then(response => response.json())
    .then(data => console.log('Quote posted to server:', data))
    .catch(error => console.error('Error posting quote to server:', error));
  }

  function syncQuotes() {
    fetchQuotesFromServer();
    setTimeout(syncQuotes, 60000); // Sync every 60 seconds
  }

  function resolveConflicts(serverQuotes) {
    // Simple conflict resolution: server data takes precedence
    const serverTexts = new Set(serverQuotes.map(quote => quote.text));
    quotes = quotes.filter(quote => !serverTexts.has(quote.text)).concat(serverQuotes);
    localStorage.setItem('quotes', JSON.stringify(quotes));
    alert('Quotes synced with server! Conflicts resolved by prioritizing server data.');
  }

  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      localStorage.setItem('quotes', JSON.stringify(quotes));
      alert('Quotes imported successfully!');
      populateCategories();
      filterQuotes();
    };
    fileReader.readAsText(event.target.files[0]);
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);
  document.getElementById('exportQuotes').addEventListener('click', () => {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  document.getElementById('importFile').addEventListener('change', importFromJsonFile);

  populateCategories();
  loadLastSelectedCategory();
  loadLastQuote();

  // Start syncing quotes with the server
  syncQuotes();
});
