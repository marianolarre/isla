import * as PIXI from "pixi.js";
import $ from "jquery";
import { IslandPIXI } from "./IslandPIXI.js";

var clicking = false;
var panning = true;
var panDistance = 0;
var previousMousePos = { x: 0, y: 0 };
const outlineMultiplier = 6;

const ENTITY = 1;
const ORDER = 2;

const NO_ACTION = 0;
const PLACING_ENTITY = 1;
const PLACING_ORDER = 2;

class Graphics {
  constructor(
    gameData,
    onLoad,
    onHover,
    onClick,
    onExit,
    onCameraPan,
    onCameraZoom,
    onPlaceGhost
  ) {
    this.entityInstances = [];
    this.instanceCounter = 0;
    this.orders = [];
    this.orderCounter = 0;
    this.renders = {};
    this.gameData = gameData;
    this.onLoad = onLoad;
    this.onHover = onHover;
    this.onClick = onClick;
    this.onExit = onExit;
    this.onCameraPan = onCameraPan;
    this.onCameraZoom = onCameraZoom;
    this.onPlaceGhost = onPlaceGhost;
    this.ghost = null;
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
      this.renderAllGraphicsFromData(this.gameData);
      this.createAllStateGraphics(this.gameData);
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

  setAction(action) {
    this.currentAction = action;
    if (action == PLACING_ORDER) {
      this.ghost = this.pixi.orderContainer();
      this.ghost.alpha = 0.75;
      this.entitiesView.addChild(this.ghost);
    }
  }

  deleteOrder(orderID) {
    this.orders[orderID].enabled = false;
    this.orders[orderID].graphic.visible = false;
  }

  renderAllGraphicsFromData(gameData) {
    // Load idea graphics
    /*for (var idea in gameData.ideas) {
      this.renderHTMLFromString(gameData.ideas[idea].image);
    }*/

    // Load civilization graphics
    const civilizations = gameData.civilizations;
    for (var civId in civilizations) {
      const civ = civilizations[civId];
      const state = civ.state;
      this.renderHTMLFromString(civ.flag_image);
      const options = {
        primary_color: civ.primary_color,
      };

      // Load graphics from bases that get unlocked by an idea
      /*for (var i in state.ideas) {
        const ideaId = state.ideas[i];
        const unlocks = gameData.ideas[ideaId].unlocks;
        for (var u in unlocks) {
          const unlockId = unlocks[u];
          const unlock = gameData.bases[unlockId];
          const str = this.pixi.transformImageString(unlock.image, options);
          this.renderHTMLFromString(str);
        }
      }*/

      // Load entity graphics
      for (var e in state.entities) {
        let entity = state.entities[e];
        const str = this.pixi.transformImageString(entity.image, options);
        this.renderHTMLFromString(str);
      }

      // Load resource graphics
      for (var resource in state.resources) {
        this.renderHTMLFromString(state.resources[resource].image);
      }
    }
  }

  renderHTMLFromString(graphicString) {
    if (this.renders[graphicString] == null) {
      const container = this.pixi.imageStringToContainer(graphicString);
      this.renders[graphicString] = this.pixi.renderHTMLImage(container, 0.5);
      container.destroy();
    }
  }

  createAllStateGraphics(gameData) {
    const civilizations = gameData.civilizations;
    for (var civId in civilizations) {
      const civ = civilizations[civId];
      const state = civ.state;
      this.renderHTMLFromString(civ.flag_image);
      const options = {
        primary_color: civ.primary_color,
      };

      for (var e in state.entities) {
        let entity = state.entities[e];
        const str = this.pixi.transformImageString(entity.image, options);
        this.createEntityGraphic(entity, civId);
      }

      for (var orderId in state.orders) {
        this.createOrderGraphic(state.orders[orderId], civId);
      }
    }
  }

  createEntityGraphic(entity, civId) {
    const options = {
      primary_color: this.gameData.civilizations[civId].primary_color,
    };
    const str = this.pixi.transformImageString(entity.image, options);
    const container = this.pixi.imageStringToContainer(str);

    container.position.set(entity.position.x * 16, entity.position.y * 16);
    container.zIndex = entity.position.y;
    container.pointer = this.instanceCounter;
    //this.entitySprites[entity] = container;
    //entity.pointer = this.instanceCounter;
    //entity.civ = civ;

    this.entityInstances[this.instanceCounter] = {
      graphic: container,
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

    container.calculateBounds();
    container.hitArea = new PIXI.Rectangle(
      0,
      0,
      container.getBounds().width * 12,
      container.getBounds().height * 12
    );
    this.instanceCounter++;
  }
  /* #endregion */

  createOrderGraphic(order, civId) {
    const container = this.pixi.orderContainer();
    container.position.set(order.position.x * 16, order.position.y * 16);
    container.zIndex = order.position.y;
    container.pointer = this.orderCounter;

    this.orders[this.orderCounter] = {
      graphic: container,
      civilization: civId,
      enabled: true,
      order: order,
    };

    container.interactive = true;
    container.buttonMode = true;
    container
      .on("pointerover", (ev) => {
        this.handleOrderMouseOver(ev);
      })
      .on("pointerout", (ev) => {
        this.handleOrderMouseOut(ev);
      })
      .on("click", (ev) => {
        this.handleOrderClick(ev);
      });

    this.entitiesView.addChild(container);

    this.orderCounter++;
  }

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
      clicking = true;
      panning = false;
      panDistance = 0;
      previousMousePos = { x: event.clientX, y: event.clientY };
      $("#sidebar-content").addClass("noselect");
    }
  }

