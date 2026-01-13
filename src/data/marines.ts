export type Rank =
  | "Scout"
  | "Marine"
  | "Sergeant"
  | "Chaplain"
  | "Captain"
  | "Librarian";

export type Chapter =
  | "Ultramarines"
  | "Blood Angels"
  | "Imperial Fists"
  | "Grey Knights"
  | "Dark Angels"
  | "Space Wolves"
  | "Sisters of Battle"
  | "Custodies";

export interface Marine {
  id: number;
  name: string;
  rank: Rank;
  chapter: Chapter;
  status: boolean;
}

// Exporta un array listo para usar (sin función envolviendo)
export const marines: Marine[] = [
  {
    id: 1,
    name: "Titus",
    rank: "Captain",
    chapter: "Ultramarines",
    status: true,
  },
  { id: 2, name: "Dann", rank: "Marine", chapter: "Dark Angels", status: true },
  {
    id: 3,
    name: "Lann",
    rank: "Chaplain",
    chapter: "Blood Angels",
    status: false,
  },
  {
    id: 4,
    name: "Leandros",
    rank: "Sergeant",
    chapter: "Ultramarines",
    status: true,
  },
  {
    id: 5,
    name: "Anna",
    rank: "Captain",
    chapter: "Sisters of Battle",
    status: true,
  },
  {
    id: 6,
    name: "Gunnar",
    rank: "Captain",
    chapter: "Custodies",
    status: true,
  },
  {
    id: 7,
    name: "Dimitri",
    rank: "Captain",
    chapter: "Space Wolves",
    status: true,
  },
  {
    id: 8,
    name: "Klaus",
    rank: "Captain",
    chapter: "Space Wolves",
    status: true,
  },
];
