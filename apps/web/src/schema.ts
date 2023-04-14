import { trpc } from '@explorers-club/api-client';
import { ClubNameSchema, Entity } from '@explorers-club/schema';
import { World } from 'miniplex';
import { Interpreter, InterpreterFrom, StateFrom } from 'xstate';
import { z } from 'zod';
import {
  CloseNavEventSchema,
  JoinRoomEventSchema,
  OpenLoginEventSchema,
  CloseLoginEventSchema,
  OpenNavEventSchema,
  StartRoomEventSchema,
} from './events';
import { AppMachine } from './state/app.machine';
import { LobbyEventSchema, LobbyMachine } from './state/lobby.machine';

type TrpcClient = ReturnType<typeof trpc.createClient>;
const TrpcClientSchema = z.custom<ReturnType<typeof trpc.createClient>>(
  (val) => val as TrpcClient
);

const WorldSchema = z.custom<World<Entity>>((val) => val as World<Entity>);

const AppServiceOptionsSchema = z.object({
  trpcClient: TrpcClientSchema,
  world: WorldSchema,
  activeRoom: ClubNameSchema.optional(),
});
export type AppServiceOptions = z.infer<typeof AppServiceOptionsSchema>;

export const AppContextSchema = z.object({
  activeRoom: z.string().optional(),
});
export type AppContext = z.infer<typeof AppContextSchema>;

export const AppEventSchema = z.union([
  StartRoomEventSchema,
  OpenNavEventSchema,
  CloseNavEventSchema,
  JoinRoomEventSchema,
  OpenLoginEventSchema,
  CloseLoginEventSchema,
]);
export type AppEvent = z.infer<typeof AppEventSchema>;

export type InterpreterEvent<T> = T extends Interpreter<
  any,
  any,
  infer U,
  any,
  any
>
  ? U
  : never;

type MachineMap = {
  appService: AppMachine;
  lobbyService: LobbyMachine;
};

export type ServiceMap = {
  appService: InterpreterFrom<AppMachine>;
  lobbyService?: InterpreterFrom<LobbyMachine>;
};

export type ServiceEventMap = {
  [P in keyof ServiceMap]?: InterpreterEvent<ServiceMap[P]>;
};

export const ServiceEventSchema = z.union([AppEventSchema, LobbyEventSchema]);
export type ServiceEvent = z.infer<typeof ServiceEventSchema>;

export type ServiceKey = keyof ServiceMap;

type NonOptionalKeys<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

export type RequiredServices = NonOptionalKeys<ServiceMap>;

export type ServiceState = {
  [P in keyof ServiceMap]: StateFrom<MachineMap[P]>;
};
