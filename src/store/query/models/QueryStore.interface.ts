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
  /** Queries the "operational layers" of interest to users */
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
   * Create graphic marker and label from esri search widget completion event
   * @param {__esri.SearchSearchCompleteEvent} searchResults esri search widget results
   */
  searchComplete(searchResults: __esri.SearchSearchCompleteEvent): void;
  /**
   * Initializes the components sketchviewmodel create workflow with the input tool
   * @param tool ESRI sketchviewmodel tool to use for drawing
   */
  draw(tool: sketchTool): void;
  /**
   * Creates a query dependent on the type of layer, e.g. FeatureLayer or MapImageLayer
   * @param layer input layer
   */
  createQuery(layer: __esri.FeatureLayer | __esri.MapImageLayer): __esri.Query;
  /**
   * Bundles other reset/clearing functions and removes and results
   */
  clear(): Promise<void>;
  /** Exports query results to a pdf */
  exportPDF(): void;
  /** Adjusts the graphic popupTemplate */
  createFeaturePopup(graphic: __esri.Graphic): FeatureProp;
}

/**
 * @name QueryStoreGettersInterface
 * @description Interface represents our store getters
 * Getters will be used to consume the data from the store.
 */
export interface QueryStoreGettersInterface {
  /** Component state */
  state: Readable<State>;
  /** ESRI search widget */
  search: Readable<__esri.widgetsSearch>;
  /** Query results */
  results: Readable<Results[]>;
  /** Input target for query */
  target: Readable<__esri.Geometry>;
  /** ESRI sketch view model */
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
