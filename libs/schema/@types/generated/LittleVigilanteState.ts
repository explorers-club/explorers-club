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
    @type({ set: "string" }) public hostUserIds: SetSchema<string> = new SetSchema<string>();
    @type({ set: "string" }) public roles: SetSchema<string> = new SetSchema<string>();
    @type("number") public timeRemaining!: number;
    @type({ map: "string" }) public currentRoundRoles: MapSchema<string> = new MapSchema<string>();
    @type({ map: "string" }) public currentRoundVotes: MapSchema<string> = new MapSchema<string>();
    @type({ map: "number" }) public currentRoundPoints: MapSchema<number> = new MapSchema<number>();
    @type("string") public currentRoundArrestedPlayerId!: string;
    @type({ map: LittleVigilantePlayer }) public players: MapSchema<LittleVigilantePlayer> = new MapSchema<LittleVigilantePlayer>();
}
