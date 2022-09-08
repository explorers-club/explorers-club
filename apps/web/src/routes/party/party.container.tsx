import { CLIENT_PARTY_EVENTS } from '@explorers-club/party';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePartyActor } from '../../state/party.hooks';
import { PartyComponent } from './party.component';

export function Party() {
  const partyActor = usePartyActor();
  // TODO next grab params from URL and connect to party
  const { code } = useParams();

  useEffect(() => {
    if (code) {
      partyActor.send(CLIENT_PARTY_EVENTS.CONNECT(code));
    }
  }, [partyActor, code]);

  return <PartyComponent />;
}
