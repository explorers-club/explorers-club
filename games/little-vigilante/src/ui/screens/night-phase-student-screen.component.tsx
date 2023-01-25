import { Box } from '@atoms/Box';
import { Caption } from '@atoms/Caption';
import { Card } from '@atoms/Card';
import { Flex } from '@atoms/Flex';
import { Text } from '@atoms/Text';
import { FC } from 'react';

interface Props {
  otherStudents: string[];
}

export const NightPhaseStudentScreenComponent: FC<Props> = ({
  otherStudents,
}) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card css={{ p: '$3' }}>
        <Flex direction="column" gap="3">
          <Caption>Student</Caption>
          {otherStudents.length === 0 ? (
            <Text>You are the only student</Text>
          ) : (
            otherStudents.map((student) => (
              <Text>
                <strong>{student}</strong> is a student
              </Text>
            ))
          )}
        </Flex>
      </Card>
    </Box>
  );
};
