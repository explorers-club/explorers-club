import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { TextField } from '@atoms/TextField';
import {
  DisconnectCommand,
  JoinCommand,
  LittleVigilanteServerEvent,
  LittleVigilanteStateSerialized,
  LittleVigilanteTargetPlayerRoleCommand,
  MessageCommand,
  PauseCommand,
  ResumeCommand,
  ServerEvent,
} from '@explorers-club/room';
import { colorBySlotNumber } from '@explorers-club/styles';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useSelector } from '@xstate/react';
// import { declareComponentKeys } from '../../i18n';
import { useSubscription } from 'observable-hooks';
import {
  FC,
  FormEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  colorByTeam,
  displayNameByRole,
  Role,
  teamByRole,
} from '../../meta/little-vigilante.constants';
import {
  useLittleVigilanteEvent$,
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
} from '../../state/little-vigilante.hooks';
import { GameAvatar } from '../molecules/game-avatar.component';
import { PlayerAvatar } from '../molecules/player-avatar.component';
import { ChatServiceContext } from './chat.context';
import { ChatState } from './chat.machine';

interface Props {
  disabled?: boolean;
}

export const Chat: FC<Props> = ({ disabled = false }) => {
  return (
    <Flex direction="column" css={{ width: '100%', minHeight: '100%' }}>
      <Box css={{ p: '$3' }}>
        <Caption>Chat</Caption>
      </Box>
      <ChatMessageList />
      <ChatInput disabled={!!disabled} />
    </Flex>
  );
};

/**
 * Selects the list of events and joins any messages that were successively sent from the same user.
 * @param state
 * @returns
 */
const selectEventsWithJoinedMessages = (state: ChatState) => {
  let runningText: string | undefined;

  const events = state.context.events;
  const result: LittleVigilanteServerEvent[] = [];

  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];
    if (event.type === 'MESSAGE') {
      const { userId, text } = event;
      const prevUserId = events[i - 1]?.userId;
      const hasPreviousMessage = prevUserId === userId;

      if (hasPreviousMessage) {
        if (runningText) {
          runningText = runningText + '\n' + text;
        } else {
          runningText = text;
        }
      } else if (!runningText) {
        result.push(event);
      } else {
        result.push({
          ...event,
          text: event.text + '\n' + runningText,
        });
        runningText = undefined;
      }
    } else {
      result.push(event);
    }
  }

  return result.reverse();

  // return state.context.events.reduce((acc, event) => {
  //   if (event.type === 'MESSAGE') {
  //     if (lastUserId === event.userId) {
  //       runningText = (runningText || '') + event.text + '\n';
  //     } else {
  //       if (runningText) {
  //         acc.push({
  //           type: 'MESSAGE',
  //           userId: event.userId,
  //           text: runningText,
  //           ts: event.ts,
  //         });
  //       }
  //       lastUserId = event.userId;
  //       runningText = event.text + '\n';
  //     }
  //   } else {
  //     acc.push(event);
  //   }
  //   return acc;
  // }, [] as LittleVigilanteServerEvent[]);
};

