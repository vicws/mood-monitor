const form = document.getElementById("entryForm");
const entriesList = document.getElementById("entriesList");
const symptomsContainer = document.getElementById("symptomsContainer");
const addSymptomBtn = document.getElementById("addSymptom");
const customContainer = document.getElementById("customContainer");
const addCustomBtn = document.getElementById("addCustom");
const toggleNotesBtn = document.getElementById("toggleNotes");
const notesField = document.getElementById("notes");

function getEntries() {
  return JSON.parse(localStorage.getItem("entries")) || [];
}

function saveEntries(entries) {
  localStorage.setItem("entries", JSON.stringify(entries));
}

function renderEntries() {
  const entries = getEntries();
  entriesList.innerHTML = "";

  entries.forEach((entry, index) => {
    const li = document.createElement("li");

    const textDiv = document.createElement("div");

    const symptomsText = entry.symptoms?.join(", ") || "Nenhum";

    let customText = "";
    if (entry.custom && Object.keys(entry.custom).length > 0) {
      customText =
        " | Custom: " +
        Object.entries(entry.custom)
          .map(([k, v]) => `${k}:${v}`)
          .join(", ");
    }

    const notesText = entry.notes ? ` | Obs: ${entry.notes}` : "";

    textDiv.textContent = `${entry.date} | Humor: ${entry.mood} | Ansiedade: ${entry.anxiety} | Energia: ${entry.energy} | Sintomas: ${symptomsText}${customText}${notesText}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Excluir";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", () => {
      const entries = getEntries();
      entries.splice(index, 1);
      saveEntries(entries);
      renderEntries();
    });

    li.appendChild(textDiv);
    li.appendChild(deleteBtn);

    entriesList.appendChild(li);
  });
}

// Sintoma simples (texto)
addSymptomBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Sintoma";
  input.classList.add("field");

  symptomsContainer.appendChild(input);
});

// Custom metric (nome + nota)
addCustomBtn.addEventListener("click", () => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("custom-group");

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Nome (ex: foco)";
  nameInput.classList.add("field");

  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.placeholder = "0-10";
  valueInput.min = "0";
  valueInput.max = "10";
  valueInput.classList.add("field");

  wrapper.appendChild(nameInput);
  wrapper.appendChild(valueInput);
  customContainer.appendChild(wrapper);
});

// Toggle textarea
toggleNotesBtn.addEventListener("click", () => {
  notesField.style.display =
    notesField.style.display === "none" ? "block" : "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const symptomInputs = symptomsContainer.querySelectorAll("input");
  const symptoms = Array.from(symptomInputs)
    .map((input) => input.value.trim())
    .filter((val) => val !== "");

  const customGroups = customContainer.querySelectorAll(".custom-group");
  const custom = {};

  customGroups.forEach((group) => {
    const inputs = group.querySelectorAll("input");
    const name = inputs[0].value.trim();
    const value = inputs[1].value;

    if (name !== "" && value !== "") {
      custom[name] = Number(value);
    }
  });

  const entry = {
    date: new Date().toISOString().split("T")[0],
    mood: Number(document.getElementById("mood").value),
    anxiety: Number(document.getElementById("anxiety").value),
    irritability: Number(document.getElementById("irritability").value),
    energy: Number(document.getElementById("energy").value),
    sleepHours: Number(document.getElementById("sleepHours").value),
    sleepQuality: Number(document.getElementById("sleepQuality").value),
    symptoms,
    custom,
    notes: notesField.value.trim(),
  };

  const entries = getEntries();
  entries.push(entry);
  saveEntries(entries);

  form.reset();
  symptomsContainer.innerHTML = "";
  customContainer.innerHTML = "";
  notesField.style.display = "none";

  renderEntries();
});

renderEntries();
