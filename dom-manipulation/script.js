// ---------- Bootstrap data from storage ----------
let quotes =
  JSON.parse(localStorage.getItem("quotes")) ||
  [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
    { text: "Do what you can, with what you have, where you are.", category: "Wisdom" }
  ];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

let conflictList = []; // holds conflicts found during last sync

// ---------- Persistence helpers ----------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
  const categories = [...new Set(quotes.map(q => q.category))];
  localStorage.setItem("categories", JSON.stringify(categories));
}

// ---------- Rendering helpers ----------
function displayQuote(quote) {
  const q = quote || quotes[Math.floor(Math.random() * quotes.length)];
  if (!q) {
    quoteDisplay.innerHTML = `<p>No quotes available.</p>`;
    return;
  }
  quoteDisplay.innerHTML = `
    <p>"${q.text}"</p>
    <small>Category: ${q.category}</small>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(q));
}

function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available.</p>`;
    return;
  }
  displayQuote();
}

// ---------- CRUD + UI ----------
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = (textInput.value || "").trim();
  const category = (categoryInput.value || "").trim();

  if (!text || !category) {
    alert("Please enter both text and category.");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();        // keep dropdown in sync
  displayQuote(newQuote);      // show what we just added

  // Try to send to "server" and then resync
  sendQuoteToServer(newQuote).finally(syncWithServer);

  textInput.value = "";
  categoryInput.value = "";
  alert("New quote added successfully!");
}

// ---------- Filter ----------
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;

  // Reset to default
  select.innerHTML = '<option value="all">All Categories</option>';

  // Prefer categories from storage (persisted), else compute from quotes
  const storedCategories = JSON.parse(localStorage.getItem("categories"));
  const categories = storedCategories || [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  // Restore last chosen filter if any
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter && (savedFilter === "all" || categories.includes(savedFilter))) {
    select.value = savedFilter;
    filterQuotes(); // apply
  }
}

function filterQuotes() {
  const select = document.getElementById("categoryFilter");
  const selected = select.value;

  localStorage.setItem("selectedCategory", selected);

  let list = quotes;
  if (selected !== "all") {
    list = quotes.filter(q => q.category === selected);
  }

  if (list.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    return;
  }

  const q = list[Math.floor(Math.random() * list.length)];
  displayQuote(q);
}

// ---------- Import / Export ----------
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

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        displayQuote();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ---------- Server simulation + syncing ----------
function formatServerPostsToQuotes(posts) {
  // JSONPlaceholder posts: {title, body}. We'll map title->text, body->category(sliced)
  return posts.map(p => ({
    text: p.title,
    category: (p.body || "general").substring(0, 20) || "general"
  }));
}

// Merge with conflict detection (server overrides by default)
function mergeQuotes(serverQuotes, localQuotes) {
  const merged = [...localQuotes];
  conflictList = [];

  serverQuotes.forEach(sq => {
    const idx = merged.findIndex(lq => lq.text === sq.text);
    if (idx > -1) {
      if (merged[idx].category !== sq.category) {
        // record conflict
        conflictList.push({ text: sq.text, local: merged[idx], server: sq });
      }
      // default rule: server wins
      merged[idx] = sq;
    } else {
      merged.push(sq);
    }
  });

  // Show/hide banner
  const banner = document.getElementById("conflictNotification");
  if (banner) {
    if (conflictList.length > 0) banner.classList.remove("hidden");
    else banner.classList.add("hidden");
  }

  return merged;
}

async function syncWithServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const posts = await res.json();
    const serverQuotes = formatServerPostsToQuotes(posts);

    quotes = mergeQuotes(serverQuotes, quotes);
    saveQuotes();
    populateCategories();

    // Respect current filter after sync
    const selected = localStorage.getItem("selectedCategory") || "all";
    const select = document.getElementById("categoryFilter");
    if (select) select.value = selected;
    filterQuotes();

    console.log("Synced with server (server overrides local on conflict).");
  } catch (err) {
    console.error("Error syncing with server:", err);
  }
}

// Send a single new quote to server (simulation)
async function sendQuoteToServer(quote) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: quote.text, body: quote.category, userId: 1 })
    });
    const result = await res.json();
    console.log("Quote sent to server:", result);
  } catch (err) {
    console.error("Error sending quote:", err);
  }
}

// Allow user to resolve all conflicts in one action
function resolveConflicts(choice) {
  if (conflictList.length === 0) {
    alert("No conflicts to resolve.");
    return;
  }

  conflictList.forEach(conf => {
    const idx = quotes.findIndex(q => q.text === conf.text);
    if (idx > -1) {
      quotes[idx] = (choice === "server") ? conf.server : conf.local;
    }
  });

  conflictList = [];
  saveQuotes();
  populateCategories();
  filterQuotes();

  document.getElementById("conflictNotification")?.classList.add("hidden");
  alert(`Conflicts resolved. Kept ${choice.toUpperCase()} data.`);
}

// ---------- Events & init ----------
newQuoteBtn.addEventListener("click", showRandomQuote);

// Populate UI and display last or random quote
window.onload = () => {
  populateCategories();

  const last = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (last) displayQuote(last);
  else showRandomQuote();

  // Start periodic sync (every 30s)
  setInterval(syncWithServer, 30000);
};
