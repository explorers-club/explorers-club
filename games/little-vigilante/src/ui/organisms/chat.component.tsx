import { Badge } from '@atoms/Badge';
import { Box } from '@atoms/Box';
import { declareComponentKeys } from 'i18nifty';
import { Caption } from '@atoms/Caption';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { TextField } from '@atoms/TextField';
import {
  DisconnectCommand,
  isDiscussMessage,
  isNightPhaseBeginsMessage,
  isRoleAssignMessage,
  isTextMessage,
  isVoteMessage,
  isWinnersMessage,
  isYouLostMessage,
  isYouWonMessage,
  JoinCommand,
  LittleVigilanteCallVoteCommand,
  LittleVigilanteMessage,
  LittleVigilanteMessageCommand,
  LittleVigilanteStateSerialized,
  LittleVigilanteTargetPlayerRoleCommand,
  MessageCommand,
  PauseCommand,
  ResumeCommand,
  ServerEvent,
  ServerSenderSchema,
  TextMessageSchema,
  UserSenderSchema,
} from '@explorers-club/room';
import { colorBySlotNumber } from '@explorers-club/styles';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useSelector } from '@xstate/react';
import { deepEqual } from '@explorers-club/utils';
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
  useMyUserId,
} from '../../state/little-vigilante.hooks';
import { GameAvatar } from '../molecules/game-avatar.component';
import { PlayerAvatar } from '../molecules/player-avatar.component';
import { ChatServiceContext } from './chat.context';
import {
  ChatState,
  LittleVigilanteChatEvent,
  RoleAssignmentEvent,
} from './chat.machine';
import {
  DiscussMessage,
  NightPhaseBeginsMessage,
  RoleAssignMessage,
  VoteMessage,
  WinnersMessage,
  YouLostMessage,
  YouWonMessage,
} from '@explorers-club/chat';
import { useTranslation } from '../../i18n';
import { CalledVote } from './called-vote.component';

interface Props {
  disabled?: boolean;
}

export const Chat: FC<Props> = ({ disabled = false }) => {
  return (
    <Flex direction="column" css={{ width: '100%', minHeight: '100%' }}>
      <Flex css={{ p: '$3' }} justify="between">
        <Caption css={{ flexGrow: 1 }}>Chat</Caption>
        <CountdownTimer />
      </Flex>
      <ChatMessageList />
      <ChatInput disabled={!!disabled} />
    </Flex>
  );
};

const CountdownTimer = () => {
  const timeRemaining = useLittleVigilanteSelector(
    (state) => state.timeRemaining
  );
  const formattedTime = useLittleVigilanteSelector(selectFormattedTime);

  return timeRemaining ? (
    <Caption css={{ textAlign: 'center', color: 'white', fontFamily: '$mono' }}>
      {formattedTime}
    </Caption>
  ) : null;
};

const selectFormattedTime = (state: LittleVigilanteStateSerialized) =>
  formatTime(state.timeRemaining);

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

