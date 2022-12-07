import { FC } from 'react';
import { Flex } from '../atoms/Flex';
import { Sheet } from '../atoms/Sheet';

type SideSheetProps = {
  open: boolean;
  fullScreen: boolean;
};

interface Props {
  leftSheet: SideSheetProps;
  rightSheet: SideSheetProps;
}

export const BigScreenLayout: FC<Props> = ({ leftSheet, rightSheet }) => {
  return (
    <Flex css={{ background: '$primary3', height: '100vh' }}>
      {leftSheet.open && (
        <SheetContainer fullScreen={leftSheet.fullScreen}>
          Left SHeet
        </SheetContainer>
      )}
      {rightSheet.open && (
        <SheetContainer fullScreen={rightSheet.fullScreen}>
          Right SHeet
        </SheetContainer>
      )}
    </Flex>
  );
};

interface SheetContainerProps {
  fullScreen: boolean;
  children?: React.ReactNode;
}

const SheetContainer: FC<SheetContainerProps> = ({ children, fullScreen }) => (
  <Sheet>{children}</Sheet>
);
