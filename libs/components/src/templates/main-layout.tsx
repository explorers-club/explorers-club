import { useContextBridge } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { FC, ReactElement, Suspense } from 'react';
import { Box } from '../atoms/Box';
import { Sheet, SheetContent } from '../atoms/Sheet';

interface SceneContainerProps {
  children: ReactElement;
  contexts: React.Context<unknown>[];
}

export const SceneContainer: FC<SceneContainerProps> = ({
  children,
  contexts,
}) => {
  // const state = useSelector(actor, (state) => state);
  const MainContextBridge = useContextBridge(...contexts);

  return (
    <Box css={{ background: '$primary1', height: '100vh' }}>
      <Canvas
        gl={{ physicallyCorrectLights: true }}
        camera={{ position: [0, 0, 1] }}
      >
        <color attach="background" args={['#000']} />
        <MainContextBridge>
          <Suspense fallback={null}>{children}</Suspense>
        </MainContextBridge>
      </Canvas>
    </Box>
  );
};

interface BottomSheetProps {
  children: ReactElement;
}

export const BottomSheet: FC<BottomSheetProps> = ({ children }) => {
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

export const LeftSheet: FC<LeftSheetProps> = ({ children }) => {
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

export const RightSheet: FC<RightSheetProps> = ({ children }) => {
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

export const TopSheet: FC<TopSheetProps> = ({ children }) => {
  return (
    <Sheet open={false}>
      <SheetContent css={{ background: '$panel1' }} side="top">
        {children}
      </SheetContent>
    </Sheet>
  );
};
