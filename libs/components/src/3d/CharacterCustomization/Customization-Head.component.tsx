import { useCharacterCustomization } from './character-customization.context';
import { Box } from '@atoms/Box';

import { useEffect } from 'react';

import { customizationStateTypes } from './character.types';
import { Fieldset } from '@atoms/Fieldset';
import { Input } from '@atoms/Input';
import { Label } from '@atoms/Label';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';

export const HeadConfigurator = () => {
  const {
    hairColor,
    setHairColor,
    eyesColor,
    setEyesColor,
    mouthColor,
    setMouthColor,
    glassesColor,
    setGlassesColor,
    skinColor,
    setSkinColor,
    morphTargetDictionary,
    morphTargetInfluences,
    setMorphTargetInfluences,
  } = useCharacterCustomization() as customizationStateTypes;
  useEffect(() => {
    console.log(hairColor); // undefined
  }, []);

  return (
    <Box>
      <Heading color="$primary1">Face Customization</Heading>
      <Fieldset>
        <Label css={{ color: '$primary1' }}>Hair</Label>
        {/* <Input type="range" min="0" max="11" /> */}
        <Input
          type="color"
          css={{ width: '30px' }}
          value={hairColor}
          onChange={(e) => setHairColor(e.target.value)}
        />
      </Fieldset>
      <Fieldset>
        <Label css={{ color: '$primary1' }}>Eyes</Label>

        <Input
          type="color"
          css={{ width: '30px' }}
          value={eyesColor}
          onChange={(e) => setEyesColor(e.target.value)}
        />
      </Fieldset>
      <Fieldset>
        <Label css={{ color: '$primary1' }}>Mouth</Label>

        <Input
          type="color"
          css={{ width: '30px' }}
          value={mouthColor}
          onChange={(e) => setMouthColor(e.target.value)}
        />
      </Fieldset>
      <Fieldset>
        <Label css={{ color: '$primary1' }}>Glasses</Label>

        <Input
          type="color"
          css={{ width: '30px' }}
          value={glassesColor}
          onChange={(e) => setGlassesColor(e.target.value)}
        />
      </Fieldset>
      <Fieldset>
        <Label css={{ color: '$primary1' }}>Skin</Label>

        <Input
          type="color"
          css={{ width: '30px' }}
          value={skinColor}
          onChange={(e) => setSkinColor(e.target.value)}
        />
      </Fieldset>
      <Heading color="$primary1" css={{ mt: '$2' }}>
        Facial Expression
      </Heading>
      {morphTargetDictionary.map((morphTarget: string, index: number) => (
        <Fieldset key={index}>
          <Label css={{ color: '$primary1' }}>{morphTarget}</Label>

          <Input
            type="range"
            min="0"
            max="1"
            step={0.01}
            value={morphTargetInfluences[index]}
            onChange={(e) => {
              setMorphTargetInfluences((prev: any) => [
                ...prev.map((item: any, i: number) =>
                  i != index ? item : e.target.value
                ),
              ]);
            }}
          />
        </Fieldset>
      ))}
    </Box>
  );
};
