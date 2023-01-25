import { FC } from 'react';
import { CodebreakersConfig } from '@explorers-club/schema';
import { CodebreakersConfigurationScreenComponent } from './codebreakers-configuration-screen.component';

interface Props {
  initialConfig: CodebreakersConfig;
  onSubmitConfig: (config: CodebreakersConfig) => void;
}

export const CodebreakersConfigurationScreen: FC<Props> = () => {
  return <CodebreakersConfigurationScreenComponent />;
};
