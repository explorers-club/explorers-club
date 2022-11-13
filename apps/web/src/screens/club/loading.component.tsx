import { ProgressBar } from '@explorers-club/components/molecules/ProgressBar';
import { Container } from './club.styles';

export const Loading = () => {
  return (
    <Container>
      <ProgressBar data-indeterminate={true} />
    </Container>
  );
};
