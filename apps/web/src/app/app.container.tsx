import { transformer, trpc } from '@explorers-club/api-client';
import { ConnectionEntity, SnowflakeId } from '@explorers-club/schema';
import { noop } from '@explorers-club/utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, wsLink } from '@trpc/client';
import {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Subject } from 'rxjs';
import { ServicesProvider } from '../services';
import { WorldProvider } from '../state/world.context';
import { AppComponent } from './app.component';

type WsClient = ReturnType<typeof createWSClient>;

export const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const wsClient$ = new Subject<{ type: 'OPEN'; wsClient: WsClient }>();
  const wsClient = createWSClient({
    url: `ws://localhost:3001`,
    onOpen() {
      wsClient$.next({ type: 'OPEN', wsClient });
    },
  });

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer,
      links: [
        wsLink({
          client: wsClient,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <WorldProvider>
          <ConnectionProvider>
            <ServicesProvider>
              <AppComponent />
            </ServicesProvider>
          </ConnectionProvider>
        </WorldProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const ConnectionContext = createContext({} as { myConnectionId?: SnowflakeId });

const ConnectionProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { client } = trpc.useContext();
  const [myConnectionId, setMyConnectionId] = useState<
    SnowflakeId | undefined
  >();

  useLayoutEffect(() => {
    let timer: NodeJS.Timeout;
    // todo use encrypted storage
    const refreshToken = localStorage.getItem('refreshToken') || undefined;
    const accessToken = localStorage.getItem('accessToken') || undefined;
    const deviceId = localStorage.getItem('deviceId') || undefined;

    const authTokens =
      refreshToken && accessToken ? { refreshToken, accessToken } : undefined;

    client.connection.initialize
      .mutate({ deviceId, authTokens, initialLocation: window.location.href })
      .then((data) => {
        localStorage.setItem('refreshToken', data.authTokens.refreshToken);
        localStorage.setItem('accessToken', data.authTokens.accessToken);
        localStorage.setItem('deviceId', data.deviceId);

        window.addEventListener('popstate', () => {
          client.connection.navigate.mutate({ location: window.location.href });
        });

        timer = setInterval(() => {
          client.connection.heartbeat.mutate(undefined).then(noop);
        }, 100);

        const { connectionId } = data;

        setMyConnectionId(connectionId);
      });
    return () => {
      clearInterval(timer);
    };
  }, [client]);

  return (
    <ConnectionContext.Provider value={{ myConnectionId }}>
      {children}
    </ConnectionContext.Provider>
  );
};
