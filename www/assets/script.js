document.addEventListener("DOMContentLoaded", function () {
    const jourSelect = document.getElementById("jour-select");
    const heureSelect = document.getElementById("heure-select");
    const minuteSelect = document.getElementById("minute-select");
    const addButton = document.getElementById("add-dispo");
    const dispoList = document.getElementById("dispo-list");
    const dispoInput = document.getElementById("disponibilites-input");
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("submit-btn");

    const disponibilites = [];

    // Adding availability to the list
    addButton.addEventListener("click", () => {
        const jour = jourSelect.value;
        const heure = heureSelect.value;
        const minute = minuteSelect.value;

        const label = `${jour} à ${heure}h${minute}`;
        disponibilites.push({ jour, heure, minute });

        // Display the availability in the list
        const li = document.createElement("li");
        li.textContent = label;
        dispoList.appendChild(li);

        // Update the hidden input with the JSON-encoded availability data
        dispoInput.value = JSON.stringify(disponibilites);

        // Log the availability to the console to verify
        console.log("Disponibilités:", disponibilites);
    });

    // Handle submission via the submit button
    submitBtn.addEventListener("click", function() {
        // Ensure the hidden input has the correct data before submission
        dispoInput.value = JSON.stringify(disponibilites);
        
        // Log the data for debugging
        console.log("Submitting form with data:", dispoInput.value);
        
        // Submit the form
        form.submit();
    });

    // Also handle regular form submission
    form.addEventListener("submit", function(event) {
        // Ensure the hidden input has the correct data before submission
        dispoInput.value = JSON.stringify(disponibilites);
        
        // Log the data for debugging
        console.log("Form submitted naturally with data:", dispoInput.value);
    });
});