// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.44
// 

import { Schema, type, ArraySchema, MapSchema, SetSchema, DataChange } from '@colyseus/schema';
import { DiffusionaryPlayer } from './DiffusionaryPlayer'

export class DiffusionaryState extends Schema {
    @type("number") public currentRound!: number;
    @type({ map: DiffusionaryPlayer }) public players: MapSchema<DiffusionaryPlayer> = new MapSchema<DiffusionaryPlayer>();
}
