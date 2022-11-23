import type { Results, State } from "$models/index";

/**
 * @name QueryStateInterface
 * @description Represents the state of the query component
 */
export interface QueryStateInterface {
  state: State;
  search: __esri.widgetsSearch;
  results: Results[];
  target: __esri.Geometry;
  label: __esri.Graphic;
  sketchGraphics: __esri.GraphicsLayer;
  sketchViewModel: __esri.SketchViewModel;
  marker: __esri.Graphic;
}
