

// Quotes Array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Wisdom" }
];

// Conflict list (for manual resolution)
let conflictList = [];

// Display Quote
function displayQuote(quote) {
  document.getElementById("quoteDisplay").innerText = `"${quote.text}" — [${quote.category}]`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote)); // Save current quote
}

// Show Random Quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const selectedQuote = quotes[randomIndex];
  displayQuote(selectedQuote);
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Add Quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim() || "General";

  if (text) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// Save to Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate Categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) {
    filter.value = lastCategory;
    filterQuotes();
  }
}

// Filter Quotes
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected);

  let filtered = quotes;
  if (selected !== "all") {
    filtered = quotes.filter(q => q.category === selected);
  }

  if (filtered.length > 0) {
    displayQuote(filtered[Math.floor(Math.random() * filtered.length)]);
  } else {
    document.getElementById("quoteDisplay").innerText = "No quotes available for this category.";
  }
}

// Export to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      quotes = [...quotes, ...importedQuotes];
      saveQuotes();
      populateCategories();
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

// Sync with Server
async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    // Simulate server quotes
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    mergeQuotes(serverQuotes);
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

// Merge Quotes with Conflict Handling
function mergeQuotes(serverQuotes) {
  conflictList = [];
  const localTexts = quotes.map(q => q.text);

  serverQuotes.forEach(sq => {
    const localMatch = quotes.find(lq => lq.text === sq.text);

    if (!localMatch) {
      quotes.push(sq);
    } else if (localMatch.category !== sq.category) {
      conflictList.push({ local: localMatch, server: sq });
    }
  });

  if (conflictList.length > 0) {
    document.getElementById("conflictNotification").classList.remove("hidden");
  }

  saveQuotes();
  populateCategories();
}

// Conflict Resolution
function resolveConflicts(choice) {
  conflictList.forEach(conflict => {
    if (choice === "server") {
      const index = quotes.findIndex(q => q.text === conflict.local.text);
      quotes[index] = conflict.server;
    }
    // If "local" → do nothing (keep local)
  });

  conflictList = [];
  document.getElementById("conflictNotification").classList.add("hidden");
  saveQuotes();
  populateCategories();
}

// On Load
window.onload = function () {
  populateCategories();

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    displayQuote(JSON.parse(lastQuote));
  } else {
    showRandomQuote();
  }

  // Auto sync every 30s
  setInterval(syncWithServer, 30000);
};
