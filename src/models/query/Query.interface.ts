export type PromiseResults = {
  featureSet: __esri.FeatureSet;
  title: string;
  id: string;
};

export type Results = {
  features: __esri.Graphic[];
  title: string;
};

export const LAYERTITLES = {
  rsbTrace: "Trace Results",
  rsb: "Regional Subbasins",
  landslide: "Landslides",
  resources: "Planning Resources",
  hcoc: "Exempted Hydrologic Condition of Concern (HCOC) areas",
  landUse: "Land Use",
  liquefaction: "Liquefaction",
  susceptibility: "Soil Susceptibility to Rill and Sheet Erosion (K Factor)",
  plume: "Groundwater Contaminent Plumes",
  depth: "Depth to First Groundwater (1980)",
  constraints: "Infiltration Constraints",
  coarseSed: "South OC Potential Coarse Sediment Area (June 2018)",
  soil: "Soil",
  slope: "Slope",
  iso: "Rainfall 85th Percentile",
  shallow: "Shallow Aquifer Elevation",
  principal: "Principal Aquifer Elevation",
  assessedLines: "Assessed Lines",
  assessedPolys: "Assessed Polygons",
  impairedLines: "Impaired Lines",
  impairedPolys: "Impaired Polygons",
  parcels: "Parcels",
};
