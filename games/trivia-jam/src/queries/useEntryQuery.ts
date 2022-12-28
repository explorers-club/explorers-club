import { contentfulClient } from '@explorers-club/contentful';
import { useQuery } from 'react-query';

export const useEntryQuery = <T>(entryId: string) => {
  return useQuery(`entry-${entryId}`, async () => {
    return await contentfulClient.getEntry<T>(entryId);
  });
};
