import { PartyPlayerActor } from "@explorers-club/party";
import { createContext } from "react";

export const JoinedContext = createContext({
  myActor: {} as PartyPlayerActor,
});
