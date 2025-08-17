// ---------- Load Quotes from Local Storage ----------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" },
  { text: "If you can dream it, you can do it.", category: "Motivation" }
];

// ---------- Function to Save Quotes to Local Storage ----------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ---------- Function to Display Random Quote ----------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteObj = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quoteObj.text}"`;

  const quoteCategory = document.createElement("span");
  quoteCategory.textContent = `— ${quoteObj.category}`;
  quoteCategory.style.fontStyle = "italic";
  quoteCategory.style.color = "gray";

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);

  //  NEW: Save last viewed quote in session storage
  sessionStorage.setItem("lastQuote", JSON.stringify(quoteObj));
}

// ---------- Function to Add New Quote ----------
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Save to local storage
    saveQuotes();

    alert("✅ New quote added successfully!");
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    // Show newly added quote
    document.getElementById("quoteDisplay").innerHTML =
      `<p>"${newQuoteText}"</p><span style="font-style:italic;color:gray;">— ${newQuoteCategory}</span>`;

    //  NEW: Save newly added as last viewed in session storage
    sessionStorage.setItem("lastQuote", JSON.stringify({ text: newQuoteText, category: newQuoteCategory }));
  } else {
    alert("⚠️ Please enter both quote and category!");
  }
}

// ---------- Event Listener ----------
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ---------- Load Last Viewed Quote from Session Storage ----------
window.onload = function () {
  //  NEW: Check session storage for last viewed quote
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quoteObj = JSON.parse(lastQuote);
    document.getElementById("quoteDisplay").innerHTML =
      `<p>"${quoteObj.text}"</p><span style="font-style:italic;color:gray;">— ${quoteObj.category}</span>`;
  }
};

