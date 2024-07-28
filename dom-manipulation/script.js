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

  function showRandomQuote() {
    if (quotes.length === 0) {
      quoteDisplay.innerHTML = "<p>No quotes available. Add a new quote!</p>";
      return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>${randomQuote.category}</em></p>`;
    sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
  }

  function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text && category) {
      quotes.push({ text, category });
      localStorage.setItem('quotes', JSON.stringify(quotes));
      newQuoteText.value = '';
      newQuoteCategory.value = '';
      alert('Quote added successfully!');
      // Optionally, show the newly added quote immediately
      quoteDisplay.innerHTML = `<p>${text}</p><p><em>${category}</em></p>`;
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

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);

  loadLastQuote();
});
