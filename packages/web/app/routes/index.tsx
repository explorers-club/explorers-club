import { useCallback } from 'react';
import { createMachine } from 'xstate';
import { createModel } from 'xstate/lib/model';

const appModel = createModel(
  {},
  {
    events: {},
  }
);

const appMachine = appModel.createMachine({
  id: 'app-machine',
  context: {},
  initial: 'Idle',
  states: {
    Home: {},
    Join: {},
    Start: {},
    Party: {},
  },
});

export default function Index() {
  const onPressJoinParty = useCallback(() => {}, []);

  const onPressStartParty = useCallback(() => {}, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Explorers Club</h1>
      <div style={{ flex: '1', flexDirection: 'row' }}>
        <input type="text" placeholder='ex: wf32q' />
        <button onClick={onPressJoinParty}>Join Party</button>
        <br />
        <button onClick={onPressStartParty}>Start Party</button>
      </div>
    </div>
  );
}
