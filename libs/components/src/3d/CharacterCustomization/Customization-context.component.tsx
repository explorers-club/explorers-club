import { createContext, useContext, useState } from 'react';

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
  const [hairColor, setHairColor] = useState('');
  const [eyesColor, setEyesColor] = useState('');
  const [mouthColor, setMouthColor] = useState('');
  const [glassesColor, setGlassesColor] = useState('');
  const [skinColor, setSkinColor] = useState('');
  const [shirtColor, setShirtColor] = useState('');
  const [pantsColor, setPantsColor] = useState('');
  const [shoesColor, setShoesColor] = useState('');
  const [lacesColor, setLacesColor] = useState('');
  const [soleColor, setSoleColor] = useState('');
  const [morphTargetDictionary, setMorphTargetDictionary] = useState([]);
  const [morphTargetInfluences, setMorphTargetInfluences] = useState([]);
  return (
    <CharacterCustomizationContext.Provider
      value={{
        cameraMode,
        setCameraMode,
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
