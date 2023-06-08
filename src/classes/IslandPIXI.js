import * as PIXI from "pixi.js";
import { b64ToInt, intToB64 } from "./utility.js";
import { OutlineFilter } from "pixi-filters";
import {
  EmojiPeople,
  Hexagon,
  House,
  Park,
  Restaurant,
} from "@mui/icons-material";

PIXI.settings.MIPMAP_TEXTURES = PIXI.MIPMAP_MODES.OFF;

export const colorPalette = [
  "ff00ff",
  "060608",
  "301120",
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
/*
export const teamColorGradient =
  "linear-gradient(45deg, red 20%, yellow 20% 40%, green 40% 60%, cyan 60% 80%, blue 80%)";
*/
export const teamColorGradient =
  "linear-gradient(45deg, #df3e23 33%, #ffd541 33% 66%, #285cc4 66%)";

export const partPages = [
  {
    name: "Basic shapes",
    file: "img/shapes_basic.png",
    icon: <Hexagon></Hexagon>,
    count: 59,
  },
  {
    name: "Architecture",
    file: "img/shapes_architecture.png",
    icon: <House></House>,
    count: 20,
  },
  {
    name: "Nature",
    file: "img/shapes_nature.png",
    icon: <Park></Park>,
    count: 29,
  },
  {
    name: "Creatures",
    file: "img/shapes_creatures.png",
    icon: <EmojiPeople></EmojiPeople>,
    count: 16,
  },
  {
    name: "Items",
    file: "img/shapes_items.png",
    icon: <Restaurant></Restaurant>,
    count: 8,
  },
];

var renderer = PIXI.autoDetectRenderer();
var extract = new PIXI.Extract(renderer);

export class IslandPIXI {
  constructor(options) {
    this.app = new PIXI.Application(options);
    this.spriteTextures = [];
    this.spriteRenders = [];
    this.renders = [];
    let outline = 6;
    if (options.scale != null) {
      outline *= options.scale;
    }
    this.blackOutline = new OutlineFilter(outline, 0x000000, 0.3);
    this.blackOutline.padding = 12;
    this.loadAssets();
  }

  deserializeFullString(string) {
    if (string === undefined) {
      return [];
    }
    let data = [];
    let split = string.split(";");
    for (let i in split) {
      data.push(this.deserializeSingleSprite(split[i]));
    }
    return data;
  }

  deserializeSingleSprite(string) {
    let imageId = b64ToInt(string.substring(0, 2));
    let mirrored = false;
    if (imageId >= 2048) {
      // If most significative bit is on: mirrored
      mirrored = true;
      imageId -= 2048;
    }
    return {
      mirrored: mirrored,
      imageId: imageId,
      colorId: b64ToInt(string.substring(2, 3)),
      xPos: b64ToInt(string.substring(3, 4)),
      yPos: b64ToInt(string.substring(4, 5)),
      xScale: b64ToInt(string.substring(5, 6)),
      yScale: b64ToInt(string.substring(6, 7)),
      rotation: b64ToInt(string.substring(7, 8)),
    };
  }

  serializeSprite(graphicData) {
    let parts = [];
    for (let i in graphicData) {
      const part = graphicData[i];
      let imageIdMirrored = part.imageId;
      if (part.mirrored) {
        imageIdMirrored += 2048;
      }
      parts.push(
        intToB64(imageIdMirrored).padStart(2, "0") +
          intToB64(part.colorId) +
          intToB64(part.xPos) +
          intToB64(part.yPos) +
          intToB64(part.xScale) +
          intToB64(part.yScale) +
          intToB64(part.rotation)
      );
    }
    return parts.join(";");
  }

  transformImageString(string, options) {
    var imageArray = string.split(";");
    let parts = [];
    for (let i in imageArray) {
      let spriteData = this.deserializeSingleSprite(imageArray[i]);
      // Things with colorId 0 should be changed to have the color of their civ
      if (spriteData.colorId == 0 && options.primary_color != null) {
        spriteData.colorId = options.primary_color;
      }
      parts.push(spriteData);
    }
    return this.serializeSprite(parts);
  }

  orderContainer() {
    const container = new PIXI.Container();
    const sprite = new PIXI.Sprite(this.orderTexture);
    sprite.pivot.x = 64;
    sprite.pivot.y = 128;
    sprite.scale.x = 0.5;
    sprite.scale.y = 0.5;
    container.addChild(sprite);
    container.filters = [this.blackOutline];
    return container;
  }

  imageStringToContainer(string) {
    const container = new PIXI.Container();
    var imageArray = string.split(";");
    for (let i in imageArray) {
      const spriteData = this.deserializeSingleSprite(imageArray[i]);
      const sprite = new PIXI.Sprite(this.spriteTextures[spriteData.imageId]);
      sprite.pivot.x = 128;
      sprite.pivot.y = 128;
      sprite.tint = "0x" + colorPalette[spriteData.colorId];
      sprite.position.x = spriteData.xPos * 4;
      sprite.position.y = spriteData.yPos * 4;
      let mirror = 1;
      if (spriteData.mirrored) {
        mirror = -1;
      }
      sprite.scale.x =
        mirror * ((spriteData.xScale * spriteData.xScale) / 1600 + 0.02);
      sprite.scale.y = (spriteData.yScale * spriteData.yScale) / 1600 + 0.02;
      sprite.rotation = (spriteData.rotation / 180) * Math.PI * 7.5;
      container.addChild(sprite);
    }
    container.filters = [this.blackOutline];
    return container;
  }

  loadAssets() {
    if (this.loaded) return;

    this.loadMiscSprites();

    let fileList = [];
    for (let i in partPages) {
      fileList.push(partPages[i].file);
    }
    this.app.loader.add(fileList);
    this.app.loader.load((loader, resources) => {
      for (let i in partPages) {
        this.loadIndividualSprites(i);
      }
      this.loaded = true;
    });
    this.loaded = true;
  }

  renderHTMLImage(pixiObject, quality) {
    //const rect = pixiObject.getBounds();
    pixiObject.scale.x *= quality;
    pixiObject.scale.y *= quality;
    const renderTexture = PIXI.RenderTexture.create({
      width: 256 * quality,
      height: 256 * quality,
    });
    renderer.render(pixiObject, renderTexture);
    let render = extract.image(renderTexture);
    pixiObject.scale.x /= quality;
    pixiObject.scale.y /= quality;
    return render;
  }

  loadMiscSprites() {
    this.orderTexture = PIXI.Texture.from("img/order.png");
  }

  // Once assets are loaded
  loadIndividualSprites(pageId) {
    const imageSize = 256;
    const texture = this.app.loader.resources[partPages[pageId].file].texture;
    let images = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (images >= partPages[pageId].count) {
          return;
        }

        const rect = new PIXI.Rectangle(
          x * imageSize,
          y * imageSize,
          imageSize,
          imageSize
        );

        const newTexture = new PIXI.Texture(texture, rect);
        this.spriteTextures[pageId * 64 + images] = newTexture;

        // Render and save
        const sprite = new PIXI.Sprite(newTexture);
        this.spriteRenders[pageId * 64 + images] = this.renderHTMLImage(
          sprite,
          0.125
        );
        sprite.destroy();
        images++;
      }
    }
  }
}
