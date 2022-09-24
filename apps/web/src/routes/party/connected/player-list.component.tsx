import { useSelector } from "@xstate/react";
import { usePartyScreenActor } from "../party-screen.hooks";

export const PlayerList = () => {
  const actor = usePartyScreenActor();
  const partyActor = useSelector(actor, (state) => state.context.partyActor);
  return (
    <ul>
    </ul>
  );
};
