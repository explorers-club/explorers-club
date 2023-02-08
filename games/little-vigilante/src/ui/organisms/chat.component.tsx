import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { TextField } from '@atoms/TextField';
import {
  JoinCommand,
  LittleVigilanteServerEvent,
  MessageCommand,
  ServerEvent,
} from '@explorers-club/room';
import { colorBySlotNumber } from '@explorers-club/styles';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useInterpret, useSelector } from '@xstate/react';
import { declareComponentKeys } from 'i18nifty';
import { useSubscription } from 'observable-hooks';
import {
  FC,
  FormEventHandler,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { colorNameToPrimaryColor } from '../../meta/little-vigilante.constants';
import {
  useLittleVigilanteEvent$,
  useLittleVigilanteSelector,
  useLittleVigilanteSend,
} from '../../state/little-vigilante.hooks';
import { PlayerAvatar } from '../molecules/player-avatar.component';
import { ChatServiceContext } from './chat.context';
import { ChatState, createChatMachine } from './chat.machine';

export const Chat = () => {
  const events$ = useLittleVigilanteEvent$();
  const [machine] = useState(createChatMachine(events$));
  const service = useInterpret(machine);

  return (
    <Flex direction="column">
      <Box>
        <Flex
          gap="2"
          direction="column"
          css={{ background: '$primary1', pt: '$3' }}
        >
          <Box css={{ px: '$3' }}>
            <Caption>Chat</Caption>
          </Box>
          <ChatMessageList />
        </Flex>
      </Box>
      <ChatInput />
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
  const service = useContext(ChatServiceContext);
  const events = useSelector(service, selectEventsWithJoinedMessages);
  console.log(events);

  return (
    <Flex
      direction="column"
      gap="1"
      justify="end"
      css={{
        px: '$3',
        py: '$2',
        background: '$primary3',
        flexBasis: '300px',
        overflowX: 'none',
        overflow: 'auto',
        '*': {
          overflowAnchor: 'none',
        },
      }}
    >
      {events.map((event) => (
        <ChatEvent key={event.ts} event={event} />
      ))}
      <TypingIndicator />
      {/* Anchor from https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/ */}
      <Box css={{ overflowAnchor: 'auto', height: '1px' }} />
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
    <Flex align="center" gap="1" css={{ mb: '$1' }}>
      <PlayerAvatar userId={userId} color={color} />
      <Flex direction="column" gap="1">
        <Caption variant={color}>{name}</Caption>
        <Text css={{ whiteSpace: 'pre-wrap', lineHeight: '135%' }}>{text}</Text>
      </Flex>
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

const ChatInput = () => {
  const textRef = useRef<HTMLInputElement | null>(null);
  const send = useLittleVigilanteSend();
  const handleSubmit: FormEventHandler = useCallback((e) => {
    const text = textRef.current?.value || '';
    e.preventDefault();
    if (text !== '') {
      console.log('sending', text);
      send({ type: 'MESSAGE', text });

      // clear input
      if (textRef.current) {
        textRef.current.value = '';
      }
    }
  }, []);

  const handleChange = useCallback(() => {
    send({ type: 'TYPING' });
  }, [send]);

  const handleFocus = useCallback(() => {
    console.log('hi');
  }, []);

  return (
    <Flex direction="column" css={{ background: '$primary6' }}>
      {/* <ChatSuggestionsSlider /> */}
      <form onSubmit={handleSubmit}>
        <TextField
          ref={textRef}
          name="text"
          placeholder="Enter message"
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

export const { i18n } = declareComponentKeys<{
  K: 'greating';
}>()({ Chat });
