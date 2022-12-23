import { contentfulClient } from '@explorers-club/contentful';
import { useStoreSelector } from '@explorers-club/room';
import { useContext } from 'react';
import { useQuery } from 'react-query';
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import {
  IQuestion,
  IQuestionFields,
  IQuestionType,
  TriviaJamStateSerialized,
} from '../types';
import { unwrapFields } from '../utils';
import { TriviaJamContext } from './trivia-jam.context';
import { selectHostUserId } from './trivia-jam.selectors';

export const useMyUserId = () => {
  const { myUserId } = useContext(TriviaJamContext);
  return myUserId;
};

export const useIsHost = () => {
  const myUserId = useMyUserId();
  const hostUserId = useTriviaJamStoreSelector(selectHostUserId);
  return myUserId === hostUserId;
};

export const useSend = () => {
  const { store } = useContext(TriviaJamContext);
  return store.send;
};

export const useTriviaJamStoreSelector = <T>(
  selector: (state: TriviaJamStateSerialized) => T
) => {
  const { store } = useContext(TriviaJamContext);
  return useStoreSelector(store, selector);
};

export const useEntryQuery = <T>(entryId: string) => {
  return useQuery(`entry-${entryId}`, async () => {
    return await contentfulClient.getEntry<T>(entryId);
  });
};

export const useCurrentQuestionQuery = () => {
  const entryId = useTriviaJamStoreSelector(
    (state) => state.currentQuestionEntryId
  );
  return useEntryQuery<IQuestionFields>(entryId);
};

export const useCurrentQuestionFields = <T extends IQuestionFields>(
  expectedType: IQuestionType
): T | null => {
  const query = useCurrentQuestionQuery();

  const question = query.data;
  if (!question) {
    return null;
  }

  return unwrapFields<T>(question as IQuestion, expectedType);
};
