import { Box } from '@atoms/Box';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Grid } from '@atoms/Grid';
import { useLongPress } from 'use-long-press';
import type { LongPressEvent } from 'use-long-press';
import { Text } from '@atoms/Text';
import { FC, useCallback } from 'react';

interface Props {
  board: { word: string; guessedBy: string; belongsTo: string }[];
  tripWord: string;
  isClueGiver: boolean;
  myTeam: string;
  onPressWord: (word: string) => void;
  onLongPressWord: (word: string) => void;
}

export const PlayScreenComponent: FC<Props> = ({
  board,
  tripWord,
  isClueGiver,
  myTeam,
  onLongPressWord,
  onPressWord,
}) => {
  const handleLongPress = useCallback(
    (event: LongPressEvent<Element>) => {
      // for some reason current target is null so walk up tree to find data
      let current = event.target as HTMLElement;
      let word: string | undefined;
      do {
        word = current?.dataset['word'];
        current = current?.parentElement as HTMLElement;
      } while (current && !word);

      word && onLongPressWord(word);
    },
    [onLongPressWord]
  );

  const handlePressCell = useLongPress(handleLongPress, {
    onCancel: (event) => {
      const current = event.currentTarget as HTMLElement;
      const word = current?.dataset['word'];

      word && onPressWord(word);
    },
  });

  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Grid
          css={{
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gridAutoRows: 'minmax(0, 1fr)',
            overflowY: 'auto',
            gap: '$1',
          }}
        >
          {board.map(({ word, belongsTo, guessedBy }) => {
            let cellColor = '$neutral6';

            if (word === tripWord && isClueGiver) {
              cellColor = '$netural3';
            }

            const otherTeam = myTeam === 'A' ? 'B' : 'A';
            if (belongsTo === myTeam) {
              if (guessedBy !== '') {
                cellColor = '$success9';
              } else if (isClueGiver) {
                cellColor = '$success4';
              }
            }

            if (belongsTo === otherTeam && guessedBy !== '') {
              cellColor = '$error9';
            }

            return (
              <Flex
                data-word={word}
                css={{
                  justifyContents: 'center',
                  alignItems: 'center',
                  background: cellColor,
                  aspectRatio: 1,
                  cursor: 'pointer',
                }}
                {...handlePressCell()}
                key={word}
              >
                <Text>{word}</Text>
              </Flex>
            );
          })}
        </Grid>
      </Card>
    </Box>
  );
};