const ChatMessageList = () => {
  const scrollViewRef = useRef<HTMLDivElement | null>(null);
  const service = useContext(ChatServiceContext);
  // TODO consider a different way of joining events maybe so
  // server events dont stack their avatars
  const events = useSelector(service, selectEventsWithJoinedMessages);

  useEffect(() => {
    let isScrolled = false;
    const scrollView = scrollViewRef.current;
    if (!scrollView) {
      return;
    }

    const handleScroll = (e: Event) => {
      if (!scrollView) {
        return;
      }

      const { clientHeight, scrollTop, scrollHeight } = scrollView;

      if (clientHeight + scrollTop === scrollHeight) {
        isScrolled = false;
      } else {
        isScrolled = true;
      }
    };

    // Track if we are scrolled up or not
    // and only jump back to jump if we press
    scrollView.addEventListener('scroll', handleScroll);

    const sub = service.subscribe(() => {
      if (isScrolled) {
        return;
      }

      if (!scrollView) {
        return;
      }

      const { scrollHeight } = scrollView;

      if (!isScrolled) {
        setTimeout(() => {
          scrollView.scrollTo(0, scrollHeight);
        }, 0);
      }
    });

    return () => {
      sub.unsubscribe();
      scrollView?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollViewRef, service]);

  return (
    <Flex
      direction="column"
      gap="1"
      justify="end"
      css={{
        px: '$3',
        py: '$2',
        // minHeight: '100%',
        minHeight: '250px',
        background: '$primary3',
        flexGrow: 1,
        position: 'relative',
      }}
    >
      <Flex
        ref={scrollViewRef}
        direction="column"
        gap="1"
        css={{
          position: 'absolute',
          p: '$3',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          overflowX: 'none',
          overflowY: 'auto',
        }}
      >
        {events.map((event) => (
          <ChatEvent key={event.ts} event={event} />
        ))}
        <TypingIndicator />
        {/* Anchor from https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/ */}
        <Box css={{ overflowAnchor: 'auto !important', height: '1px' }} />
      </Flex>
    </Flex>
  );
};

const TypingIndicator = () => {
  const [currentlyTyping, setCurrentlyTyping] = useState<string[]>([]);
  const players = useLittleVigilanteSelector((state) => state.players);
  const typingUserRef = useRef<Partial<Record<string, number>>>({});

  const event$ = useLittleVigilanteEvent$();

  useSubscription(event$, ({ userId, ts, type }) => {
    if (type === 'MESSAGE') {
      delete typingUserRef.current[userId];
      setCurrentlyTyping(Object.keys(typingUserRef.current));
      return;
    }

    if (type !== 'TYPING') {
      return;
    }

    typingUserRef.current[userId] = ts;
    setCurrentlyTyping(Object.keys(typingUserRef.current));

    setTimeout(() => {
      if (typingUserRef.current[userId] === ts) {
        delete typingUserRef.current[userId];
        setCurrentlyTyping(Object.keys(typingUserRef.current));
      }
    }, 1200);
  });

  if (!currentlyTyping.length) {
    return null;
  }

  const typers = currentlyTyping.map((userId) => ({
    name: players[userId].name,
    color: colorBySlotNumber[players[userId].slotNumber],
  }));

  return (
    <Flex justify="center" align="center">
      <Caption>
        {typers.map(({ name, color }) => (
          <Badge variant={color}>{name}</Badge>
        ))}{' '}
        typing
      </Caption>
      {/* <Caption>{names.join(', ')} typing</Caption> */}
    </Flex>
  );
};

const ChatEvent: FC<{ event: LittleVigilanteServerEvent }> = ({ event }) => {
  switch (event.type) {
    case 'MESSAGE':
      return <Message event={event} />;
    case 'JOIN':
      return <JoinMessage event={event} />;
    case 'RESUME':
      return <ResumeMessage event={event} />;
    case 'PAUSE':
      return <PauseMessage event={event} />;
    case 'DISCONNECT':
      return <DisconnectMessage event={event} />;
    case 'TARGET_ROLE':
      return <PlayerTargetRoleMessage event={event} />;
    default:
      console.warn('missing component for message type: ' + event.type);
      return null;
  }
};

const Message: FC<{ event: ServerEvent<MessageCommand> }> = ({
  event: { text, userId },
}) => {
  const name = useLittleVigilanteSelector(
    (state) => state.players[userId]?.name
  );
  const slotNumber = useLittleVigilanteSelector(
    (state) => state.players[userId]?.slotNumber
  );
  const color = colorBySlotNumber[slotNumber];
  // const service = useContext(ChatServiceContext);
  // const isContinued = useSelector(service, (state) => state.context.events)

  return (
    <Flex align="start" gap="1" css={{ mb: '$1' }}>
      <PlayerAvatar userId={userId} color={color} />
      <Flex direction="column" gap="1">
        <Caption variant={color}>{name}</Caption>
        <Text css={{ whiteSpace: 'pre-wrap', lineHeight: '135%' }}>{text}</Text>
      </Flex>
    </Flex>
  );
};

const PauseMessage: FC<{ event: ServerEvent<PauseCommand> }> = ({ event }) => {
  const userId = event.userId;
  const name = useLittleVigilanteSelector(
    (state) => state.players[userId]?.name
  );
  const slotNumber = useLittleVigilanteSelector(
    (state) => state.players[userId]?.slotNumber
  );
  const color = colorBySlotNumber[slotNumber];

  return (
    <Flex align="center" gap="1">
      <GameAvatar />
      <Text>
        <Text variant={color} css={{ fontWeight: 'bold', display: 'inline' }}>
          {name}
        </Text>{' '}
        went idle. Game{' '}
        <Text variant="warning" css={{ display: 'inline', fontWeight: 'bold' }}>
          paused
        </Text>{' '}
        until all players are here.
      </Text>
    </Flex>
  );
};

const DisconnectMessage: FC<{ event: ServerEvent<DisconnectCommand> }> = ({
  event,
}) => {
  const userId = event.userId;
  const name = useLittleVigilanteSelector(
    (state) => state.players[userId]?.name
  );
  const slotNumber = useLittleVigilanteSelector(
    (state) => state.players[userId]?.slotNumber
  );
  const color = colorBySlotNumber[slotNumber];

  return (
    <Flex align="center" gap="1">
      <PlayerAvatar userId={userId} color={color} />
      <Text variant="low_contrast">
        <Text variant={color} css={{ fontWeight: 'bold', display: 'inline' }}>
          {name}
        </Text>{' '}
        disconnected.
      </Text>
    </Flex>
  );
};

const PlayerTargetRoleMessage: FC<{
  event: ServerEvent<LittleVigilanteTargetPlayerRoleCommand>;
}> = ({ event }) => {
  const { userId, targetedUserId } = event;
  const role = event.role as Role;
  const [name, targetedName, slotNumber, targetedSlotNumber] =
    useLittleVigilanteSelector((state) => [
      state.players[userId]?.name,
      state.players[targetedUserId]?.name,
      state.players[userId]?.slotNumber,
      state.players[targetedUserId]?.slotNumber,
    ]);
  const color = colorBySlotNumber[slotNumber];
  const targetedColor = colorBySlotNumber[targetedSlotNumber];
  const team = teamByRole[role];
  const teamColorMap = {
    magenta: 'crimson',
    cyan: 'cyan',
    gold: 'gold',
  } as const;
  const teamColor = teamColorMap[colorByTeam[team]];

  return (
    <Flex align="center" gap="1">
      <PlayerAvatar userId={userId} color={color} />
      <Text></Text>
      <Text>
        <Text variant={color} css={{ fontWeight: 'bold', display: 'inline' }}>
          {name}
        </Text>{' '}
        marked{' '}
        <Text
          variant={targetedColor}
          css={{ fontWeight: 'bold', display: 'inline' }}
        >
          {targetedName}
        </Text>{' '}
        as the{' '}
        <Text
          variant={teamColor}
          css={{ fontWeight: 'bold', display: 'inline' }}
        >
          {displayNameByRole[role]}
        </Text>
        .
      </Text>
    </Flex>
  );
};

const ResumeMessage: FC<{ event: ServerEvent<ResumeCommand> }> = ({
  event,
}) => {
  return (
    <Flex align="center" gap="1">
      <GameAvatar />
      <Text>
        <Text variant="lime" css={{ display: 'inline', fontWeight: 'bold' }}>
          Resuming
        </Text>{' '}
        All players back.
      </Text>
    </Flex>
  );
};

const JoinMessage: FC<{ event: ServerEvent<JoinCommand> }> = ({ event }) => {
  const userId = event.userId;
  const name = useLittleVigilanteSelector(
    (state) => state.players[userId]?.name
  );
  const slotNumber = useLittleVigilanteSelector(
    (state) => state.players[userId]?.slotNumber
  );
  const color = colorBySlotNumber[slotNumber];

  return (
    <Flex align="center" gap="1">
      <PlayerAvatar userId={userId} color={color} />{' '}
      <Text>
        <Text
          variant={color}
          style={{
            display: 'inline',
            fontWeight: 'bold',
          }}
        >
          {name}
        </Text>{' '}
        joined the game.
      </Text>
    </Flex>
  );
};

const selectSendingMessagesDisabled = (
  state: LittleVigilanteStateSerialized
) => {
  return state.currentStates.includes('Playing.Round.NightPhase');
};

const ChatInput: FC<{ disabled: boolean }> = ({ disabled }) => {
  const textRef = useRef<HTMLInputElement | null>(null);
  const send = useLittleVigilanteSend();
  const handleSubmit: FormEventHandler = useCallback(
    (e) => {
      const text = textRef.current?.value || '';
      e.preventDefault();
      if (text !== '') {
        send({ type: 'MESSAGE', text });

        // clear input
        if (textRef.current) {
          textRef.current.value = '';
        }
      }
    },
    [textRef, send]
  );

  const handleChange = useCallback(() => {
    send({ type: 'TYPING' });
  }, [send]);

  const handleFocus = useCallback(() => {
    // console.log('hi');
  }, []);

  return (
    <Flex direction="column" css={{ background: '$primary6' }}>
      {/* <ChatSuggestionsSlider /> */}
      <form onSubmit={handleSubmit}>
        <TextField
          disabled={disabled}
          ref={textRef}
          name="text"
          placeholder={!disabled ? 'Enter message' : 'Messages disabled'}
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </form>
    </Flex>
  );
};

const ChatSuggestionsSlider = () => {
  const suggestions = ['Hello', "What's up", "Hey ya'll"];

  return (
    <Flex direction="column" gap="1" css={{ p: '$1' }}>
      <Flex gap="1" justify="end">
        {suggestions.map((suggestion) => (
          <Badge variant="blue">{suggestion}</Badge>
        ))}
        <Badge>
          <DotsHorizontalIcon />
        </Badge>
      </Flex>
    </Flex>
  );
};
