import { Heading } from '@atoms/Heading';
import { ITextInputFields } from '@explorers-club/contentful-types';

export const TextInputReviewComponent = ({
  fields,
}: {
  fields: ITextInputFields;
}) => {
  return <Heading size="3">{fields.correctAnswer}</Heading>;
};
