/* eslint-disable jsx-a11y/aria-role */
import { FC } from 'react';
import { Flex } from '@atoms/Flex';
import { RoleAvatar } from './role-avatar.component';
import { Role } from '../../meta/little-vigilante.constants';

export default {
  component: RoleAvatar,
};

interface Props {
  role: Role;
}

export const Default = () => {
  return (
    <Flex direction="column" gap="1">
      <Row role="vigilante" />
      <Row role="sidekick" />
      <Row role="butler" />
      <Row role="cop" />
      <Row role="twin_girl" />
      <Row role="twin_boy" />
      <Row role="detective" />
      <Row role="snitch" />
      <Row role="con_artist" />
      <Row role="monk" />
      <Row role="mayor" />
      <Row role="anarchist" />
    </Flex>
  );
};

const Row: FC<Props> = ({ role }) => {
  return (
    <Flex
      css={{
        gap: '$1',
      }}
    >
      <RoleAvatar size="6" roleType={role} />
      <RoleAvatar size="6" roleType={role} />
      <RoleAvatar size="6" roleType={role} />
      <RoleAvatar size="6" roleType={role} />
      <RoleAvatar size="6" roleType={role} />
    </Flex>
  );
};
