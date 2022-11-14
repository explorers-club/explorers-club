import { Button } from '@atoms/Button';
import { PartyPlayerEvents } from '@explorers-club/party';
import { FC, useCallback } from 'react';
import { useMyPartyPlayerActor } from './club-screen.hooks';
import { JoinedFooterComponent } from './joined-footer.component';

export const JoinedFooter: FC = () => {
  const actor = useMyPartyPlayerActor();

  return actor ? <JoinedFooterComponent myActor={actor} /> : <></>;
};
