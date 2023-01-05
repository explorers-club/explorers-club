type PlayerColor =
  | 'yellow'
  | 'purple'
  | 'green'
  | 'blue'
  | 'orange'
  | 'red'
  | 'pink'
  | 'brown';

export const colorBySlotNumber: Record<number, PlayerColor> = {
  1: 'yellow',
  2: 'purple',
  3: 'green',
  4: 'blue',
  5: 'orange',
  6: 'red',
  7: 'pink',
  8: 'brown',
};
