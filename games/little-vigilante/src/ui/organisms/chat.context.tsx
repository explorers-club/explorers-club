import { useInterpret } from '@xstate/react';
import { createContext, FC, ReactNode, useState } from 'react';
import { useLittleVigilanteEvent$, useMyUserId } from '../../state/little-vigilante.hooks';
import { ChatActor, createChatMachine } from './chat.machine';

export const ChatServiceContext = createContext({} as ChatActor);

interface Props {
  children: ReactNode;
}

export const ChatServiceProvider: FC<Props> = ({ children }) => {
  const userId = useMyUserId();
  const events$ = useLittleVigilanteEvent$();
  const [machine] = useState(createChatMachine(events$, userId));
  const service = useInterpret(machine);

  return (
    <ChatServiceContext.Provider value={service}>
      {children}
    </ChatServiceContext.Provider>
  );
};
