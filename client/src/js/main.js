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

    console.log("Game Name:", gameName);
    console.log("Tag Line:", tagLine);

    // Try to find the player
   try {
    const response = await fetch(
        `http://localhost:3000/player-stats/${gameName}/${tagLine}`
    );
    if (!response.ok) {
        throw new Error("Player not found");
    }
    const data = await response.json();
    //console.log(data);

    } catch (error) {

        console.error("Error:", error);

    }

});