import { Heading } from '@atoms/Heading';
import { ITrueOrFalseFields } from '@explorers-club/contentful-types';

export const TrueOrFalseReviewComponent = ({
  fields,
}: {
  fields: ITrueOrFalseFields;
}) => {
  return <Heading size="3">{fields.answer ? 'True' : 'False'}</Heading>;
};
