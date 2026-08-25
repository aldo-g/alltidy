export const MOCK_CHALLENGE = {
  title: "Grachtengordel 100",
  description: "100 km of canal-side street cleaned by the city, together.",
  daysLeft: 9,
  km: 71.4,
  targetKm: 100,
  people: 1208,
};

export type MeetUp = {
  id: string;
  day: string;
  month: string;
  title: string;
  time: string;
  meetPoint: string;
  going: number;
  tag?: string;
};

export const MOCK_MEETUPS: MeetUp[] = [
  {
    id: "1",
    day: "22",
    month: "Aug",
    title: "Westerpark morning sweep",
    time: "09:00",
    meetPoint: "Nassauplein",
    going: 34,
    tag: "Grabbers provided",
  },
  {
    id: "2",
    day: "27",
    month: "Aug",
    title: "Canal quay clean, Prinsengracht",
    time: "18:30",
    meetPoint: "Noorderkerk",
    going: 12,
  },
  {
    id: "3",
    day: "02",
    month: "Sep",
    title: "School run tidy, Oud-West",
    time: "08:15",
    meetPoint: "Ten Katemarkt",
    going: 8,
  },
];
