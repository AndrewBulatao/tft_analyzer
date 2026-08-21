// Make search bar look up user
const form = document.getElementById("player-search");
const input = document.getElementById("riot-id");

// Get action of clicking/submitting the form
form.addEventListener("submit", function(event) {

    // Prevent the page from refreshing
    event.preventDefault();

    // Get what the user typed
    const riotId = input.value;

    // Split the string by # to get game name and tag line
    const parts = riotId.split("#");

    const gameName = parts[0];
    const tagLine = parts[1];

    // Try to find the player
    try {

        // TODO: Call backend API

        // If successful, go to stats screen
        window.location.href = "stats.html";

    } catch (error) {

        // TODO: Display error to user
        console.log("Player not found:", error);
    }

});