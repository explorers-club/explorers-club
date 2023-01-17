import { Box } from '@atoms/Box';
import { Button } from '@atoms/Button';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Grid } from '@atoms/Grid';
import { Select } from '@atoms/Select';
import { Text } from '@atoms/Text';
import { TextField } from '@atoms/TextField';
import { FC, FormEventHandler, useCallback, useRef } from 'react';
import type { LongPressEvent } from 'use-long-press';
import { useLongPress } from 'use-long-press';

interface Props {
  board: { word: string; guessedBy: string; belongsTo: string }[];
  tripWord: string;
  isClueGiver: boolean;
  myTeam: string;
  currentStates: string[];
  currentTeam: string;
  currentClue: string;
  currentClueCount: number;
  highlightsByWord: Record<string, string[]>;
  onEnterClue: (clue: string, numWords: number) => void;
  onPressWord: (word: string) => void;
  onLongPressWord: (word: string) => void;
}

export const PlayScreenComponent: FC<Props> = ({
  board,
  tripWord,
  isClueGiver,
  currentTeam,
  currentStates,
  currentClue,
  currentClueCount,
  highlightsByWord,
  myTeam,
  onLongPressWord,
  onPressWord,
  onEnterClue,
}) => {
  const waitingForClue = currentStates.includes('Playing.GivingClue');
  const isGuessing = currentStates.includes('Playing.Guessing');
  const givingClue = waitingForClue && isClueGiver && currentTeam === myTeam;
  const clueRef = useRef<HTMLInputElement>(null);
  const numWordsRef = useRef<HTMLSelectElement>(null);

  const handleSubmitClue: FormEventHandler = useCallback(
    (event) => {
      event.preventDefault();
      const clue = clueRef.current!.value;
      const numWords = parseInt(numWordsRef.current!.value);
      onEnterClue(clue, numWords);
    },
    [clueRef, numWordsRef, onEnterClue]
  );

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
        <Flex direction="column" gap="2">
          <Caption>Team {currentTeam}'s Turn</Caption>
          {waitingForClue && <Text>Waiting for clue</Text>}
          {isGuessing && (
            <Box>
              <Text>
                {currentClue} {currentClueCount}
              </Text>
            </Box>
          )}
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

              const highlights = highlightsByWord[word] || [];

              return (
                <Flex
                  data-word={word}
                  css={{
                    justifyContent: 'center',
                    alignItems: 'self-end',
                    background: cellColor,
                    aspectRatio: 1,
                    cursor: 'pointer',
                    position: 'relative',
                    pb: '$1',
                  }}
                  {...handlePressCell()}
                  key={word}
                >
                  <Text>{word}</Text>
                  {highlights.map((highlight, index) => (
                    <Text
                      size="1"
                      css={{ position: 'absolute', top: 11 * index, right: 0 }}
                      key={highlight}
                    >
                      {highlight}
                    </Text>
                  ))}
                </Flex>
              );
            })}
          </Grid>

          {givingClue && (
            <form onSubmit={handleSubmitClue}>
              <TextField
                ref={clueRef}
                type="text"
                id="clue"
                placeholder="Enter clue"
              />
              <Select ref={numWordsRef} defaultValue={1}>
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
              </Select>
              <Button type="submit">Submit</Button>
            </form>
          )}
        </Flex>
      </Card>
    </Box>
  );
};
