import { useSelector } from '@xstate/react';
import { FC } from 'react';
import { ModalActor } from './modal.machine';

interface Props {
  actor: ModalActor;
}

export const ModalComponent: FC<Props> = ({ actor }) => {
  const Component = useSelector(
    actor,
    (state) => state.context.activeComponent
  );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return Component ? <>{Component}</> : null;
};
