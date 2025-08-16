// Initial quotes data
let quotes = JSON.parse(localStorage.getItem("quotes")) ||
[
  { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
  { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
  { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');

//Local storage helpers
function saveQuotes(){
  localStorage.setItem('quotes', JSON.stringify(quotes));
}
function loadQuotes(){
  const storedQuotes= 
  localStorage.getItem("quotes");
  if(storedQuotes){
    quotes.length=0;
    quotes.push(...JSON.parse(storedQuotes));
  }
}

// ===== Session Storage Helpers (last viewed) =====
function saveLastViewed(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function loadLastViewed() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const parsed = JSON.parse(last);
    quoteDisplay.innerHTML = `
      <p>"${parsed.text}"</p>
      <small>Category: ${parsed.category}</small>
    `;
    return true;
  }
  return false;
}

// ===== Show Random Quote =====
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>Category: ${randomQuote.category}</small>
  `;
}

// ===== Add New Quote =====
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);

    // Save to localStorage
    saveQuotes();

    // Update DOM
    quoteDisplay.innerHTML = `
      <p>"${newQuote.text}"</p>
      <small>Category: ${newQuote.category}</small>
    `;

    // Clear fields
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// ===== Add New Quote =====
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);

    // Save to localStorage
    saveQuotes();
    saveLastViewed(newQuote);

    // Update DOM
    quoteDisplay.innerHTML = `
      <p>"${newQuote.text}"</p>
      <small>Category: ${newQuote.category}</small>
    `;

    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// ===== JSON Import / Export =====   👇 (ADD THIS SECTION HERE)
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // pretty JSON
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json"; // file name
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url); // clean up
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);  // add to current quotes
        saveQuotes();  // save to localStorage
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format. Please upload a JSON array.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ===== Event Listeners =====
newQuoteBtn.addEventListener("click", showRandomQuote);

// ===== On Page Load =====
window.onload = () => {
  loadQuotes();    // Load saved quotes from storage
  showRandomQuote(); // Show one immediately
};


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