import type { State } from "$models/index";
import type { Readable } from "svelte/store";

/**
 * @name DelineateStoreActionsInterface
 * @description Represents the layout state actions
 */
export interface DelineateStoreActionsInterface {
  init(): void;
  draw(): void;
  clear(): void;
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
 * @description Interface represents Delineate store getters
 * Getters will be used to consume the data from the store.
 */
export interface DelineateStoreGettersInterface {
  state: Readable<State>;
  target: Readable<__esri.Geometry>;
  result: Readable<__esri.Graphic>;
  model: Readable<__esri.SketchViewModel>;
}

/**
 * @name DelineateStoreInterface
 * @description Interface represents our Delineate store module
 */
export interface DelineateStoreInterface {
  actions: DelineateStoreActionsInterface;
  getters: DelineateStoreGettersInterface;
}
