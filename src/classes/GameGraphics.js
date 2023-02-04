import * as PIXI from "pixi.js";
import $ from "jquery";
import { IslandPIXI } from "./IslandPIXI.js";

var clicking = false;
var previousMousePos = { x: 0, y: 0 };
const outlineMultiplier = 6;

class Graphics {
  constructor(
    worldData,
    onLoad,
    onHover,
    onClick,
    onExit,
    onCameraPan,
    onCameraZoom
  ) {
    this.entityInstances = [];
    //this.entitySprites = {};
    this.instanceCounter = 0;
    this.renders = {};
    this.worldData = worldData;
    this.onLoad = onLoad;
    this.onHover = onHover;
    this.onClick = onClick;
    this.onExit = onExit;
    this.onCameraPan = onCameraPan;
    this.onCameraZoom = onCameraZoom;
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
      this.createAllGraphicsFromData(this.worldData);
      this.onLoad();
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
    for (var resource in worldData.resources) {
      this.renderHTMLFromString(worldData.resources[resource].img);
    }
    for (var idea in worldData.ideas) {
      this.renderHTMLFromString(worldData.ideas[idea].img);
    }

    const civilizations = worldData.civilizations;
    for (var civId in civilizations) {
      const civ = civilizations[civId];
      const state = civ.state;
      this.renderHTMLFromString(civ.img);
      const options = {
        primary_color: civ.primary_color,
      };

      // Load all entity graphics
      for (var entityBase in state.entities) {
        let entityList = state.entities[entityBase];
        for (var entityId in entityList) {
          let entity = entityList[entityId];
          const str = this.pixi.transformImgString(
            worldData.bases[entityBase].img,
            options
          );
          this.renderHTMLFromString(str);
          this.createEntityGraphics(worldData.bases[entityBase], entity, civId);
        }
      }

      // Load all graphics from bases that get unlocked by an idea
      for (var i in state.ideas) {
        const ideaId = state.ideas[i];
        const unlocks = worldData.ideas[ideaId].unlocks;
        for (var u in unlocks) {
          const unlockId = unlocks[u];
          const unlock = worldData.bases[unlockId];
          const str = this.pixi.transformImgString(unlock.img, options);
          this.renderHTMLFromString(str);
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

  createEntityGraphics(base, entity, civId) {
    const options = {
      primary_color: this.worldData.civilizations[civId].primary_color,
    };
    const str = this.pixi.transformImgString(base.img, options);
    const container = this.pixi.imgStringToContainer(str);

    container.position.set(entity.p[0] * 16, entity.p[1] * 16);
    container.zIndex = entity.y;
    container.pointer = this.instanceCounter;
    //this.entitySprites[entity] = container;
    //entity.pointer = this.instanceCounter;
    //entity.civ = civ;

    this.entityInstances[this.instanceCounter] = {
      graphic: container,
      base: base,
      entity: entity,
      civilization: civId,
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

    this.instanceCounter++;
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
      this.onCameraZoom();
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
      this.onCameraPan();
      let deltaX = event.clientX - previousMousePos.x;
      let deltaY = event.clientY - previousMousePos.y;
      gameView.position.x += deltaX;
      gameView.position.y += deltaY;
      previousMousePos = { x: event.clientX, y: event.clientY };
    }
  }

  mouseInsidePlayArea(mouseX) {
    const elem = $("#control-panel");
    return mouseX > elem.offset().left + elem.width() || 0;
  }
  /* #endregion */

  /* #region Sprite Event Handlers */

  // TODO: Interacción con los sprites
  handleSpriteMouseOver(ev) {
    const sprite = ev.target;
    const data = this.entityInstances[ev.target.pointer];
    this.onHover(data, ev.target.pointer);
  }

  handleSpriteMouseOut() {
    this.onExit();
  }

  handleSpriteClick(ev) {
    const sprite = ev.target;
    const data = this.entityInstances[ev.target.pointer];
    const bounds = sprite.getBounds();
    this.onClick(bounds, data, ev.target.pointer);
  }
  /* #endregion */
}

export default Graphics;
