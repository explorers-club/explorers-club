import { selectGameConfig, selectOpenSlots } from './club-room.selectors';

const defaultInitialState = {
  hostUserId: '1',
  selectedGame: 'trivia-jam',
  gameConfigsSerialized: {},
  gameRoomId: '1',
  players: {
    jon1: {
      userId: 'jon1',
      slotNumber: 1,
      name: 'Jon',
      connected: true,
    },
  },
};

describe('selectOpenSlots', () => {
  it('should work', () => {
    const openSlots = selectOpenSlots(defaultInitialState);
    expect(openSlots).toStrictEqual([1, 2]);
  });
});

describe('selectGameConfig', () => {
  it('should have the max players of the selected game', () => {
    const config = selectGameConfig(defaultInitialState);
    expect(config.maxPlayers).toBe(250);
  });

  it('should have the max players of the selected game', () => {
    const config = selectGameConfig(defaultInitialState);
    expect(config.minPlayers).toBe(3);
  });
});
