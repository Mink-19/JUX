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

// Function to create a form for adding new quotes dynamically
function createAddQuoteForm() {
  // Check if form already exists
  if (document.getElementById("addQuoteForm")) return;

  const form = document.createElement("form");
  form.id = "addQuoteForm";

  // Input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter quote text";
  quoteInput.required = true;

  // Input for category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter category";
  categoryInput.required = true;

  // Submit button
  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Add Quote";

  // Append elements to form
  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(submitBtn);

  // Add form to body
  document.body.appendChild(form);

  // Handle form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const newQuote = {
      text: quoteInput.value,
      category: categoryInput.value
    };
    quotes.push(newQuote);
    saveQuotes();  //save to localStorage

    // Clear inputs
    quoteInput.value = "";
    categoryInput.value = "";

    alert("New quote added successfully!");
  });
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
  // If sessionStorage has last quote, display it
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.innerHTML = `
      <p>"${lastQuote.text}"</p>
      <small>Category: ${lastQuote.category}</small>
    `;
  } else {
    showRandomQuote();
  }
};

