import { Sheet, SheetContent } from '@atoms/Sheet';
import { useInterpret, useSelector } from '@xstate/react';
import { FC, ReactElement, useContext, useMemo } from 'react';
import { Leaderboard } from './components/leaderboard.container';
import { Menu } from './components/menu.container';
import { Notifications } from './components/notifications.container';
import { MainContext } from './main.context';
import { MainActor, MainMachine, mainMachine } from './main.machine';
import { EnterNameScreen } from './screens/enter-name-screen.container';
import { GameScreen } from './screens/game-screen.container';

export const MainComponent = () => {
  const { sharedCollectionActor, userId } = useContext(MainContext);
  const machine = useMemo(() => {
    return mainMachine.withContext({
      sharedCollectionActor,
      userId,
    }) as MainMachine;
  }, [sharedCollectionActor, userId]);

  const actor = useInterpret(machine);

  return (
    <>
      <BottomSheet>
        <MainUIComponent actor={actor} />
      </BottomSheet>
      <LeftSheet>
        <Menu />
      </LeftSheet>
      <RightSheet>
        <Leaderboard />
      </RightSheet>
      <TopSheet>
        <Notifications />
      </TopSheet>
      <MainScene actor={actor} />
    </>
  );
};

interface MainUIProps {
  actor: MainActor;
}

const MainUIComponent: FC<MainUIProps> = ({ actor }) => {
  const state = useSelector(actor, (state) => state);

  switch (true) {
    case state.matches('EnteringName'): {
      return <EnterNameScreen />;
    }
    case state.matches('Playing'): {
      return <GameScreen />;
    }
    default: {
      return null;
    }
  }
};
interface MainSceneProps {
  actor: MainActor;
}

const MainScene: FC<MainSceneProps> = ({ actor }) => {
  const state = useSelector(actor, (state) => state);
  // TODO 3D scene goes here..
  return null;
};

interface BottomSheetProps {
  children: ReactElement;
}

const BottomSheet: FC<BottomSheetProps> = ({ children }) => {
  return (
    <Sheet open={true}>
      <SheetContent css={{ background: '$panel1' }} side="bottom">
        {children}
      </SheetContent>
    </Sheet>
  );
};

interface LeftSheetProps {
  children: ReactElement;
}

const LeftSheet: FC<LeftSheetProps> = ({ children }) => {
  return (
    <Sheet open={false}>
      <SheetContent css={{ background: '$panel1' }} side="left">
        {children}
      </SheetContent>
    </Sheet>
  );
};

interface RightSheetProps {
  children: ReactElement;
}

const RightSheet: FC<RightSheetProps> = ({ children }) => {
  return (
    <Sheet open={false}>
      <SheetContent css={{ background: '$panel1' }} side="right">
        {children}
      </SheetContent>
    </Sheet>
  );
};

interface TopSheetProps {
  children: ReactElement;
}

const TopSheet: FC<TopSheetProps> = ({ children }) => {
  return (
    <Sheet open={false}>
      <SheetContent css={{ background: '$panel1' }} side="top">
        {children}
      </SheetContent>
    </Sheet>
  );
};
