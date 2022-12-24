import { contentfulClient } from '@explorers-club/contentful';
import { IQuestionSetFields } from '@explorers-club/contentful-types';
import {
  TriviaJamConfigSerialized
} from '@explorers-club/room';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { TriviaJamConfigurationScreenComponent } from './trivia-jam-configuration-screen.component';

interface Props {
  initialConfig: TriviaJamConfigSerialized;
  onSubmitConfig: (config: TriviaJamConfigSerialized) => void;
}

export const TriviaJamConfigurationScreen: FC<Props> = ({
  initialConfig,
  onSubmitConfig,
}) => {
  const query = useQuestionSetEntriesQuery();

  if (!query.data) {
    return null;
  }

  return (
    <TriviaJamConfigurationScreenComponent
      questionSetEntries={query.data}
      initialConfig={initialConfig}
      onSubmitConfig={onSubmitConfig}
    />
  );
};

export const useQuestionSetEntriesQuery = () => {
  return useQuery(`question_set_entries`, async () => {
    const result = await contentfulClient.getEntries<IQuestionSetFields>({
      content_type: 'questionSet',
    });
    return result.items;
  });
};
