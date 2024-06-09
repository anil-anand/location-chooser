import React, { useEffect, useMemo, useRef } from "react";
import { Engine, Scene } from "@babylonjs/core";
import {
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";

const Cuboid = ({ textureUrl, width, height }) => {
  const canvasRef = useRef(null);

  const maxAmongWidthAndHeight = useMemo(
    () => Math.max(width, height),
    [width, height]
  );

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      2 * maxAmongWidthAndHeight,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);

    new HemisphericLight("light", new Vector3(0, 1, 1), scene);

    const box = MeshBuilder.CreateBox(
      "box",
      {
        width: maxAmongWidthAndHeight,
        height: maxAmongWidthAndHeight,
        depth: maxAmongWidthAndHeight,
      },
      scene
    );

    const material = new StandardMaterial("material", scene);
    const texture = new Texture(textureUrl, scene);
    material.diffuseTexture = texture;
    box.material = material;

    engine.runRenderLoop(() => scene.render());

    return () => {
      engine.dispose();
    };
  }, [textureUrl, width, height]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "500px" }} />;
};

export default Cuboid;
