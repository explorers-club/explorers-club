import { z } from 'zod';

const Resource = z.enum(['brick', 'ore', 'sheep', 'wheat', 'wood']);

const TileType = z.enum([
  'forest',
  'pasture',
  'fields',
  'hill',
  'mountain',
  'desert',
]);

const HarborType = z.enum([
  'generic',
  'brick',
  'ore',
  'sheep',
  'wheat',
  'wood',
]);

const DevelopmentCard = z.enum([
  'knight',
  'victoryPoint',
  'roadBuilding',
  'yearOfPlenty',
  'monopoly',
]);

const Coordinate = z.object({
  x: z.number(),
  y: z.number(),
});

const Tile = z.object({
  type: TileType,
  number: z.number().optional(),
  coordinate: Coordinate,
});

const Harbor = z.object({
  type: HarborType,
  position: Coordinate,
  direction: z.enum([
    'northwest',
    'north',
    'northeast',
    'southeast',
    'south',
    'southwest',
  ]),
});

const Board = z.object({
  tiles: z.array(Tile),
  harbors: z.array(Harbor),
});

const Player = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  resources: z.record(Resource, z.number()),
  developmentCards: z.record(DevelopmentCard, z.number()),
  settlements: z.array(Coordinate),
  cities: z.array(Coordinate),
  roads: z.array(z.object({ start: Coordinate, end: Coordinate })),
});

export const GameState = z.object({
  board: Board,
  players: z.array(Player),
  currentPlayer: z.string(),
  turnNumber: z.number(),
  largestArmyPlayer: z.string().optional(),
  longestRoadPlayer: z.string().optional(),
});
