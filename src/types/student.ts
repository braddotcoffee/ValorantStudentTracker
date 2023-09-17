export type Status = "NEW" | "UPDATED" | "UNCHANGED";

export interface Student {
    name: string;
    tracker: string;
    startingRank: string;
    startingRR?: number;
    notes: Note[];
    status: Status;
    row?: number;
}

export interface Note {
    content: string;
    date: Date;
    currentRank: string;
    currentRR?: number;
    status: Status;
    row?: number;
}