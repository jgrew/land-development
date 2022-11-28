import type { Readable } from "svelte/store";
import type { Results } from "$models/index";

/**
 * @name MapStoreActionsInterface
 * @description Represents the map state actions
 */
export interface MapStoreActionsInterface {
  zoomToGraphic(graphic: __esri.Graphic): void;
  setView(view: __esri.MapView): Promise<void>;
  /**
   * Highlight a feature on the view, existing highlights will be replaced
   * @param {__esri.Graphic} feature Graphic to highlight
   * @param {string} targetLayer If provided, title of layer in map to target, otherwise layer taken from graphic
   */
  highlight(graphic: __esri.Graphic, layerId: string): void;
  setPadding(padding: __esri.ViewPadding): void;
  applyFilter(layer: __esri.FeatureLayer, query: __esri.Query): Promise<void>;
  clearHitTestResults(): void;
}

/**
 * @name MapStoreGettersInterface
 * @description Interface represents our store getters
 * Getters will be used to consume the data from the store.
 */
export interface MapStoreGettersInterface {
  view: Readable<__esri.MapView>;
  map: Readable<__esri.Map>;
  queryLayers: Readable<(__esri.FeatureLayer | __esri.MapImageLayer)[]>;
  rsbLayer: Readable<__esri.FeatureLayer>;
  rsbDsLayer: Readable<__esri.FeatureLayer>;
  hitTestResults: Readable<Results[]>;
  // operationalLayers: Readable<(__esri.FeatureLayer | __esri.MapImageLayer)[]>;
}

/**
 * @name MapStoreInterface
 * @description Interface represents our Map store module
 */
export interface MapStoreInterface {
  actions: MapStoreActionsInterface;
  getters: MapStoreGettersInterface;
}
