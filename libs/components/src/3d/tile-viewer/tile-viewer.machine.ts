import { Camera } from 'three';
import { ActorRefFrom, createMachine, StateFrom } from 'xstate';

export type TileViewerEvent = { type: 'CHANGE_RESOLUTION' };

export type TileViewerContext = {
  res: number;
  lat: number;
  lng: number;
};

export const createTileViewerMachine = (camera: Camera) =>
  createMachine({
    id: 'TileViewerMachine',
    schema: {
      context: {} as TileViewerContext,
      events: {} as TileViewerEvent,
    },
    states: {
      Idle: {},
    },
  });

export type TileViewerMachine = ReturnType<typeof createTileViewerMachine>;
export type TileViewerActor = ActorRefFrom<TileViewerMachine>;
export type TileViewserState = StateFrom<TileViewerMachine>;
