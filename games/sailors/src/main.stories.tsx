import { Grid } from '@atoms/Grid';
import { transformer, trpc } from '@explorers-club/api-client';
import { Story } from '@storybook/react';
import { WorldProvider } from '@context/WorldProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWSClient, wsLink } from '@trpc/client';
import { FC, useState } from 'react';
import { Subject } from 'rxjs';

type WsClient = ReturnType<typeof createWSClient>;

export default {
  parameters: {
    layout: 'fullscreen',
  },
};

const RoomScene: FC<{ clubId: string }> = (props) => {
  return <div>{props.clubId}</div>;
};

const PlayerInstance: FC<{ clubId: string }> = (props) => {
  const { clubId } = props;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [queryClient] = useState(() => new QueryClient());
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
          <RoomScene clubId={clubId} />
        </WorldProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

const Template: Story<{ numPlayers: number; clubId: string }> = ({
  numPlayers,
  clubId,
}) => {
  return (
    <Grid
      css={{
        // height: '100vh',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gridAutoRows: '700px',
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <PlayerInstance clubId={clubId} />
      ))}
    </Grid>
  );
};

export const Default = Template.bind({});

Default.args = {
  numPlayers: 4,
  clubId: 'foobar',
};

// const fullPlayerInfo = [
//   {
//     name: 'Alice',
//     userId: 'alice123',
//   },
//   {
//     name: 'Bob',
//     userId: 'bob123',
//   },
//   {
//     name: 'Charlie',
//     userId: 'charlie123',
//   },
//   {
//     name: 'Dave',
//     userId: 'dave123',
//   },
//   {
//     name: 'Eve',
//     userId: 'eve123',
//   },
//   {
//     name: 'Frank',
//     userId: 'frank123',
//   },
//   {
//     name: 'Grace',
//     userId: 'grace123',
//   },
//   {
//     name: 'Heidi',
//     userId: 'heidi123',
//   },
// ];
