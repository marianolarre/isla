import * as PIXI from "pixi.js";
import $ from "jquery";
import { IslandPIXI } from "./IslandPIXI.js";

var clicking = false;
var previousMousePos = { x: 0, y: 0 };
var renderer = PIXI.autoDetectRenderer();
var extract = new PIXI.Extract(renderer);
const outlineMultiplier = 6;

class Graphics {
  constructor(game) {
    this.game = game;
    this.spritePointers = [];
    this.spritePointerCounter = 0;
    this.renders = {};
    // Initialize PIXI application and containers
    this.pixi = new IslandPIXI({
      width: window.innerWidth,
      height: window.innerHeight,
      autoResize: true,
    });

    this.canvas = document.body.appendChild(this.pixi.app.view);
    this.gameView = new PIXI.Container();
    this.backgroundView = new PIXI.Container();
    this.entitiesView = new PIXI.Container();
    this.entitiesView.sortableChildren = true;
    this.gameView.addChild(this.backgroundView);
    this.gameView.addChild(this.entitiesView);
    this.gameView.scale.set(0.1, 0.1);
    this.pixi.app.stage.addChild(this.gameView);

    this.pixi.blackOutline.thickness =
      this.gameView.scale.x * outlineMultiplier;

    // Tiling background
    const backgroundTexture = PIXI.Texture.from("img/background.png");
    const tilingSprite = new PIXI.TilingSprite(backgroundTexture, 32768, 32768);
    tilingSprite.tileScale.x = 2;
    tilingSprite.tileScale.y = 2;
    this.backgroundView.addChild(tilingSprite);

    // Load Assets
    this.pixi.app.loader.load((loader, resources) => {
      this.createAllGraphicsFromData(this.game.worldData);
    });
  }

  mount() {
    $(document).on("mousedown", (e) => {
      this.mouseDownHandler(e);
    });
    $(document).on("mouseup", (e) => {
      this.mouseUpHandler(e);
    });
    $(document).on("mousemove", (e) => {
      this.mouseMoveHandler(e);
    });
    $(document).on("mousewheel", (e) => {
      this.mouseWheelHandler(e);
    });
  }

  unmount() {
    document.body.removeChild(this.pixi.app.view);
    $(document).off();
  }
  /* #region  Sprite Creation */

  createAllGraphicsFromData(worldData) {
    const civilizations = worldData.civilizations;
    for (var resource in worldData.resources) {
      this.renderHTMLFromString(worldData.resources[resource].img);
    }
    for (var civId in civilizations) {
      const civ = civilizations[civId];
      const state = civ.state;
      this.renderHTMLFromString(civ.img);
      const options = {
        primary_color: civ.primary_color,
      };
      for (var entityBase in state.entities) {
        let entityList = state.entities[entityBase];
        for (var entityId in entityList) {
          let entity = entityList[entityId];
          const str = this.pixi.transformImgString(
            worldData.bases[entityBase].img,
            options
          );
          this.renderHTMLFromString(str);
          this.createEntityGraphics(worldData.bases[entityBase], entity, civ);
        }
      }
    }
  }

  renderHTMLFromString(graphicString) {
    if (this.renders[graphicString] == null) {
      const container = this.pixi.imgStringToContainer(graphicString);
      this.renders[graphicString] = this.pixi.renderHTMLImage(container, 0.25);
      container.destroy();
    }
  }

  createEntityGraphics(base, entity, civ) {
    const options = {
      primary_color: civ.primary_color,
    };
    const str = this.pixi.transformImgString(base.img, options);
    const container = this.pixi.imgStringToContainer(str);

    container.position.set(entity.p[0] * 16, entity.p[1] * 16);
    container.zIndex = entity.y;
    container.pointer = this.spritePointerCounter;
    entity.pointer = this.spritePointerCounter;
    //entity.civ = civ;
    this.spritePointers[this.spritePointerCounter] = {
      graphic: container,
      base: base,
      entity: entity,
      enabled: true,
    };

    container.interactive = true;
    container.buttonMode = true;
    container
      .on("pointerover", (ev) => {
        this.handleSpriteMouseOver(ev);
      })
      .on("pointerout", (ev) => {
        this.handleSpriteMouseOut(ev);
      })
      .on("click", (ev) => {
        this.handleSpriteClick(ev);
      });

    this.entitiesView.addChild(container);

    this.spritePointerCounter++;
  }
  /* #endregion */

  /* #region Mouse Event Handlers  */
  mouseWheelHandler(event) {
    if (this.mouseInsidePlayArea(event.clientX)) {
      const { gameView } = this;
      let zoom = gameView.scale.x;
      let mouseScroll = event.originalEvent.deltaY / 100;
      let newzoom = zoom * (1 - mouseScroll / 5);
      const minzoom = 0.05;
      const maxzoom = 2;
      if (newzoom < minzoom) {
        newzoom = minzoom;
      }
      if (newzoom > maxzoom) {
        newzoom = maxzoom;
      }
      gameView.scale.set(newzoom, newzoom);
      this.pixi.blackOutline.thickness = newzoom * outlineMultiplier;
      let deltaX = event.clientX - gameView.position.x;
      let deltaY = event.clientY - gameView.position.y;
      gameView.position.x = Math.floor(
        event.clientX - (deltaX * newzoom) / zoom
      );
      gameView.position.y = Math.floor(
        event.clientY - (deltaY * newzoom) / zoom
      );
    }
  }

  mouseDownHandler(event) {
    if (this.mouseInsidePlayArea(event.clientX)) {
      //dragged = false;
      clicking = true;
      previousMousePos = { x: event.clientX, y: event.clientY };
      $("#sidebar-content").addClass("noselect");
    }
  }

  mouseUpHandler(event) {
    clicking = false;
    $("#sidebar-content").removeClass("noselect");
  }

  mouseMoveHandler(event) {
    const { gameView } = this;
    if (clicking) {
      //dragged = true;
      let deltaX = event.clientX - previousMousePos.x;
      let deltaY = event.clientY - previousMousePos.y;
      gameView.position.x += deltaX;
      gameView.position.y += deltaY;
      previousMousePos = { x: event.clientX, y: event.clientY };
    }
  }

  mouseInsidePlayArea(mouseX) {
    return mouseX > $("#control-panel").outerWidth() || 0;
  }
  /* #endregion */

  /* #region Sprite Event Handlers */

  // TODO: Interacción con los sprites
  handleSpriteMouseOver(ev) {
    const sprite = ev.target;
    const data = this.spritePointers[ev.target.pointer];
  }

  handleSpriteMouseOut(ev) {}

  handleSpriteClick(ev) {
    //const sprite = ev.target;
    //const data = this.spritePointers[ev.target.pointer];
  }
  /* #endregion */
}

export default Graphics;