  mouseUpHandler(event) {
    if (!panning) {
      if (this.currentAction == PLACING_ORDER) {
        this.onPlaceGhost(this.mouseToGamePos(event));
        this.ghost.destroy();
        this.ghost = null;
        this.currentAction = NO_ACTION;
      }
    }
    clicking = false;
    panning = false;
    $("#sidebar-content").removeClass("noselect");
  }

  mouseMoveHandler(event) {
    let deltaX = event.clientX - previousMousePos.x;
    let deltaY = event.clientY - previousMousePos.y;
    if (clicking) {
      this.cameraPan(event.clientX, event.clientY, deltaX, deltaY);
    } else {
      if (this.currentAction == PLACING_ORDER) {
        if (this.ghost != null) {
          const worldPos = this.mouseToWorldPos(event);
          this.ghost.position.x = worldPos.x;
          this.ghost.position.y = worldPos.y;
          this.ghost.zIndex = worldPos.y / 16;
        }
      }
    }
  }

  mouseToWorldPos(event) {
    const zoom = this.gameView.scale.x;
    return {
      x:
        Math.round((event.clientX - this.gameView.position.x) / zoom / 16) * 16,
      y:
        Math.round((event.clientY - this.gameView.position.y) / zoom / 16) * 16,
    };
  }

  mouseToGamePos(event) {
    const zoom = this.gameView.scale.x;
    return {
      x: Math.round((event.clientX - this.gameView.position.x) / zoom / 16),
      y: Math.round((event.clientY - this.gameView.position.y) / zoom / 16),
    };
  }

  cameraPan(clientX, clientY, deltaX, deltaY) {
    const { gameView } = this;
    panDistance += Math.abs(deltaX) + Math.abs(deltaY);
    if (panDistance > 30) {
      panning = true;
    }
    if (panning) {
      this.onCameraPan();
      gameView.position.x += deltaX;
      gameView.position.y += deltaY;
      previousMousePos = { x: clientX, y: clientY };
    }
  }

  mouseInsidePlayArea(mouseX) {
    const elem = $("#control-panel");
    return mouseX > elem.offset().left + elem.width() || 0;
  }
  /* #endregion */

  /* #region Sprite Event Handlers */
  handleSpriteMouseOver(ev) {
    /*const sprite = ev.target;
    const data = this.entityInstances[ev.target.pointer];
    this.onHover(data, ev.target.pointer);*/
    const sprite = ev.target;
    const data = this.entityInstances[ev.target.pointer];
    const bounds = sprite.getBounds();
    this.onHover(bounds, data, ev.target.pointer, ENTITY);
  }

  handleSpriteMouseOut() {
    this.onExit();
  }

  handleSpriteClick(ev) {
    if (panning) return;
    const sprite = ev.target;
    const data = this.entityInstances[ev.target.pointer];
    const bounds = sprite.getBounds();
    this.onClick(bounds, data, ev.target.pointer, ENTITY);
  }
  /* #endregion */

  /* #region Order Event Handlers */
  handleOrderMouseOver(ev) {
    const sprite = ev.target;
    const data = this.orders[ev.target.pointer];
    const bounds = sprite.getBounds();
    this.onHover(bounds, data, ev.target.pointer, ORDER);
  }

  handleOrderMouseOut() {
    this.onExit();
  }

  handleOrderClick(ev) {
    if (panning) return;
    const order = this.orders[ev.target.pointer];
    const bounds = ev.target.getBounds();
    this.onClick(bounds, order, ev.target.pointer, ORDER);
  }
  /* #endregion */
}

export default Graphics;
