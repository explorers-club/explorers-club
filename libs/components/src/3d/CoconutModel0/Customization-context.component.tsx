import { createContext, useContext, useEffect, useState } from 'react';

type Props = {
  children?: JSX.Element | JSX.Element[];
};
const CharacterCustomizationContext = createContext({});

export const cameraModes = {
  FREE: 'FREE',
  HEAD: 'HEAD',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
};

export const CharacterCustomizationProvider = ({ children }: Props) => {
  const [cameraMode, setCameraMode] = useState(cameraModes.FREE);
  const [headColor, setHeadColor] = useState('');
  const [faceColor, setFaceColor] = useState('');
  const [eyesColor, setEyesColor] = useState('');
  const [eyeLidColor, setEyeLidColor] = useState('');
  const [eyebrowColor, setEyebrowColor] = useState('');
  const [armColor, setArmColor] = useState('');
  const [armbandColor, setArmbandColor] = useState('');
  const [handColor, sethandColor] = useState('');
  const [legsColor, setLegsColor] = useState('');
  const [legbandColor, setLegbandColor] = useState('');
  const [feetColor, setfeetColor] = useState('');

  const [morphTargetDictionary, setMorphTargetDictionary] = useState([]);
  const [morphTargetInfluences, setMorphTargetInfluences] = useState([]);
  return (
    <CharacterCustomizationContext.Provider
      value={{
        cameraMode,
        setCameraMode,
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
        setMorphTargetDictionary,
        morphTargetInfluences,
        setMorphTargetInfluences,
      }}
    >
      {children}
    </CharacterCustomizationContext.Provider>
  );
};

export const useCharacterCustomization = () => {
  return useContext(CharacterCustomizationContext);
};
