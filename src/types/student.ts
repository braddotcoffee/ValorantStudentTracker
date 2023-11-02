export type Status = "NEW" | "UPDATED" | "UNCHANGED";

// Defining the string literal type for ranks in a way where we can still access the type information at runtime
export const Rank = [ "Iron 1",      "Iron 2",      "Iron 3",
                      "Bronze 1",    "Bronze 2",    "Bronze 3",
                      "Silver 1",    "Silver 2",    "Silver 3",
                      "Gold 1",      "Gold 2",      "Gold 3",
                      "Platinum 1",  "Platinum 2",  "Platinum 3",
                      "Diamond 1",   "Diamond 2",   "Diamond 3",
                      "Ascendant 1", "Ascendant 2", "Ascendant 3",
                      "Immortal 1",  "Immortal 2",  "Immortal 3",
                      "Radiant" ] as const
export type Rank = typeof Rank[number]

export interface Coach {
    spreadsheetId: string;
}

export interface Student {
    name: string;
    tracker: string;
    startingRank: Rank;
    startingRR?: number;
    notes: Note[];
    status: Status;
    row?: number;
}

export interface Note {
    content: string;
    date: Date;
    currentRank: Rank;
    currentRR?: number;
    status: Status;
    row?: number;
}