# Teamfight Tactics Analyzer
(Write here what the program does)
- Indepth of how the ai process request
    1) Player matches
    2) Backend analytics
    3) Structured JSON
    4) AI Interpretation
        - AI is consuming analytics, not raw user questions. That is the reason for the Large Language Model (LLM)
    5) Personalized Report
        - Try using OpenAI GPT-4o-mini or Google Gemini 1.5 Flash to start for testing

    try to predict trends. Past 100 games, this happened. Have a slider to see where improvements. Can use ai to predict future games

## TODO
- ~~Make a filter for matches based on set and gamemode that user decides~~ 
- Find out how the db stores the gamemode, gametype, and set name
    - The different queues tell you which gamemode the user is playing
        - Ranked: 1100
        - Normal: 1090
        - Hyper_roll: 1130
        - Double_up: 1150
        - PvE: 1220
        - Tutorial: 1105
- Continue exporting trained data into excel for checking if everything is correct
- Use hugging face for ai or deepseek for cheap ai glm5-dash

___
# Timeline of tasks:
# Phase 1: Getting started
___
- ~~Get riot api~~
- ~~Be able to search player~~
- ~~Show match history~~
- Show their rank

## Phase 1 Notes:
- Packages needed: express, axios, dotenv, cors
- Accessing data: express -> Axios -> Riot API
    - Express: helps create a web server
    - Axios: Makes http requests
    - dotenv: allows secrets in a .env file
        - keep api key here
- cors: allows frontend and backend to talk to each other
- Riot APIs uses PUUID to access multiple features

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
___

## Phase 2: Create database
--- 

- ~~Use mongo db~~
- ~~Store match data into db~~
- ~~Organize players data for next phase~~ 

### Phase 2 Notes:
- Flow chart of accessing data in db
    1. Request
    2. Check MongoDB
        - If data exists, return it
        - Otherwise:
            a. Riot API
            b. Save to MongoDB
            c. Return data
___
## Phase 3: Train data
--- 
### Stage one: Obtain information we want

- Information we want:
    - ~~Average end level~~
    - ~~Match information~~
    - Most used:
        - ~~Traits~~
        - ~~Units~~
        - Augments

    - Trait data
        - ~~See what the most common trait the user plays~~
        - ~~See what their win percentage is with that trait~~
        - ~~Games played~~
        - ~~Top 4 count~~
        - ~~Average placement~~
        - Activation rate
        - ~~Average trait tier~~
        - ~~Average number of units~~
        - **Later implementation:** See how contested each trait is

    - Unit data
        - ~~Most played unit~~
        - ~~Win percentage with units~~
        - ~~Games played~~
        - ~~Average star level~~
        - ~~Items used~~
            - ~~How often an item was equipped~~
            - ~~Average number of item equipped~~
        - ~~Carry rate~~

    - Composition data
        - ~~Active traits~~
        - Units played together
        - Most common compositions
        - ~~Winning compositions~~

    **Later implementation, focus one player for now**
    - Opponent data
        - Opponent traits
        - Opponent units
        - Winning composition
        - Placement against each composition

    - We can try using Mobalytics to collect data
    `https://mobalytics.gg/builds-widget-documentation/`

### Stage one: Notes
- Storage management
Only store a player if someone searches for them (Cache-on-demand)
- Saves Riot API calls
- Don't have to store millions of players
- Faster API calls
- ***Add expiration***

---

### Stage two: Advanced Analysis System
- What we want this system to do:
    - Loss Pattern Detection
        - Input:
            - Traits used in bottom 4 games
            - Economy patterns in losses
        - Output:
            - "You lose when you play x without y"
            - Weakness score per trait/composition

    - Placement Prediction System
        - Estimate how well a player will perform in a game
        - See what traits work best for them
            - Also compare what traits they struggle against
        - Include:
            - Economy patterns
            - Past performance stats
            - Trait consistency and activation rates

    - Recommendation System (Future)
        - Suggest what to play next
            - Based on traits the user performs well with
            - Based on traits they underperform with
            - Based on common successful patterns in past games

        - Also consider:
            - What traits are commonly contested in their games
            - Whether they should pivot or continue their current direction

---

### Stage three: Machine learning
- What we want the ML system to do:
    - Learn patterns automatically from past match data instead of manually defined rules
    - Move from rule-based analysis → data-driven prediction

    - Placement Prediction
        - Predict player performance in a match
        - Input:
            - Traits used
            - Economy data
            - Unit strength
            - Past performance stats
        - Output:
            - Predicted placement (1–8)
            OR probability of Top 4

    - Loss Pattern Detection (learned version)
        - Identify hidden patterns in losing games
        - Detect trait combinations and economy states that lead to losses

    - Playstyle Classification
        - Automatically group players into playstyles:
            - Aggressive
            - Econ-focused
            - Vertical comp focused
            - Flexible / adaptive

    - New var: carry weight. Determined by star level, number of items used.
        - Determined if carry if star level and numb items are high
        - Positive numbers = frontline unit; Negative numbers = backline unit
            
___
## Phase 4: Create website

--- 

- Create a website to display

### Website features
- Display users profile picture using
`/tft/summoner/v1/summoners/by-puuid/{encryptedPUUID}`
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
___
# **Getting into AI**

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