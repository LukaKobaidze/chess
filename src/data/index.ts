export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];
export const PIECE_LETTERS = {
  king: 'K',
  queen: 'Q',
  rook: 'R',
  bishop: 'B',
  knight: 'N',
  pawn: '',
};

export const pieceSets = [
  'maestro',
  'cburnett',
  'chessnut',
  'letter',
  'pirouetti',
  'merida',
  'shapes',
  'pixel',
  'california',
  'fresca',
  'cardinal',
  'icpieces',
  'gioco',
  'tatiana',
  'staunty',
  'dubrovny',
  'libra',
] as const;

export const boards: readonly {
  name: string;
  image: string;
  thumbnail: string;
  coords: [string, string];
}[] = [
  {
    name: 'Blue Marble',
    image: 'blue-marble.jpg',
    thumbnail: 'blue-marble.thumbnail.jpg',
    coords: ['#000', '#000'],
  },
  {
    name: 'Blue 2',
    image: 'blue2.jpg',
    thumbnail: 'blue2.thumbnail.jpg',
    coords: ['#fff', '#fff'],
  },
  {
    name: 'Blue 3',
    image: 'blue3.jpg',
    thumbnail: 'blue3.thumbnail.jpg',
    coords: ['#000', '#fff'],
  },
  {
    name: 'Canvas 2',
    image: 'canvas2.jpg',
    thumbnail: 'canvas2.thumbnail.jpg',
    coords: ['#000', '#fff'],
  },
  {
    name: 'Green',
    image: 'green-plastic.png',
    thumbnail: 'green-plastic.thumbnail.png',
    coords: ['#000', '#000'],
  },
  {
    name: 'Grey',
    image: 'grey.jpg',
    thumbnail: 'grey.thumbnail.jpg',
    coords: ['#000', '#fff'],
  },
  {
    name: 'Leather',
    image: 'leather.jpg',
    thumbnail: 'leather.thumbnail.jpg',
    coords: ['#000', '#000'],
  },
  {
    name: 'Maple',
    image: 'maple.jpg',
    thumbnail: 'maple.thumbnail.jpg',
    coords: ['#000', '#fff'],
  },
  {
    name: 'Maple 2',
    image: 'maple2.jpg',
    thumbnail: 'maple2.thumbnail.jpg',
    coords: ['#000', '#fff'],
  },
  {
    name: 'Marble',
    image: 'marble.jpg',
    thumbnail: 'marble.thumbnail.jpg',
    coords: ['#fff', '#fff'],
  },
  {
    name: 'Newspaper',
    image: 'newspaper.png',
    thumbnail: 'newspaper.thumbnail.png',
    coords: ['#000', '#000'],
  },
  {
    name: 'Olive',
    image: 'olive.jpg',
    thumbnail: 'olive.thumbnail.jpg',
    coords: ['#fff', '#fff'],
  },
  {
    name: 'Pink',
    image: 'pink-pyramid.png',
    thumbnail: 'pink-pyramid.thumbnail.png',
    coords: ['#000', '#fff'],
  },
  {
    name: 'Purple Diag',
    image: 'purple-diag.png',
    thumbnail: 'purple-diag.thumbnail.png',
    coords: ['#000', '#fff'],
  },
  {
    name: 'Wood',
    image: 'wood.jpg',
    thumbnail: 'wood.thumbnail.jpg',
    coords: ['#fff', '#fff'],
  },
  {
    name: 'Wood 2',
    image: 'wood2.jpg',
    thumbnail: 'wood2.thumbnail.jpg',
    coords: ['#fff', '#fff'],
  },
  {
    name: 'Wood 3',
    image: 'wood3.jpg',
    thumbnail: 'wood3.thumbnail.jpg',
    coords: ['#000', '#fff'],
  },
  {
    name: 'Wood 4',
    image: 'wood4.jpg',
    thumbnail: 'wood4.thumbnail.jpg',
    coords: ['#fff', '#fff'],
  },
];
