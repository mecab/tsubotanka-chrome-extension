import { roundTo } from 'round-to';

export function to万円(yen: number, round = 2): string {
    return roundTo(yen / 10000, round).toString();
}
