import { contentfulClient } from '@explorers-club/contentful';
import { IQuestionSetFields } from '@explorers-club/contentful-types';
import { TriviaJamConfig } from '@explorers-club/schema';
import { FC } from 'react';
import { useQuery } from 'react-query';
import { TriviaJamConfigurationScreenComponent } from './trivia-jam-configuration-screen.component';

interface Props {
  initialConfig: TriviaJamConfig;
  onSubmitConfig: (config: TriviaJamConfig) => void;
}

export const TriviaJamConfigurationScreen: FC<Props> = (props) => {
  const query = useQuestionSetEntriesQuery();

  if (!query.data) {
    return null;
  }

  return (
    <TriviaJamConfigurationScreenComponent
      questionSetEntries={query.data}
      {...props}
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
