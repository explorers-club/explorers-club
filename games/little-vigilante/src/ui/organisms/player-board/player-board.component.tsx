import { Avatar } from '@atoms/Avatar';
import { Button } from '@atoms/Button';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { colorBySlotNumber, styled } from '@explorers-club/styles';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useSelector } from '@xstate/react';
import {
  ComponentProps,
  createContext,
  FC,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
} from 'react';
import { useLittleVigilanteSelector } from '../../../state/little-vigilante.hooks';
import { PlayerCard, PlayerName } from '../../atoms/PlayerCard';
import { PlayerAvatar } from '../../molecules/player-avatar.component';
import { RoleAvatar } from '../../molecules/role-avatar.component';
import { PlayerBoardActor } from './player-board.hooks';

interface Props {
  actor: PlayerBoardActor;
  children: ReactNode;
}

export const PlayerBoardActorContext = createContext({} as PlayerBoardActor);

export const PlayerBoard: FC<Props> = ({ actor, children }) => {
  return (
    <PlayerBoardActorContext.Provider value={actor}>
      <Flex direction="row" wrap="wrap" css={{ gridGap: '$2' }}>
        {children}
      </Flex>
    </PlayerBoardActorContext.Provider>
  );
};

const PlayerBoardItemContext = createContext({} as { userId: string });

export function PlayerBoardItemRoot(props: {
  value: string;
  children: ReactNode;
}) {
  return (
    <PlayerBoardItemContext.Provider value={{ userId: props.value }}>
      {props.children}
    </PlayerBoardItemContext.Provider>
  );
}

// export const PlayerBoardItemTrigger = forwardRef<
//   any,
//   { asChild: true } | ComponentProps<typeof Button>
// >((props, ref) => {
//   const actor = useContext(PlayerBoardActorContext);
//   const { userId } = useContext(PlayerBoardItemContext);
//   const handlePress = useCallback(() => {
//     actor.send({ type: 'PRESS', key: userId });
//   }, [actor, userId]);
//   return <Button {...props} ref={ref} onClick={handlePress} />;
// });

// export const PlayerBoardItemCard = styled(Card, {
//   flexBasis: '50%',
// });

export const PlayerBoardItemCard = forwardRef<
  any,
  Omit<ComponentProps<typeof PlayerCard>, 'slotNumber'>
>(({ css, ...props }, ref) => {
  const { userId } = useContext(PlayerBoardItemContext);
  const player = useLittleVigilanteSelector((state) => state.players[userId]);
  const actor = useContext(PlayerBoardActorContext);
  const isActive = useSelector(actor, (state) =>
    state.context.active.includes(userId)
  );
  const isSelected = useSelector(actor, (state) =>
    state.context.selected.includes(userId)
  );
  const color = colorBySlotNumber[player.slotNumber];
  const selectedCSS = {
    filter: `drop-shadow(0px 4px 8px $colors$${color}10) drop-shadow(0px 4px 8px $colors$${color}9)`,
  };
  return (
    <PlayerCard
      slotNumber={player.slotNumber}
      variant="interactive"
      ref={ref}
      css={{
        ...css,
        borderRadius: '$2',
        // p: '$2',
        flexBasis: 'calc(50% - ($2 / 2))',
        opacity: isActive ? 1 : 0.2,
        // border: 0,
        border: `2px solid $${color}8`,
        boxSizing: 'border-box',
        background: `$${color}3`,
        ...(isSelected ? selectedCSS : {}),
      }}
      {...props}
    />
  );
});

// export function PlayerBoardItemContent(props: { children: ReactNode }) {
//   const { userId } = useContext(PlayerBoardItemContext);
//   const player = useLittleVigilanteSelector((state) => state.players[userId]);
// }

export function PlayerBoardItemAvatar(props: ComponentProps<typeof Avatar>) {
  const { userId } = useContext(PlayerBoardItemContext);
  const player = useLittleVigilanteSelector((state) => state.players[userId]);
  const actor = useContext(PlayerBoardActorContext);
  const revealedRole = useSelector(
    actor,
    (state) => state.context.revealedRoles[userId]
  );
  return revealedRole ? (
    <RoleAvatar {...props} roleType={revealedRole} />
  ) : (
    <PlayerAvatar
      {...props}
      userId={userId}
      color={colorBySlotNumber[player.slotNumber]}
    />
  );
}

export const PlayerBoardItemName: FC<ComponentProps<typeof Heading>> = (
  props
) => {
  const { userId } = useContext(PlayerBoardItemContext);
  const player = useLittleVigilanteSelector((state) => state.players[userId]);
  return (
    <PlayerName {...props} slotNumber={player.slotNumber}>
      {player.name}
    </PlayerName>
  );
};

// export const PlayerBoardItemContent: FC<ItemsProps> = ({
//   userId,
//   children,
// }) => {
//   const player = useLittleVigilanteSelector((state) => state.players[userId]);
//   const actor = useContext(PlayerBoardContext);
//   const { slotNumber } = player;
//   const inactive = useSelector(
//     actor,
//     (state) => !state.context.active.includes(userId)
//   );
//   return (
//     <Box css={{ flexBasis: '50%' }}>
//       <DropdownMenu.Root>
//         <DropdownMenu.Trigger asChild>
//           <Card
//             key={userId}
//             variant="interactive"
//             inactive={inactive}
//             css={{
//               flex: 1,
//               height: '64px',
//               position: 'relative',
//             }}
//           >
//             {children}
//             {/* <Box css={{ p: '$1' }}>
//               <Flex direction="column">
//                 <Heading
//                   css={{ fontSize: '$2' }}
//                   variant={colorBySlotNumber[slotNumber]}
//                 >
//                   {name}
//                 </Heading>
//               </Flex>
//               <Box css={{ position: 'absolute', top: 0, right: 0 }}>
//                 <PlayerAvatar
//                   size="4"
//                   userId={userId}
//                   color={colorBySlotNumber[slotNumber]}
//                 />
//               </Box>
//             </Box> */}
//           </Card>
//         </DropdownMenu.Trigger>
//         <DropdownMenu.Portal>
//           <PlayerMenuContent className="dark-theme">
//             {/* {renderPlayerMenu && renderPlayerMenu({ userId })} */}
//           </PlayerMenuContent>
//         </DropdownMenu.Portal>
//       </DropdownMenu.Root>
//     </Box>
//   );
// };

export const PlayerBoardDropdownContent = styled(DropdownMenu.Content, {
  minWidth: '100px',
  zIndex: 10,
  p: '$2',
});
