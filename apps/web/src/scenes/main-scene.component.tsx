import FSpyDataManager, {
  defaultCameraParams,
} from '@3d/utils/FSpyDataManager';
import { Environment, OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useCallback, useLayoutEffect, useState } from 'react';
import { PerspectiveCamera, Vector2 } from 'three';
import { fspyCameraJson } from '../app/app.constants';
import { AppState } from '../state/app.machine';

export const MainScene = () => {
  return (
    <Canvas
      className="main-scene"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // background: 'green',
        backgroundImage: `url('${SCENE_URL}')`,
        backgroundSize: 'cover',
        backgroundPositionX: 'center',
        backgroundPositionY: 'center',
      }}
    >
      <axesHelper />
      <FSpyCamera />
      <Environment preset="sunset" />
      <OrbitControls />
      <gridHelper />
    </Canvas>
  );
};

const FSpyCamera = () => {
  const [targetCanvasSize] = useState(new Vector2());
  const [dataManager] = useState(() => {
    const dataManager = new FSpyDataManager();
    dataManager.setData(fspyCameraJson);
    return dataManager;
  });

  const three = useThree();

  const onResize = useCallback(() => {
    const camera = three.camera as unknown as PerspectiveCamera;
    const fSpyImageRatio: number = dataManager.imageRatio;

    targetCanvasSize.setX(three.size.width);
    targetCanvasSize.setY(three.size.height);

    if (targetCanvasSize.x / targetCanvasSize.y <= fSpyImageRatio) {
      camera.aspect = targetCanvasSize.x / targetCanvasSize.y;
      camera.zoom = defaultCameraParams.zoom;
    } else {
      camera.aspect = targetCanvasSize.x / targetCanvasSize.y;
      camera.zoom = targetCanvasSize.x / targetCanvasSize.y / fSpyImageRatio;
    }

    camera.updateProjectionMatrix();
  }, [dataManager, three, targetCanvasSize]);

  useLayoutEffect(() => {
    const camera = three.camera as unknown as PerspectiveCamera;

    // set fov
    camera.fov = dataManager.cameraFov;

    // set aspect
    // if (this.targetCanvasSize != null) {
    //   this.camera.aspect = this.targetCanvasSize.x / this.targetCanvasSize.y;
    // } else {
    //   this.camera.aspect = this.dataManager.imageRatio;
    // }
    camera.aspect = dataManager.imageRatio;

    // set position
    camera.position.set(
      dataManager.cameraPosition.x,
      dataManager.cameraPosition.y,
      dataManager.cameraPosition.z
    );

    camera.updateProjectionMatrix();

    // set rotation
    camera.setRotationFromMatrix(dataManager.cameraMatrix);

    onResize();
  }, [three, dataManager, onResize]);

  // if (
  //   this.targetCanvasSize.x / this.targetCanvasSize.y <=
  //   fSpyImageRatio
  // ) {
  //   this.camera.aspect =
  //     this.targetCanvasSize.x / this.targetCanvasSize.y;
  //   this.camera.zoom = defaultCameraParams.zoom;
  // } else {
  //   this.camera.aspect =
  //     this.targetCanvasSize.x / this.targetCanvasSize.y;
  //   this.camera.zoom =
  //     this.targetCanvasSize.x / this.targetCanvasSize.y / fSpyImageRatio;
  // }

  // this.onResize();

  return null;
};

const SCENE_URL =
  'https://media.discordapp.net/attachments/1039255735390978120/1082021840878321774/InspectorT_line_art_deck_of_an_outdoorsy_social_club_in_2023_ov_ed9d3f35-fc97-4202-ad03-214ca6ecd9db.png';

const selectNavIsOpen = (state: AppState) => state.matches('Navigation.Open');
