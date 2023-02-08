import { useInterpret } from '@xstate/react';
import { createContext, FC, ReactNode, useState } from 'react';
import { useLittleVigilanteEvent$ } from '../../state/little-vigilante.hooks';
import { ChatActor, createChatMachine } from './chat.machine';

export const ChatServiceContext = createContext({} as ChatActor);

interface Props {
  children: ReactNode;
}

export const ChatServiceProvider: FC<Props> = ({ children }) => {
  const events$ = useLittleVigilanteEvent$();
  const [machine] = useState(createChatMachine(events$));
  const service = useInterpret(machine);

  return (
    <ChatServiceContext.Provider value={service}>
      {children}
    </ChatServiceContext.Provider>
  );
};
