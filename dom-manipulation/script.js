// Quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Your limitation—it's only your imagination.", category: "Motivation" },
  { text: "Happiness depends upon ourselves.", category: "Philosophy" }
];

// Function: Display a random quote
function showRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quoteDisplay = document.getElementById("quoteDisplay");

  quoteDisplay.innerHTML = `
    <p>"${quotes[randomIndex].text}"</p>
    <small>— ${quotes[randomIndex].category}</small>
  `;
}

// Function: Add a new quote
function addQuote() {
  let newQuoteText = document.getElementById("newQuoteText").value.trim();
  let newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    // Push new quote into array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("New quote added successfully!");
  } else {
    alert("Please fill in both fields!");
  }
}

// Event listener for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initialize page with a quote
window.onload = showRandomQuote;
