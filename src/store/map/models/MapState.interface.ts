import type { Results } from "$models/index";
/**
 * @name MapStateInterface
 * @description Represents the state of the map component
 */
export interface MapStateInterface {
  view: __esri.MapView;
  map: __esri.Map;
  queryLayers: (__esri.FeatureLayer | __esri.MapImageLayer)[];
  rsbLayer: __esri.FeatureLayer;
  rsbDsLayer: __esri.FeatureLayer;
  highlight: any;
  hitTestResults: Results[]
  // operationalLayers: (__esri.FeatureLayer | __esri.MapImageLayer)[];
}
