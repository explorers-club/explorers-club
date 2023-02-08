import { Story } from '@storybook/react';
import { Subject } from 'rxjs';
import { players } from './__stories/players';
import { LittleVigilanteServerEvent } from '@explorers-club/room';
import {
  LittleVigilanteMockState,
  withLittleVigilanteContext,
} from '../../test/withLittleVigilanteContext';
import { ScoreboardScreen } from './scoreboard-screen.component';

export default {
  component: ScoreboardScreen,
  decorators: [withLittleVigilanteContext],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Primary: Story<LittleVigilanteMockState> = () => {
  return <ScoreboardScreen />;
};

Primary.args = {
  myUserId: 'alice123',
  state: {
    players,
    currentRound: 1,
    hostUserIds: ['alice123'],
  },
};

Primary.play = async (context) => {
  const event$ = context.parameters[
    'event$'
  ] as Subject<LittleVigilanteServerEvent>;
  event$.next({
    type: 'MESSAGE',
    userId: 'alice123',
    conversationId: 'little_vigilante-alice123',
    ts: 0.012,
    text: 'foo',
  });
};
