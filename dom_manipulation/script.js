// Initial quotes data
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

// Initialize the application
function init() {
  showRandomQuote();
  newQuoteBtn.addEventListener('click', showRandomQuote);
}

// Show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available.</p>";
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <blockquote>"${quote.text}"</blockquote>
    <p><em>- ${quote.category}</em></p>
  `;
}

// Add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();
  
  if (text && category) {
    quotes.push({ text, category });
    textInput.value = '';
    categoryInput.value = '';
    
    quoteDisplay.innerHTML = `
      <blockquote>"${text}"</blockquote>
      <p><em>- ${category}</em></p>
      <p>Quote added successfully!</p>
    `;
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);