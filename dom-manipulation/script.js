// Array of quotes (each has text + category)
const quotes = [
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

    // Clear inputs
    quoteInput.value = "";
    categoryInput.value = "";

    alert("New quote added successfully!");
  });
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Automatically create add-quote form on page load
window.onload = () => {
  createAddQuoteForm();
  showRandomQuote(); // show first quote immediately
};
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    // Add to quotes array
    quotes.push({ text, category });

    // Update the DOM to show the newly added quote
    quoteDisplay.innerHTML = `
      <p>"${text}"</p>
      <small>Category: ${category}</small>
    `;

    // Clear input fields
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please enter both a quote and a category.");
  }
}

