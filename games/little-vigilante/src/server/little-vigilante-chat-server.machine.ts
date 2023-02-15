// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { LittleVigilanteServerEvent } from '@explorers-club/room';
import { LittleVigilanteState } from '@explorers-club/schema-types/LittleVigilanteState';
import { Room } from 'colyseus';
import { Observable } from 'rxjs';
import { createMachine } from 'xstate';

export const createLittleVigilanteChatServerMachine = (
  room: Room<LittleVigilanteState>,
  event$: Observable<LittleVigilanteServerEvent>
) =>
  createMachine({
    id: 'LittleVigilanteChatServer',
    initial: 'Running',
    schema: {
      // TODO add support for an event
      events: {} as LittleVigilanteServerEvent,
    },
    states: {
      Running: {
        invoke: {
          src: () => event$,
        },

        on: {
          // MESSAGE: {
          //   actions: (_, event) => {
          //     event.message
          //     room.state.chatMessagesSerialized.push(event.message.text);
          //   },
          // },
        },
      },
    },
  });
