# Timeline of tasks:

### Phase 1: Getting started
- ~~Get riot api~~
- ~~Be able to search player~~
- ~~Show match history~~
- Show their rank

### To run server locally, be in the server directory and type
`node src/server.js`
### in the terminal 

# Commands for curl

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

## Phase 3: Train data
- Information we want:
    - Average end level
- Export the data to Python
- Train a model to predict and suggest better ways to play
- We can try using mobalytics to collect data
`https://mobalytics.gg/builds-widget-documentation/`

### Phase 4: Create website
- Create a website to display



### Ideas/notes
- Flow of accessing data:
1. Determine which region player is in, use na1 bc player is on NA
2. Now use americas.api because match data is stored in the americas routing cluster
- Have access to match history
    - Fresh data is cheaper
    - Match history service optimized for fresh data
- Data dragon is what their official static data repo is called

## Accessing data
- Augments:
`https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/tft-augments.json`
- Champions:
`https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/tft-augments.json`
- Items:
`https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/tft-augments.json`
- Queues:
`https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/tft-augments.json`
- Regalia:
`https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/tft-augments.json`
- Traits:
`https://ddragon.leagueoflegends.com/cdn/13.24.1/data/en_US/tft-augments.json`

## Documentation of functions available to access data
`https://developer.riotgames.com/apis#tft-league-v1`

## Storage management
Only store a player if someone searches for them (Cache-on-demand)
- Saves Riot API calls
- Don't have to store millions of players
- Faster API calls
- ***Add expiration***

# DB structure


## Extra features to implement in future
- See what the most common traits played in the recent 10 games played
    -   trait win rates
    -   composition detection
- Users econ usage:
    - Not possible to get users in depth econ usage, however, you can try to reconstruct it.
    - Use Panda's document to help calculate and find out what you need.
    `https://www.reddit.com/r/CompetitiveTFT/comments/1td1sy7/i_tried_to_build_a_quantitative_model_of_the_tft/`
### Website features
- Have a bar graph visualizing the players stats
    - This can also be used for most common traits used