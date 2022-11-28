export type sketchTool =
  | "point"
  | "multipoint"
  | "polyline"
  | "polygon"
  | "rectangle"
  | "circle";

export type ViewOnImmediateClick = {
  mapPoint: __esri.Point;
  x: number;
  y: number;
  button: number;
  buttons: 0 | 1 | 2;
  type: "immediate-click";
  stopPropagation: Function;
  timestamp: number;
  native: Object;
};

export type ScreenPoint = {
    x: number,
    y: number
}