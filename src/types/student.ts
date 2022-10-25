export type Status = "NEW" | "UPDATED" | "UNCHANGED";

export interface Student {
    name: string;
    tracker: string;
    startingRank: string;
    notes: Note[];
    status: Status;
    row?: number;
}

export interface Note {
    content: string;
    date: Date;
    status: Status;
    row?: number;
}