# Student Tracker
A website for tracking student VOD review notes.

- [Details](#details)
- [Development](#development)
    - [Setup](#setup)
    - [Run](#run)

## Details
* Name
* Starting Rank
* Tracker.gg link
* Notes (1->Many)

## Development

### Setup
1. Copy `environment.ts` to `environment.dev.ts`.
2. Populate the `googleClientId` field with the client id of your application in `environment.dev.ts`.
    - You will need to create a project on [Google Cloud Console][1]
    - Enable the API service for Google Sheets
    - Create an OAuth client on the credentials page
3. Create a spreadsheet on google docs (Make sure its public).
    - Copy its id to the `spreadsheetId` field in `environment.dev.ts`
    - Copy its id to the `SheetID` field in `config.yaml`
4. Populate the `API_KEY` field in `secrets.yaml` with a generated API Key from [Google Cloud Console][1]
5. `npm install`

### Run

1. Start the backend container 
```
docker compose up
```
2. Start the frontend web server
```
npm run dev
```


[1]: https://console.cloud.google.com/