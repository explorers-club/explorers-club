import { memo } from 'react';
import { LoaderFunction, useLoaderData } from 'remix';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';

interface Party {
  code: string;
}

type LoaderData = { party: Party };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.partyCode, 'params.partyCode is required');

  return json<LoaderData>({
    party: { code: params.partyCode },
  });
};

export default function PartyRoute(props: any) {
  const { party } = useLoaderData() as LoaderData;

  return (
    <div>
      <p>Hello {party.code}</p>
    </div>
  );
}
