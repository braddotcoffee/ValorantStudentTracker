import { Rank } from "src/types/student";

export function shouldTrackRR(rank: Rank): boolean {
    return ['Immortal 1', 'Immortal 2', 'Immortal 3', 'Radiant'].includes(rank);
}