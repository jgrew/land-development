import type { State } from "$models/index";
import type { Readable } from "svelte/store";

/**
 * @name DelineateStoreActionsInterface
 * @description Represents the delineate component actions
 */
export interface DelineateStoreActionsInterface {
  /** Initializes component with needed feature layers and sketchviewmodel */
  init(): void;
  /** Starts scketch draw */
  draw(): void;
  /**
   * Resets the sketchviewmodel
   */
  clear(): void;
  /**
   * Intersects input location and returns traced feature
   */
  trace(): Promise<void>;
  /**
   * Creates label for target delineation location
   * @param {__esri.Graphic} graphic graphic for label
   */
  createLabel(graphic: __esri.Graphic): void;
  /**
   * Creates esri Feature for trace result
   */
  createFeature(): __esri.Feature;
}

/**
 * @name DelineateStoreGettersInterface
 * @description Interface represents delineate component store getters
 * Getters will be used to consume the data from the store.
 */
export interface DelineateStoreGettersInterface {
  /** Component state */
  state: Readable<State>;
  /** Input target for start of delineation */
  target: Readable<__esri.Geometry>;
  /** Trace result graphic */
  result: Readable<__esri.Graphic>;
  /** Sketch view model for drawing input trace location */
  model: Readable<__esri.SketchViewModel>;
}

/**
 * @name DelineateStoreInterface
 * @description Interface represents our delineate component store module
 */
export interface DelineateStoreInterface {
  actions: DelineateStoreActionsInterface;
  getters: DelineateStoreGettersInterface;
}
