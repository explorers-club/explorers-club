// https://replicate.com/stability-ai/stable-diffusion/api

// curl -s -X POST \
//   -d '{"version": "6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c", "input": {"prompt": "a photo of an astronaut riding a horse on mars"}}' \
//   -H "Authorization: Token $REPLICATE_API_TOKEN" \
//   -H 'Content-Type: application/json' \
//   "https://api.replicate.com/v1/predictions"
const STABLE_DIFFUSION_VERSION_ID =
  '6359a0cab3ca6e4d3320c33d79096161208e9024d174b2311e5a21b6c7e1131c';

const REPLICATE_API_TOKEN = process.env['REPLICATE_API_TOKEN'];

export const createPrediction = (prompt: string) =>
  fetch('https://api.replicate.com/v1/predictions', {
    headers: {
      Authorization: `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: STABLE_DIFFUSION_VERSION_ID,
      input: {
        text: prompt,
      },
    }),
  });
