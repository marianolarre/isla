import * as PIXI from "pixi.js";
import { b64ToInt, intToB64 } from "./utility.js";
import { OutlineFilter } from "pixi-filters";

export const colorPalette = [
  "060608",
  "141013",
  "3b1725",
  "73172d",
  "b4202a",
  "df3e23",
  "fa6a0a",
  "f9a31b",
  "ffd541",
  "fffc40",
  "d6f264",
  "9cdb43",
  "59c135",
  "14a02e",
  "1a7a3e",
  "24523b",
  "122020",
  "143464",
  "285cc4",
  "249fde",
  "20d6c7",
  "a6fcdb",
  "ffffff",
  "fef3c0",
  "fad6b8",
  "f5a097",
  "e86a73",
  "bc4a9b",
  "793a80",
  "403353",
  "242234",
  "221c1a",
  "322b28",
  "71413b",
  "bb7547",
  "dba463",
  "f4d29c",
  "dae0ea",
  "b3b9d1",
  "8b93af",
  "6d758d",
  "4a5462",
  "333941",
  "422433",
  "5b3138",
  "8e5252",
  "ba756a",
  "e9b5a3",
  "e3e6ff",
  "b9bffb",
  "849be4",
  "588dbe",
  "477d85",
  "23674e",
  "328464",
  "5daf8d",
  "92dcba",
  "cdf7e2",
  "e4d2aa",
  "c7b08b",
  "a08662",
  "796755",
  "5a4e44",
  "423934",
];

var renderer = PIXI.autoDetectRenderer();
var extract = new PIXI.Extract(renderer);

export class IslandPIXI {
  constructor(options) {
    this.app = new PIXI.Application(options);
    this.spriteTextures = [];
    this.spriteRenders = [];
    let outline = 6;
    if (options.scale != null) {
      outline *= options.scale;
    }
    this.blackOutline = new OutlineFilter(outline, 0x000000, 0.3);
    this.blackOutline.padding = 10;
    this.loadAssets();
  }

  deserializeFullString(string) {
    let data = [];
    let split = string.split(";");
    for (let i in split) {
      data.push(this.deserializeSingleSprite(split[i]));
    }
    return data;
  }

  deserializeSingleSprite(string) {
    return {
      imageId: b64ToInt(string.substring(0, 1)),
      colorId: b64ToInt(string.substring(1, 2)),
      xPos: b64ToInt(string.substring(2, 3)),
      yPos: b64ToInt(string.substring(3, 4)),
      xScale: b64ToInt(string.substring(4, 5)),
      yScale: b64ToInt(string.substring(5, 6)),
      rotation: b64ToInt(string.substring(6, 7)),
      flags: b64ToInt(string.substring(7, 8)),
    };
  }

  serializeSprite(graphicData) {
    let parts = [];
    for (let i in graphicData) {
      const part = graphicData[i];
      parts.push(
        intToB64(part.imageId) +
          intToB64(part.colorId) +
          intToB64(part.xPos) +
          intToB64(part.yPos) +
          intToB64(part.xScale) +
          intToB64(part.yScale) +
          intToB64(part.rotation) +
          intToB64(part.flags)
      );
    }
    return parts.join(";");
  }

  imgStringToContainer(string) {
    const container = new PIXI.Container();
    var imgArray = string.split(";");
    for (let i in imgArray) {
      const spriteData = this.deserializeSingleSprite(imgArray[i]);
      const sprite = new PIXI.Sprite(this.spriteTextures[spriteData.imageId]);
      sprite.pivot.x = 128;
      sprite.pivot.y = 128;
      sprite.tint = "0x" + colorPalette[spriteData.colorId];
      sprite.position.x = spriteData.xPos * 4;
      sprite.position.y = spriteData.yPos * 4;
      sprite.scale.x = (spriteData.xScale * spriteData.xScale) / 1600 + 0.02;
      sprite.scale.y = (spriteData.yScale * spriteData.yScale) / 1600 + 0.02;
      sprite.rotation = (spriteData.rotation / 180) * Math.PI * 7.5;
      container.addChild(sprite);
    }
    container.filters = [this.blackOutline];
    return container;
  }

  loadAssets() {
    if (this.loaded) return;
    this.app.loader.add(["img/shapes.png"]);
    this.app.loader.load((loader, resources) => {
      this.loadedAssets();
    });
    this.loaded = true;
  }

  // Once assets are loaded
  loadedAssets() {
    const imageSize = 256;
    const texture = this.app.loader.resources["img/shapes.png"].texture;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const rect = new PIXI.Rectangle(
          x * imageSize,
          y * imageSize,
          imageSize,
          imageSize
        );

        const newTexture = new PIXI.Texture(texture, rect);
        this.spriteTextures.push(newTexture);

        // Render and save
        const sprite = new PIXI.Sprite(newTexture);
        const renderTexture = PIXI.RenderTexture.create(
          rect.width,
          rect.height
        );
        renderer.render(sprite, renderTexture);
        this.spriteRenders.push(extract.image(renderTexture));
        sprite.destroy();
      }
    }
    this.loaded = true;
  }
}
