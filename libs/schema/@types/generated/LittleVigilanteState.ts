// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { LittleVigilantePlayer } from './LittleVigilantePlayer'

export class LittleVigilanteState extends Schema {
    @type("number") public currentRound!: number;
    @type({ set: "string" }) public currentStates: SetSchema<string> = new SetSchema<string>();
    @type({ map: LittleVigilantePlayer }) public players: MapSchema<LittleVigilantePlayer> = new MapSchema<LittleVigilantePlayer>();
}
