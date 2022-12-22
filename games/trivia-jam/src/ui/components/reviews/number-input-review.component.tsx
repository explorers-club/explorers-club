import { Heading } from '@atoms/Heading';
import { INumberInputFields } from '@explorers-club/contentful-types';

export const NumberInputReviewComponent = ({
  fields,
}: {
  fields: INumberInputFields;
}) => {
  return <Heading size="3">{fields.correctValue}</Heading>;
};
