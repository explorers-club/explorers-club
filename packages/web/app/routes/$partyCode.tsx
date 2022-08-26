import { LoaderFunction, useLoaderData } from 'remix';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { SupabaseClient } from '@supabase/supabase-js';

interface Party {
  code: string;
}

type LoaderData = { party: Party };

export const loader: LoaderFunction = async ({ params }) => {
  const { partyCode } = params;
  invariant(partyCode, 'params.partyCode is required');

  // TODO next; query via admin to see if the party code actually exists

  return json<LoaderData>({
    party: { code: partyCode },
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
