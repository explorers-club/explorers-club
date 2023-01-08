import { Button } from '@atoms/Button';
import { Overlay } from '@atoms/Overlay';
import { Html, Hud, OrthographicCamera } from '@react-three/drei';
import {
  cameraModes,
  useCharacterCustomization,
} from './character-customization.context';
import { Box } from '@atoms/Box';
import { useThree } from '@react-three/fiber';
import { cameraModeType, customizationStateTypes } from './character.types';
import { Fieldset } from '@atoms/Fieldset';
import { Input } from '@atoms/Input';
import { Label } from '@atoms/Label';
import { Text } from '@atoms/Text';
import { Heading } from '@atoms/Heading';
import { ControlGroup } from '@atoms/ControlGroup';
import { HeadConfigurator } from './Customization-Head.component';

export const Interface = () => {
  const {
    setCameraMode,
    cameraMode,
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
    shirtColor,
    setShirtColor,
    pantsColor,
    setPantsColor,
    shoesColor,
    setShoesColor,
    lacesColor,
    setLacesColor,
    soleColor,
    setSoleColor,
    morphTargetDictionary,
    morphTargetInfluences,
    setMorphTargetInfluences,
  } = useCharacterCustomization() as customizationStateTypes;

  const { size } = useThree();

  return (
    <>
      <Hud renderPriority={1}>
        <OrthographicCamera makeDefault position={[0, 0, 100]} />

        <Html position={[size.width / 2 - 20, size.height / 2 - 120, 0]}>
          <Overlay
            css={{
              position: 'absolute',
              right: '0',
              top: '0',
              width: '300px',
              height: '500px',
            }}
          >
            <ControlGroup css={{ mb: '$2' }}>
              {Object.keys(cameraModes as cameraModeType).map((mode) => (
                <Button key={mode} onClick={() => setCameraMode(mode)}>
                  {mode}
                </Button>
              ))}
            </ControlGroup>
            {/* {cameraMode === cameraModes.HEAD && <HeadConfigurator />} //The values passed down through context is not recieved by the components for some reason */}

            {cameraMode === cameraModes.HEAD && (
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
                {morphTargetDictionary.map(
                  (morphTarget: string, index: number) => (
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
                  )
                )}
              </Box>
            )}
            {cameraMode === cameraModes.TOP && (
              <Box>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Shirt</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={shirtColor}
                    onChange={(e) => setShirtColor(e.target.value)}
                  />
                </Fieldset>{' '}
              </Box>
            )}
            {cameraMode === cameraModes.BOTTOM && (
              <Box>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Pants</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={pantsColor}
                    onChange={(e) => setPantsColor(e.target.value)}
                  />
                </Fieldset>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Shoes</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={shoesColor}
                    onChange={(e) => setShoesColor(e.target.value)}
                  />
                </Fieldset>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Laces</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={lacesColor}
                    onChange={(e) => setLacesColor(e.target.value)}
                  />
                </Fieldset>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Sole</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={soleColor}
                    onChange={(e) => setSoleColor(e.target.value)}
                  />
                </Fieldset>
              </Box>
            )}
          </Overlay>
        </Html>
      </Hud>
    </>
  );
};
