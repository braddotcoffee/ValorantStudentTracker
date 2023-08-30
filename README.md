# Student Tracker
A website for tracking student VOD review notes.

---
- [Details](#details)
- [Development](#development)
    - [Setup](#setup)
    - [Run](#run)
---

## Details
* Name
* Starting Rank
* Tracker.gg link
* Notes (1->Many)

## Development

### Setup
1. Copy `environment.ts` to `environment.dev.ts`.
2. Populate the `googleClientId` field with the client id of your application.
    - You will need to create a project on [Google Cloud Console](https://console.cloud.google.com/)
    - Enable the API service for Google Sheets
    - Create an OAuth client on the credentials page
3. Create a spreadsheet on google docs and copy its id to the `spreadsheetId` field.
4. `npm install`

### Run
```npm run dev```