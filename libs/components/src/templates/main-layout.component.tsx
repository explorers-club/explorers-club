import { FC, ReactElement } from 'react';
import { Caption } from '../atoms/Caption';
import { Flex } from '../atoms/Flex';
import { Heading } from '../atoms/Heading';
import { Sheet, SheetContent } from '../atoms/Sheet';
import { Text } from '../atoms/Text';

type SideSheetProps = {
  open: boolean;
  fullScreen: boolean;
};

interface Props {
  leftContent: ReactElement;
  rightContent: ReactElement;
}

export const MobileLayoutComponent: FC<Props> = ({
  leftContent,
  rightContent,
}) => {
  return (
    <Flex css={{ background: '$primary3', height: '100vh' }}>
      <Sheet open={true}>
        <SheetContent side="left">{leftContent}</SheetContent>
      </Sheet>
      <Sheet open={true}>
        <SheetContent side="right">
          <Heading>Header!</Heading>
          <Text>Right SHeet</Text>
          <Caption>My Caption</Caption>
        </SheetContent>
      </Sheet>
    </Flex>
  );
};