const ChatMessageList = () => {
  const scrollViewRef = useRef<HTMLDivElement | null>(null);
  const service = useContext(ChatServiceContext);
  // TODO consider a different way of joining events maybe so
  // server events dont stack their avatars
  const events = useSelector(service, (state) => state.context.events);

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
        // minHeight: '250px',
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
        {events.map((event, index) => (
          <ChatEvent key={event.ts} index={index} event={event} />
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

  useSubscription(event$, ({ sender, ts, type }) => {
    const result = UserSenderSchema.safeParse(sender);
    if (!result.success) {
      return;
    }
    const { userId } = result.data;
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

const ChatEvent: FC<{ event: LittleVigilanteChatEvent; index: number }> = ({
  event,
  index,
}) => {
  switch (event.type) {
    case 'MESSAGE':
      return <Message event={event} index={index} />;
    case 'JOIN':
      return <JoinMessage event={event} />;
    case 'RESUME':
      return <ResumeMessage event={event} />;
    case 'PAUSE':
      return <PauseMessage event={event} />;
    case 'DISCONNECT':
      return <DisconnectMessage event={event} />;
    case 'ROLE_ASSIGNMENT':
      return <RoleAssignmentMessage event={event} />;
    case 'TARGET_ROLE':
      return <PlayerTargetRoleMessage event={event} />;
    case 'CALL_VOTE':
      return <CalledVoteMessage event={event} />;
    default:
      console.warn('missing component for message type: ' + event.type);
      return null;
  }
};

const Message: FC<{
  event: ServerEvent<LittleVigilanteMessageCommand>;
  index: number;
}> = ({ event: { message, sender }, index }) => {
  const userId = UserSenderSchema.safeParse(sender).success
    ? UserSenderSchema.parse(sender).userId
    : null;
  const isPrivate = ServerSenderSchema.safeParse(sender).success
    ? ServerSenderSchema.parse(sender).isPrivate
    : null;
  const players = useLittleVigilanteSelector((state) => state.players);

  const service = useContext(ChatServiceContext);
  const events = useSelector(service, (state) => state.context.events);
  const prevEvent = events[index - 1];
  const isContinued = prevEvent && deepEqual(prevEvent.sender, sender);

  return (
    <Flex align="start" gap="1" css={{ mb: '$1' }}>
      <Box css={isContinued ? { height: '1px', opacity: 0 } : {}}>
        {userId ? (
          <PlayerAvatar
            userId={userId}
            color={colorBySlotNumber[players[userId].slotNumber]}
          />
        ) : (
          <GameAvatar />
        )}
      </Box>
      <Flex direction="column" gap="1">
        {!isContinued &&
          (userId ? (
            <Caption variant={colorBySlotNumber[players[userId].slotNumber]}>
              {players[userId].name}
            </Caption>
          ) : (
            <Caption>Game{isPrivate && ' • private'}</Caption>
          ))}
        <Text css={{ whiteSpace: 'pre-wrap', lineHeight: '135%' }}>
          <MessageComponent message={message} />
        </Text>
      </Flex>
    </Flex>
  );
};

const MessageComponent: FC<{ message: LittleVigilanteMessage }> = ({
  message,
}) => {
  const { t } = useTranslation({ MessageComponent });

  if (isTextMessage(message)) {
    return <Text>{message.text}</Text>;
  } else if (isVoteMessage(message)) {
    return <>{t(message)}</>;
  } else if (isNightPhaseBeginsMessage(message)) {
    return <>{t(message)}</>;
  } else if (isRoleAssignMessage(message)) {
    return <>{t(message.K, message.P)}</>;
  } else if (isDiscussMessage(message)) {
    return <>{t(message)}</>;
  } else if (isYouLostMessage(message)) {
    return <>{t(message)}</>;
  } else if (isYouWonMessage(message)) {
    return <>{t(message)}</>;
  } else if (isWinnersMessage(message)) {
    return <>{t(message.K, message.P)}</>;
  }

  console.warn("couldn't find translation for message", message);
  return null;
};

export const { i18n } = declareComponentKeys<
  | NightPhaseBeginsMessage
  | VoteMessage
  | RoleAssignMessage
  | DiscussMessage
  | (WinnersMessage & { R: JSX.Element })
  | YouWonMessage
  | YouLostMessage
>()({
  MessageComponent,
});

const PauseMessage: FC<{ event: ServerEvent<PauseCommand> }> = ({ event }) => {
  const { userId } = event;
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

const RoleAssignmentMessage: FC<{ event: RoleAssignmentEvent }> = ({
  event,
}) => {
  const userId = useMyUserId();
  // const { userId } = UserSenderSchema.parse(event.sender);
  const slotNumber = useLittleVigilanteSelector(
    (state) => state.players[userId]?.slotNumber
  );
  const color = colorBySlotNumber[slotNumber];

  return (
    <Flex align="center" gap="1">
      <PlayerAvatar userId={userId} color={color} />

      <Flex direction="column" gap={1}>
        <Caption>Private</Caption>
        <Text>
          You are the <strong>{displayNameByRole[event.role]}</strong>.
        </Text>
      </Flex>
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

const CalledVoteMessage: FC<{
  event: ServerEvent<LittleVigilanteCallVoteCommand>;
}> = ({ event }) => {
  const { sender, targetedUserId } = event;
  const { userId } = UserSenderSchema.parse(sender);
  const [name, targetedName, slotNumber, targetedSlotNumber] =
    useLittleVigilanteSelector((state) => [
      state.players[userId]?.name,
      state.players[targetedUserId]?.name,
      state.players[userId]?.slotNumber,
      state.players[targetedUserId]?.slotNumber,
    ]);
  const color = colorBySlotNumber[slotNumber];
  const targetedColor = colorBySlotNumber[targetedSlotNumber];

  return (
    <Flex align="center" gap="1">
      <PlayerAvatar size={2} userId={userId} color={color} />
      <Text>
        <Text variant={color} css={{ fontWeight: 'bold', display: 'inline' }}>
          {name}
        </Text>{' '}
        called a vote to identify{' '}
        <Text
          variant={targetedColor}
          css={{ fontWeight: 'bold', display: 'inline' }}
        >
          {targetedName}
        </Text>
        .
      </Text>
    </Flex>
  );
};

const PlayerTargetRoleMessage: FC<{
  event: ServerEvent<LittleVigilanteTargetPlayerRoleCommand>;
}> = ({ event }) => {
  const { sender, targetedUserId } = event;
  const { userId } = UserSenderSchema.parse(sender);
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
      <PlayerAvatar size={2} userId={userId} color={color} />
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

// const selectSendingMessagesDisabled = (
//   state: LittleVigilanteStateSerialized
// ) => {
//   return state.currentStates.includes('Playing.Round.NightPhase');
// };

const ChatInput: FC<{ disabled: boolean }> = ({ disabled }) => {
  const textRef = useRef<HTMLInputElement | null>(null);
  const send = useLittleVigilanteSend();
  const handleSubmit: FormEventHandler = useCallback(
    (e) => {
      const text = textRef.current?.value || '';
      e.preventDefault();
      if (text !== '') {
        send({ type: 'MESSAGE', message: { text } });

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
