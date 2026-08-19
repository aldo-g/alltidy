export type FeedItem = {
  id: string;
  initial: string;
  name: string;
  when: string;
  area: string;
  dist: string;
  time: string;
  streets: string;
};

export const MOCK_FEED: FeedItem[] = [
  { id: "1", initial: "S", name: "Sanne de Vries", when: "2h ago", area: "De Pijp", dist: "1.8km", time: "41:12", streets: "9" },
  { id: "2", initial: "T", name: "Thomas B.", when: "5h ago", area: "Oud-West", dist: "0.9km", time: "22:04", streets: "4" },
  { id: "3", initial: "R", name: "Ruth Okonjo", when: "Yesterday", area: "Noord", dist: "3.4km", time: "1:12:30", streets: "17" },
  { id: "4", initial: "J", name: "Jasper Meijer", when: "Yesterday", area: "Jordaan", dist: "1.1km", time: "28:47", streets: "6" },
  { id: "5", initial: "F", name: "Fatima El A.", when: "2 days ago", area: "Centrum", dist: "2.2km", time: "51:03", streets: "11" },
];
