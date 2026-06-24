# Timeline of tasks:

## Phase 1: Getting started
- ~~Get riot api~~
- ~~Be able to search player~~
- ~~Show match history~~
- Show their rank

- To run server locally, be in the server directory and type
    `node src/server.js`
  in the terminal 

### Commands for curl
My puuid:
0xsw2ec2cT43IoO8zZRrrYxjZikENaMH3zJnML4bub3c82uOTNHdmssInc1Mehc7GybGW0z2qGFtJQ

## To print out excel docs
- Traits
    `curl -o traits.xlsx http://localhost:3000/export/traits/0xsw2ec2cT43IoO8zZRrrYxjZikENaMH3zJnML4bub3c82uOTNHdmssInc1Mehc7GybGW0z2qGFtJQ`
Commands start as:
`curl http://localhost:3000/... | jq`
and after the forward slash, you would choose what you want to. The | jq is for organization purposes

Examples:
- Look for users PUUID
`curl http://localhost:3000/account/SaltyBuddy/Salty | jq`

- Look for matchID
`curl http://localhost:3000/matches/SaltyBuddy/Salty | jq`

- Look for match by matchID
`curl http://localhost:3000/match/NA1_5408919744 | jq`

- Get 10 recent matches played
`curl http://localhost:3000/placements/SaltyBuddy/Salty | jq`

## Notes:
- Packages needed: express, axios, dotenv, cors
- Accessing data: express -> Axios -> Riot API
    - Express: helps create a web server
    - Axios: Makes http requests
    - dotenv: allows secrets in a .env file
        - keep api key here
- cors: allows frontend and backend to talk to each other
- Riot APIs uses PUUID to access multiple features

--- 

## Phase 2: Create database
- ~~Use mongo db~~
- ~~Store match data into db~~
- ~~Organize players data for next phase~~ 

### Notes:
- Flow chart of accessing data in db
    1. Request
    2. Check MongoDB
        - If data exists, return it
        - Otherwise:
            a. Riot API
            b. Save to MongoDB
            c. Return data

--- 

## Phase 3: Train data
- Information we want:
    - Average end level
    - Train trait data
        - See what the most common trait the user plays
            - see what their win percentage is with that trait
            -  **Later implementation:** See how contested they are with traits they win/lose with the trait
    - Average time alive
- Export the data to Python
- Train a model to predict and suggest better ways to play
- We can try using mobalytics to collect data
`https://mobalytics.gg/builds-widget-documentation/`

### Notes
- Storage management
Only store a player if someone searches for them (Cache-on-demand)
- Saves Riot API calls
- Don't have to store millions of players
- Faster API calls
- ***Add expiration***

--- 

## Phase 4: Create website
- Create a website to display
### Website features
- Have a bar graph visualizing the players stats
    - This can also be used for most common traits used

--- 

## Documentation of functions available to access data
`https://developer.riotgames.com/apis#tft-league-v1`

## Extra data analysis features to implement in future
- See what the most common traits played in the recent 10 games played
    -   ~~trait win rates~~
    -   composition detection (Not in api, could try to reverse engineer)
- Users econ usage:
    - Not possible to get users in depth econ usage, however, you can try to reconstruct it.
    - Use Panda's document to help calculate and find out what you need. Provides a 52 page research paper on econ
    Reddit post:
    `https://www.reddit.com/r/CompetitiveTFT/comments/1td1sy7/i_tried_to_build_a_quantitative_model_of_the_tft/`
    Actual Document:
    `https://drive.google.com/file/d/1g8yND1BGgh1P-zcUFogs5Y7v1bkfRZuK/view`

---

## AI Integration Idea (PH Teamfight Tactics Data Analysis)

This project can be extended with an AI layer that enhances the existing data analysis and placement prediction system.
Github:
`https://github.com/rndmagtanong/ph_tft#exploratory-data-analysis`

The current project already performs:
- Data collection from Riot API
- Exploratory Data Analysis (traits, augments, winrates, usage rates)
- Placement prediction using machine learning models

---

### Future AI Enhancement Goal

The AI component will act as an **interpretation and recommendation layer** built on top of structured game data.

Instead of replacing statistical analysis, AI will:

- Explain trends found in the dataset in natural language
- Summarize player performance patterns
- Compare individual player behavior against high-performing or meta patterns
- Highlight possible mistakes or inefficiencies based on statistical differences


### Example AI Use Cases

- “This player performs worse with Trait X compared to the dataset average.”
- “High-winrate augments are underutilized in this player’s games.”
- “The player tends to reach late game levels slower than higher placement games.”
- “These traits correlate with higher average placement in the current dataset.”


### Key Design Principle

The AI does not generate raw game knowledge on its own.  
It only interprets and explains results computed from:

- EDA statistics
- Aggregated match data
- Machine learning outputs

### Final Goal

To transform raw TFT match data into an **interactive analysis system**, where:

- Data shows what is happening
- ML predicts outcomes
- AI explains why it matters and how to improve