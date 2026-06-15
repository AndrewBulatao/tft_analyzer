# Timeline of tasks:

### Phase 1: Getting started
- Get riot api
- Be able to search player
- Show their rank
- Show match history

# Notes:
- Packages needed: express, axios, dotenv, cors
- Accessing data: express -> Axios -> Riot API
    - Express: helps create a web server
    - Axios: Makes http requests
    - dotenv: allows secrets in a .env file
        - keep api key here
- cors: allows frontend and backend to talk to each other

### Phase 2: Create database
- Use mongo db 
- Store match data into db
- Be able to do queues based on requests

### Phase 3: Train data
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
P