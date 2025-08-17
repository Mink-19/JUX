// ---------- Quotes Data ----------
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Life" },
  { text: "If you can dream it, you can do it.", category: "Motivation" }
];

// ---------- Function to Display Random Quote ----------
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quoteObj = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear existing content
  quoteDisplay.innerHTML = "";

  // Create elements dynamically
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quoteObj.text}"`;

  const quoteCategory = document.createElement("span");
  quoteCategory.textContent = `— ${quoteObj.category}`;
  quoteCategory.style.fontStyle = "italic";
  quoteCategory.style.color = "gray";

  // Append to DOM
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// ---------- Function to Create "Add Quote" Form ----------
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.id = "quoteForm";

  // Input for Quote Text
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Enter quote text";

  // Input for Category
  const inputCategory = document.createElement("input");
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter category";

  // Submit Button
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  // Append inputs and button
  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  // Append to body (or another section)
  document.body.appendChild(formContainer);

  // Add event listener
  addButton.addEventListener("click", function () {
    const newQuote = inputText.value.trim();
    const newCategory = inputCategory.value.trim();

    if (newQuote && newCategory) {
      quotes.push({ text: newQuote, category: newCategory });
      alert("New quote added successfully!");
      inputText.value = "";
      inputCategory.value = "";
    } else {
      alert("Please fill in both fields!");
    }
  });
}

// ---------- Event Listeners ----------
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Call form creation on load
createAddQuoteForm();
