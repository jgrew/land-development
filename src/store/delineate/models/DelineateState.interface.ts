import type { State } from "$models/index";

export interface DelineateStateInterface {
  state: State;
  sketchGraphics: __esri.GraphicsLayer;
  dsQuery: __esri.Query;
  rsbQuery: __esri.Query;
  rsbStore: __esri.FeatureLayer;
  result: __esri.Graphic;
  target: __esri.Geometry;
  model: __esri.SketchViewModel;
  label: __esri.Graphic;
}
