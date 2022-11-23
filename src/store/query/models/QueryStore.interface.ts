import type { Readable } from "svelte/store";
import type { FeatureProp, Results, sketchTool, State } from "$models/index";

/**
 * @name QueryStoreActionsInterface
 * @description Represents the Query state actions
 */
export interface QueryStoreActionsInterface {
  /**
   * Creates sketch view model for drawing project location
   */
  createSketch(): void;
  /**
   * Creates esri search widget
   */
  createSearch(): __esri.widgetsSearch;
  /**
   * Removes graphic marker and label, any sketch features reset search widget
   */
  clearSearch(): void;
  query(): Promise<void>;
  /**
   * Creates label for target delineation location
   * @param {__esri.Graphic} graphic graphic for label
   */
  createLabel(graphic: __esri.Graphic): void;
  /**
   * Creates marker for target delineation location
   * @param {__esri.Graphic} graphic graphic for label
   */
  createMarker(graphic: __esri.Graphic): void;
  /**
   * Clears any sketch graphics
   */
  clearSketch(): void;
  /**
   * Create graphic marker and label from esri search widget complete
   * @param {__esri.SearchSearchCompleteEvent} searchResults esri search widget results
   */
  searchComplete(searchResults: __esri.SearchSearchCompleteEvent): void;
  draw(tool: sketchTool): void;
  createQuery(layer: __esri.FeatureLayer | __esri.MapImageLayer): __esri.Query;
  /**
   * Bundles other reset/clearing functions and removes and results
   */
  clear(): Promise<void>;
  exportPDF(): void;
  createFeaturePopup(graphic: __esri.Graphic): FeatureProp;
}

/**
 * @name QueryStoreGettersInterface
 * @description Interface represents our store getters
 * Getters will be used to consume the data from the store.
 */
export interface QueryStoreGettersInterface {
  state: Readable<State>;
  search: Readable<__esri.widgetsSearch>;
  results: Readable<Results[]>;
  target: Readable<__esri.Geometry>;
  sketchViewModel: Readable<__esri.SketchViewModel>;
}

/**
 * @name QueryStoreInterface
 * @description Interface represents our Query store module
 */
export interface QueryStoreInterface {
  actions: QueryStoreActionsInterface;
  getters: QueryStoreGettersInterface;
}
