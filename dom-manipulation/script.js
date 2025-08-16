// Array of quotes (each has text + category)
let quotes =
JSON.parse(localStorage.getItem("quotes")) ||
 [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Do what you can, with what you have, where you are.", category: "Wisdom" }
];

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

//save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
     const categories = [...new Set(quotes.map(q => q.category))];
  localStorage.setItem("categories", JSON.stringify(categories));
}

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>Category: ${randomQuote.category}</small>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}
// Function to add a new quote (from inputs in HTML)
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  if (textInput.value.trim() && categoryInput.value.trim()) {
    const newQuote = {
      text: textInput.value,
      category: categoryInput.value
    };
    quotes.push(newQuote);
    saveQuotes();

    populateCategories(); // refresh dropdown in real-time

    textInput.value = "";
    categoryInput.value = "";

    alert("New quote added successfully!");
  } else {
    alert("Please enter both text and category.");
  }
}

// Populate dropdown with unique categories
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  // Clear old options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Load categories from localStorage if available
  const storedCategories = JSON.parse(localStorage.getItem("categories"));
  const categories = storedCategories || [...new Set(quotes.map(q => q.category))];

  // Add them as options
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter from localStorage
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) {
    categoryFilter.value = savedFilter;
    filterQuotes(); // apply filter immediately
  }
}

// Filter quotes based on selected category
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;

  // Save current filter to localStorage
  localStorage.setItem("selectedCategory", selectedCategory);

  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `
      <p>"${randomQuote.text}"</p>
      <small>Category: ${randomQuote.category}</small>
    `;
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  } else {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
  }
}

// JSON Export
function exportToJsonFile() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// JSON Import
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}
// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// On page load
window.onload = () => {
    populateCategories();
  // If sessionStorage has last quote, display it
  const lastQuote = 
  JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.innerHTML = `
      <p>"${lastQuote.text}"</p>
      <small>Category: ${lastQuote.category}</small>
    `;
  } else {
    showRandomQuote();
  }
};
