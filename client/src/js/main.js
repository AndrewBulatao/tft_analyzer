// Make search bar look up user

// Elements on page to track
const form = document.getElementById("player-search");
const input = document.getElementById("riot-id");
const errorMessage = document.getElementById("error-message");
const loadingCircle = document.getElementById("loading-circle");

// Get action of clicking/submitting the form
form.addEventListener("submit", async function(event) {
    loadingCircle.style.display = "block";
    // Reset the error display in case user tries again
    errorMessage.style.display = "none";
    // Prevent the page from refreshing
    event.preventDefault();

    // Get what the user typed
    const riotId = input.value;

    // Split the string by # to get game name and tag line
    const parts = riotId.split("#");

    const gameName = parts[0];
    const tagLine = parts[1];

    console.log("Game Name:", gameName);
    console.log("Tag Line:", tagLine);

    // Try to find the player
    try {
        const response = await fetch(
            `http://127.0.0.1:3000/player-stats/${gameName}/${tagLine}`
            );

        console.log("HTTP Status:", response.status);

        if (!response.ok) {
            throw new Error(
                `Server returned ${response.status} ${response.statusText}`
            );
        }
        const data = await response.json();
        console.log("Data received:", data);

        // If success, go to stats page
        window.location.href =
            `stats.html?gameName=${gameName}&tagLine=${tagLine}`;

    } catch (error) {
        console.error("Failed to fetch player stats");
        console.error("Game Name:", gameName);
        console.error("Tag Line:", tagLine);
        console.error("Error:", error.name);
        console.error("Message:", error.message);

        // Show error message
        errorMessage.textContent = "Player not found.";
        errorMessage.style.display = "block";
        loadingCircle.style.display = "none";
    }

});