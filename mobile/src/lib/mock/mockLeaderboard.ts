export type LeaderboardRow = {
  id: string;
  rank: number;
  initial: string;
  name: string;
  km: string;
  isYou?: boolean;
};

export const MOCK_LEADERBOARD: LeaderboardRow[] = [
  { id: "1", rank: 1, initial: "R", name: "Ruth Okonjo", km: "38.2km" },
  { id: "2", rank: 2, initial: "S", name: "Sanne de Vries", km: "31.7km" },
  { id: "3", rank: 3, initial: "M", name: "Maartje (you)", km: "28.4km", isYou: true },
  { id: "4", rank: 4, initial: "T", name: "Thomas B.", km: "24.9km" },
  { id: "5", rank: 5, initial: "J", name: "Jasper Meijer", km: "19.3km" },
  { id: "6", rank: 6, initial: "F", name: "Fatima El A.", km: "17.8km" },
];

export const NEIGHBOURHOOD_CUP = {
  leader: "Jordaan",
  trailer: "De Pijp",
  marginKm: 4.1,
  daysLeft: 9,
};
