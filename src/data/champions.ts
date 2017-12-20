export interface IChampion {
  id: string;
  name: string;
}

export const champions: IChampion[] = [
  {
    id: "1318732017",
    name: "Rook"
  },
  {
    id: "550061327",
    name: "Ruh Kaan"
  },
  {
    id: "763360732",
    name: "Shifu"
  },
  {
    id: "1422481252",
    name: "Bakko"
  },
  {
    id: "1749055646",
    name: "Raigon"
  },
  {
    id: "1606711539",
    name: "Freya"
  },
  {
    id: "1208445212",
    name: "Croak"
  },
  {
    id: "1463164578",
    name: "Thorn"
  },
  {
    id: "65687534",
    name: "Jade"
  },
  {
    id: "1",
    name: "Ashka"
  },
  {
    id: "369797039",
    name: "Varesh"
  },
  {
    id: "1377055301",
    name: "Ezmo"
  },
  {
    id: "39373466",
    name: "Jumong"
  },
  {
    id: "842211418",
    name: "Iva"
  },
  {
    id: "870711570",
    name: "Destiny"
  },
  {
    id: "154382530",
    name: "Taya"
  },
  {
    id: "467463015",
    name: "Lucie"
  },
  {
    id: "259914044",
    name: "Sirius"
  },
  {
    id: "1134478706",
    name: "Poloma"
  },
  {
    id: "543520739",
    name: "Blossom"
  },
  {
    id: "1649551456",
    name: "Pestilus"
  },
  {
    id: "1908945514",
    name: "Oldur"
  },
  {
    id: "44962063",
    name: "Pearl"
  },
  {
    id: "613085868",
    name: "Alysia"
  }
];

export function getChampionById(id: string): IChampion {
  return champions.find(m => m.id === id);
}
