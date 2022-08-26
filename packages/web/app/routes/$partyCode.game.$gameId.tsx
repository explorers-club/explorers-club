import { LoaderFunction, useLoaderData } from 'remix';
import { json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { supabaseAdmin } from '~/lib/supabase';

/** This is the route where we load the game machine */

interface PartyGame {
  code: string;
  gameId: string;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { gameId, partyCode } = params;
  invariant(partyCode, 'params.partyCode is required');
  invariant(gameId, 'params.gameId is required');

  return json<PartyGame>({ code: partyCode, gameId });
};

export default function PartyRoute(props: any) {
  const { gameId, code } = useLoaderData() as PartyGame;

  return (
    <div>
      <p>
        Hello {code} {gameId}
      </p>
    </div>
  );
}
