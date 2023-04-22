/**
 * World Loop
 */

import { produceWithPatches } from 'immer';
import { world } from './world';
import { createMachine } from 'xstate';
import { SnowflakeIdSchema } from '@explorers-club/schema';
import { z } from 'zod';

// This is the game loop.
// It runs every tick

/**
 * State defintions
 * value - the current state value (e.g., {red: 'walk'})
 * context - the current context of this state
 * event - the event object that triggered the transition to this state
 * actions - an array of actions to be executed
 * activities - a mapping of activities to true if the activity started, or false if stopped.
 * history - the previous State instance
 * meta - any static meta data defined on the meta property of the state node
 * done - whether the state indicates a final state
 */

const LittleVigilanteRoomEntity = z.object({
  id: SnowflakeIdSchema,
});

const CodebreakersRoomEntity = z.object({
  id: SnowflakeIdSchema,
});

const SailorsOfEpicuriaPlayerEntitySchema = z.object({
  id: SnowflakeIdSchema
})

const SailorsOfEpicuriaRoomEntity = z.object({
  id: SnowflakeIdSchema,
  players: SailorsOfEpicuriaPlayerEntitySchema
});


const run = (tick: number) => {
  for (const entity of world.entities) {
    // produceWithPatches(entity, (draft) => {
    //   entity.machine.transition(entity, )
    //   // machine
    //   draft;
    // });
    // for (const command of entity.queue) {
    //   state = console.log(command);
    // }
  }
};
