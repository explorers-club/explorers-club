import { useInterpret } from '@xstate/react';
import { PartyComponent } from './party.component';
import partyMachine from './party.machine';
import { PartyServiceContext } from './party.service';

export function Party() {
  const partyService = useInterpret(partyMachine);

  return (
    <PartyServiceContext.Provider value={partyService}>
      <PartyComponent />
    </PartyServiceContext.Provider>
  );
}
