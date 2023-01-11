import { Box } from "@atoms/Box";
import { Card } from "@atoms/Card";
import { Flex } from "@atoms/Flex";
import { Heading } from "@atoms/Heading";
import { FC } from "react";

interface Props {
	role: string
}

export const AssigningRolesScreenComponent: FC<Props> = ({ role}) => {
  return (
    <Box css={{ p: '$3' }}>
      <Card>
        <Flex direction="column" css={{ p: '$3' }}>
          <Heading>Your role: {role}</Heading>
        </Flex>
      </Card>
    </Box>
  );
};
