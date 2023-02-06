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

export const Interface = () => {
  const {
    setCameraMode,
    cameraMode,
    headColor,
    setHeadColor,
    faceColor,
    setFaceColor,
    eyesColor,
    setEyesColor,
    eyeLidColor,
    setEyeLidColor,
    eyebrowColor,
    setEyebrowColor,
    armColor,
    setArmColor,
    armbandColor,
    setArmbandColor,
    handColor,
    sethandColor,
    legsColor,
    setLegsColor,
    legbandColor,
    setLegbandColor,
    feetColor,
    setfeetColor,
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
                  <Label css={{ color: '$primary1' }}>Head</Label>
                  {/* <Input type="range" min="0" max="11" /> */}
                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={headColor}
                    onChange={(e) => setHeadColor(e.target.value)}
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
                  <Label css={{ color: '$primary1' }}>Eyelid</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={eyeLidColor}
                    onChange={(e) => setEyeLidColor(e.target.value)}
                  />
                </Fieldset>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Eyebrows</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={eyebrowColor}
                    onChange={(e) => setEyebrowColor(e.target.value)}
                  />
                </Fieldset>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Face</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={faceColor}
                    onChange={(e) => setFaceColor(e.target.value)}
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
                  <Label css={{ color: '$primary1' }}>Arm</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={armColor}
                    onChange={(e) => setArmColor(e.target.value)}
                  />
                </Fieldset>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Arm Band</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={armbandColor}
                    onChange={(e) => setArmbandColor(e.target.value)}
                  />
                </Fieldset>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Hands</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={handColor}
                    onChange={(e) => sethandColor(e.target.value)}
                  />
                </Fieldset>
              </Box>
            )}
            {cameraMode === cameraModes.BOTTOM && (
              <Box>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Legs</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={legsColor}
                    onChange={(e) => setLegsColor(e.target.value)}
                  />
                </Fieldset>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Leg band</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={legbandColor}
                    onChange={(e) => setLegbandColor(e.target.value)}
                  />
                </Fieldset>
                <Fieldset>
                  <Label css={{ color: '$primary1' }}>Feet</Label>

                  <Input
                    type="color"
                    css={{ width: '30px' }}
                    value={feetColor}
                    onChange={(e) => setfeetColor(e.target.value)}
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
