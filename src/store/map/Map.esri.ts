import ArcGISMap from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import { SimpleRenderer, UniqueValueRenderer } from "@arcgis/core/renderers";
import { SimpleFillSymbol, SimpleLineSymbol } from "@arcgis/core/symbols";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import ImageryLayer from "@arcgis/core/layers/ImageryLayer";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import Basemap from "@arcgis/core/Basemap";

const LAYERTITLES = {
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

const swGravityMainRenderer = new UniqueValueRenderer({
  field: "SurfaceWater",
  legendOptions: {
    title: "Type",
  },
  uniqueValueInfos: [
    {
      value: "1",
      label: "Open Conveyance",
      symbol: new SimpleLineSymbol({
        style: "dash",
        color: [252, 183, 6, 1],
      }),
    },
    {
      value: "2",
      label: "Closed Conveyance",
      symbol: new SimpleLineSymbol({
        color: [252, 183, 6, 1],
      }),
    },
  ],
});

const swChannelRenderer = new UniqueValueRenderer({
  field: "SurfaceWater",
  legendOptions: {
    title: "Type",
  },
  uniqueValueInfos: [
    {
      value: "1",
      label: "Open Conveyance",
      symbol: new SimpleLineSymbol({
        style: "dash",
        color: [51, 165, 250, 1],
      }),
    },
    {
      value: "2",
      label: "Closed Conveyance",
      symbol: new SimpleLineSymbol({
        color: [51, 165, 250, 1],
      }),
    },
  ],
});

// labels
const swChannelLabel = {
  symbol: {
    type: "text",
    color: "white",
    haloColor: "blue",
    haloSize: 1,
    font: {
      family: "Ubuntu Mono",
      size: 14,
      weight: "bold",
    },
  },
  labelPlacement: "center-along",
  labelExpressionInfo: {
    expression: "$feature.FACILITYNAME",
  },
  maxScale: 0,
  minScale: 25000000,
  where: "1=1",
};

// layers

const coarseSedLayer = new FeatureLayer({
  url: "https://services.arcgis.com/UXmFoWC7yDHcDN5Q/arcgis/rest/services/SOCPotentialCoarseSediment_Jun2018/FeatureServer",
  title: LAYERTITLES.coarseSed,
  visible: false,
  opacity: 0.25,
  minScale: 204800,
  maxScale: 162,
  renderer: new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      color: "#ff6219",
    }),
  }),
});

const hcocLayer = new FeatureLayer({
  portalItem: {
    id: "07df4e751eef40c3a784bd96a6dc87d0",
  },
  title: LAYERTITLES.hcoc,
  visible: false,
  opacity: 0.5,
  minScale: 204800,
  maxScale: 162,
  renderer: new UniqueValueRenderer({
    legendOptions: {
      title: "Designation",
    },
    valueExpression: `
        Decode($feature.Designation, "Not Exempt", 0, 1)
      `,
    uniqueValueInfos: [
      {
        value: 1,
        label: "Engineered Channels/Large River - Exempt",
        symbol: new SimpleFillSymbol({
          color: [255, 0, 0, 255],
        }),
      },
      {
        value: 0,
        label: "Non-Engineered Channels - Not Exempt",
        symbol: new SimpleFillSymbol({
          color: [56, 168, 0, 255],
        }),
      },
    ],
  }),
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.hcoc,
  }),
});

const resourcesLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 0,
  // url: 'https://services.arcgis.com/UXmFoWC7yDHcDN5Q/arcgis/rest/services/Land_Development_Resources/FeatureServer/0',
  title: LAYERTITLES.resources,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  popupEnabled: true,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: "{CITY}",
    // content: createResourcesPopup,
    lastEditInfoEnabled: false,
  }),
  // renderer: new SimpleRenderer({
  //   symbol: new SimpleFillSymbol({
  //     outline: { style: "none", width: 2, color: [205, 83, 1, 0] },
  //     color: [0, 0, 0, 0],
  //   }),
  // }),
});

export const rsbLayer = new FeatureLayer({
  portalItem: {
    id: "0d7651f1f79f4fd79839db3d04c18f3a",
  },
  layerId: 0,
  // url: 'https://www.ocgis.com/arcpub/rest/services/Environmental_Resources/RegionalSubbasins/FeatureServer',
  outFields: ["Watershed", "CatchIDN", "AreaAcre"],
  visible: false,
  minScale: 204800,
  maxScale: 162,
  renderer: new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      outline: { width: 2.5, color: [14, 33, 253, 0.97] },
      color: [0, 0, 0, 0],
    }),
  }),
  title: LAYERTITLES.rsb,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: "Regional Subbasin: {CatchIDN}",
    content: [
      new CustomContent({
        outFields: ["*"],
        // creator: (graphic: esri.Graphic): string => {
        //   const string = createRSBPopup(graphic);
        //   return string;
        // },
      }),
    ],
    lastEditInfoEnabled: false,
  }),
});

export const rsbDSLayer = new FeatureLayer({
  portalItem: {
    id: "f37d7323d6d54c8982287ee6e331dedf",
  },
  outFields: ["CatchIDN", "OBJECTID"],
  visible: false,
  opacity: 0.25,
  minScale: 204800,
  maxScale: 162,
  renderer: new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      // outline: { width: 2, color: [253, 39, 255, 1] },
      // color: [244, 113, 208, 0.25]
      // outline: { color: [18, 24, 255, 1] },
      // color: [49, 110, 216, 1],
      outline: { style: "none", width: 2.5, color: [14, 33, 253, 0.97] },
      color: [67, 19, 172, 0.99],
    }),
  }),
    title: LAYERTITLES.rsbTrace,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.rsbTrace,
    // content: createRSBTracePopup,
    lastEditInfoEnabled: false,
  }),
  listMode: "hide",
});

const soilRamp = [
  "#008c5e",
  "#75de43",
  "#52cc52",
  "#54994d",
  "#a3f9a0",
  "#70e0bb",
  "#00bfaf",
];

const soilLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 16,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.soil,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: "Soil",
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "hydgrpdcd",
            label: "Hydrologic Group - Dominant Condition",
          },
        ],
      },
    ],
  }),
  renderer: new UniqueValueRenderer({
    field: "hydgrpdcd",
    legendOptions: {
      title: "Hydrologic Group - Dominant Condition",
    },
    uniqueValueInfos: [
      {
        value: "A",
        label: "A",
        symbol: new SimpleFillSymbol({
          color: soilRamp[0],
        }),
      },
      {
        value: "A/D",
        label: "A/D",
        symbol: new SimpleFillSymbol({
          color: soilRamp[1],
        }),
      },
      {
        value: "B",
        label: "B",
        symbol: new SimpleFillSymbol({
          color: soilRamp[2],
        }),
      },
      {
        value: "B/D",
        label: "B/D",
        symbol: new SimpleFillSymbol({
          color: soilRamp[3],
        }),
      },
      {
        value: "C",
        label: "C",
        symbol: new SimpleFillSymbol({
          color: soilRamp[4],
        }),
      },
      {
        value: "C/D",
        label: "C/D",
        symbol: new SimpleFillSymbol({
          color: soilRamp[5],
        }),
      },
      {
        value: "D",
        label: "D",
        symbol: new SimpleFillSymbol({
          color: soilRamp[6],
        }),
      },
    ],
  }),
});

const slopeLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 19,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.slope,
  opacity: 0.25,
  renderer: new UniqueValueRenderer({
    field: "slope_pct",
    legendOptions: {
      title: "Slope",
    },
    uniqueValueInfos: [
      {
        value: 0,
        label: "0-5%",
        symbol: new SimpleFillSymbol({
          color: [255, 142, 51, 1],
        }),
      },
      {
        value: 5,
        label: "5-10%",
        symbol: new SimpleFillSymbol({
          color: [224, 89, 25, 1],
        }),
      },
      {
        value: 10,
        label: ">10%",
        symbol: new SimpleFillSymbol({
          color: [177, 38, 11, 1],
        }),
      },
    ],
  }),
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: "Slope",
    content: [
      new CustomContent({
        outFields: ["*"],
        // creator: (graphic: __esri.Graphic): string => {
        //   let slope = null;
        //   switch (graphic.attributes.slope_pct) {
        //     case 0:
        //       slope = "0-5%";
        //       break;
        //     case 5:
        //       slope = "5-10%";
        //       break;
        //     case 10:
        //       slope = ">10%";
        //       break;
        //     default:
        //       slope = null;
        //   }
        //   // let slope = event.graphic.attributes.slope_pct;
        //   let string = `<p>${slope}</p>`;
        //   return string;
        // },
      }),
    ],
  }),
});

const isoLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 9,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.iso,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.iso,
    content: [
      new CustomContent({
        outFields: ["*"],
        // creator: (graphic: __esri.Graphic): HTMLElement => {
        //   return createISOPopup(graphic);
        // },
      }),
    ],
    lastEditInfoEnabled: false,
  }),
});

const landslideLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 14,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.landslide,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.landslide,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Landslides",
            label: "Landslides",
          },
        ],
      },
    ],
  }),
});

const liquefactionLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 15,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.liquefaction,
  opacity: 0.5,
  renderer: new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      style: "backward-diagonal",
      outline: { width: 2, color: [1, 134, 4, 1] },
      color: [16, 15, 14, 1],
    }),
  }),
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.liquefaction,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "ID",
            label: "ID",
          },
        ],
      },
    ],
  }),
});

const susceptibilityLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 18,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.susceptibility,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.susceptibility,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "OBJECTID",
            label: "OBJECTID",
          },
          {
            fieldName: "AREASYMBOL",
            label: "AREASYMBOL",
          },
          {
            fieldName: "SPATIALVER",
            label: "SPATIALVER",
          },
          {
            fieldName: "MUSYM",
            label: "MUSYM",
          },
          {
            fieldName: "MUKEY",
            label: "MUKEY",
          },
          {
            fieldName: "KfactWS",
            label: "KfactWS",
          },
          {
            fieldName: "KFact",
            label: "KFact",
          },
        ],
      },
    ],
  }),
});

// const assessedLayer = new MapImageLayer({
//   url: "https://gispublic.waterboards.ca.gov/arcgis/rest/services/Water_Quality/Impaired_Waters_2014_2016/MapServer",
//   opacity: 0.5,
//   visible: false,
// });

// const tmdlPointLayer = new FeatureLayer({
//   portalItem: {
//     id: "bae4870036b544db8bcdf2c3852e9f55",
//   },
//   layerId: 2,
//   minScale: 204800,
//   maxScale: 162,
//   visible: true,
//   title: "TMDL Point",
//   opacity: 0.5,
// });

const tmdlLineLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 2,
  minScale: 204800,
  maxScale: 162,
  visible: true,
  title: LAYERTITLES.assessedLines,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: "{WBNAME}",
    // content: createImpairmentPopup,
    lastEditInfoEnabled: false,
  }),
});

const tmdlPolyLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 3,
  minScale: 204800,
  maxScale: 162,
  visible: true,
  title: LAYERTITLES.assessedPolys,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: "{WBNAME}",
    // content: createImpairmentPopup,
    lastEditInfoEnabled: false,
  }),
});

const tmdlLayer = new GroupLayer({
  layers: [tmdlLineLayer, tmdlPolyLayer],
  title: "2014/2016 All Assessed Waters",
  visible: false,
  minScale: 204800,
  maxScale: 162,
});

// const d303PointLayer = new FeatureLayer({
//   portalItem: {
//     id: "bae4870036b544db8bcdf2c3852e9f55",
//   },
//   layerId: 7,
//   minScale: 204800,
//   maxScale: 162,
//   visible: true,
//   title: "303d Point",
//   opacity: 0.5,
// });

const d303LineLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 5,
  minScale: 204800,
  maxScale: 162,
  visible: true,
  title: LAYERTITLES.impairedLines,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: "{WBNAME}",
    // content: createImpairmentPopup,
    lastEditInfoEnabled: false,
  }),
});

const d303PolyLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 6,
  minScale: 204800,
  maxScale: 162,
  visible: true,
  title: LAYERTITLES.impairedPolys,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: "{WBNAME}",
    // content: createImpairmentPopup,
    lastEditInfoEnabled: false,
  }),
});

const d303Layer = new GroupLayer({
  layers: [d303LineLayer, d303PolyLayer],
  title: "2014/2016 Impaired Waters (303(d) - listed)",
  visible: false,
  minScale: 204800,
  maxScale: 162,
});

// const landUseLayer = new FeatureLayer({
//   portalItem: {
//     id: "7705fd7d1e6644d98669d71268d877b0",
//   },
//   layerId: 20,
//   minScale: 204800,
//   maxScale: 162,
//   visible: false,
//   title: LAYERTITLES.landUse,
//   opacity: 0.5,
//   popupTemplate: new PopupTemplate({
//     outFields: ["*"],
//     title: LAYERTITLES.landUse,
//     content: [
//       {
//         type: "fields",
//         fieldInfos: [
//           {
//             fieldName: "LandUseGeneral",
//             label: "Land Use",
//           },
//         ],
//       },
//     ],
//   }),
// });

const constraintsLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 17,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.constraints,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.constraints,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Constraints",
            label: "Total Constraints",
          },
          {
            fieldName: "DSoils",
            label: "DSoils",
          },
          {
            fieldName: "DepthRange",
            label: "Depth Range",
          },
          {
            fieldName: "Plume",
            label: "Plume",
          },
          {
            fieldName: "d_D_Perc05",
            label: "d_D_Perc05",
          },
          {
            fieldName: "Physiograp",
            label: "Physiograpic",
          },
          {
            fieldName: "Susceptibility",
            label: "Susceptibility",
          },
          {
            fieldName: "Landslides",
            label: "Landslides",
          },
        ],
      },
    ],
  }),
});

const depthLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 10,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.depth,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.depth,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "DTW_FT",
            label: "Depth to Water (ft)",
          },
        ],
      },
    ],
  }),
});

const plumeLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 13,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.plume,
  opacity: 0.5,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.plume,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Plume",
            label: "Plume",
          },
        ],
      },
    ],
  }),
  renderer: new SimpleRenderer({
    symbol: new SimpleFillSymbol({
      style: "diagonal-cross",
      outline: { width: 2, color: [209, 111, 0, 1] },
      color: [205, 83, 1, 0.99],
    }),
  }),
});

const shallowAquiferLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 11,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.shallow,
  opacity: 0.5,
});

const principalAquiferLayer = new FeatureLayer({
  portalItem: {
    id: "7705fd7d1e6644d98669d71268d877b0",
  },
  layerId: 12,
  minScale: 204800,
  maxScale: 162,
  visible: false,
  title: LAYERTITLES.principal,
  opacity: 0.5,
});

const parcelLayer = new FeatureLayer({
  url: "https://ocgis.com/arcpub/rest/services/Map_Layers/Parcels/FeatureServer/0",
  title: LAYERTITLES.parcels,
  visible: false,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.parcels,
    content: [
      {
        type: "fields",
        fieldInfos: [
          {
            fieldName: "ASSESSMENT_NO",
            label: "APN",
          },
        ],
      },
    ],
  }),
});

const swInletLayer = new FeatureLayer({
  url: "https://ocgis.com/arcpub/rest/services/Flood/Stormwater_Network/FeatureServer/0",
  title: "Inlets",
});

const swDischargeLayer = new FeatureLayer({
  url: "https://ocgis.com/arcpub/rest/services/Flood/Stormwater_Network/FeatureServer/2",
  title: "Outlets",
});

const swManholeLayer = new FeatureLayer({
  url: "https://ocgis.com/arcpub/rest/services/Flood/Stormwater_Network/FeatureServer/3",
  title: "Manholes",
});

const swGravityMainLayer = new FeatureLayer({
  url: "https://ocgis.com/arcpub/rest/services/Flood/Stormwater_Network/FeatureServer/7",
  title: "Local Drainage",
  renderer: swGravityMainRenderer,
});

const swChannelLayer = new FeatureLayer({
  url: "https://ocgis.com/arcpub/rest/services/Flood/Stormwater_Network/FeatureServer/8",
  title: "Regional Channels",
  renderer: swChannelRenderer,
  // labelingInfo: swChannelLabel
});

const countyLayer = new FeatureLayer({
  portalItem: {
    id: "8967b67a80834095a7e7f2256b9efb70",
  },
  title: "Orange County Boundary",
});

const swLayer = new GroupLayer({
  // layers: [swChannelLayer, swGravityMainLayer, swManholeLayer, swDischargeLayer, swInletLayer],
  layers: [
    swChannelLayer,
    swGravityMainLayer,
    swInletLayer,
    swDischargeLayer,
    swManholeLayer,
  ],
  title: "Stormwater Network",
});

let contourLayer = new VectorTileLayer({
  portalItem: {
    id: "3187855dd6f243069469b109ef59515b",
  },
  title: "2020 2ft Contours",
  visible: false,
});

const rasColors = ["#78835f", "#a5b386", "#d0c8a0", "#eedebd", "#f7e9cc"];
const slopeRasLayer = new ImageryLayer({
  url: "https://www.ocgis.com/arcpub/rest/services/Environmental_Resources/slope_class/ImageServer",
  format: "jpgpng",
  visible: false,
  title: LAYERTITLES.slope,
  minScale: 204800,
  maxScale: 162,
  opacity: 0.5,
  popupEnabled: true,
  popupTemplate: new PopupTemplate({
    outFields: ["*"],
    title: LAYERTITLES.slope,
    content: [
      new CustomContent({
        outFields: ["*"],
        // creator: (graphic: __esri.Graphic): string => {
        //   let slope = null;
        //   switch (graphic.attributes.slope_pct) {
        //     case 0:
        //       slope = "0%";
        //       break;
        //     case 5:
        //       slope = "0-5%";
        //       break;
        //     case 10:
        //       slope = "5-10%";
        //       break;
        //     case 25:
        //       slope = "10-25%";
        //       break;
        //     case 90:
        //       slope = ">25%";
        //       break;
        //     default:
        //       slope = null;
        //   }
        //   // let slope = event.graphic.attributes.slope_pct;
        //   let string = `<p>${slope}</p>`;
        //   return string;
        // },
      }),
    ],
  }),
  renderer: new UniqueValueRenderer({
    field: "VALUE",
    legendOptions: {
      title: "Slope",
    },
    uniqueValueInfos: [
      {
        value: 0,
        label: "0%",
        symbol: new SimpleFillSymbol({
          color: rasColors[4],
        }),
      },
      {
        value: 5,
        label: "0-5%",
        symbol: new SimpleFillSymbol({
          color: rasColors[3],
        }),
      },
      {
        value: 10,
        label: "5-10%",
        symbol: new SimpleFillSymbol({
          color: rasColors[2],
        }),
      },
      {
        value: 25,
        label: "10-25%",
        symbol: new SimpleFillSymbol({
          color: rasColors[1],
        }),
      },
      {
        value: 90,
        label: ">25%",
        symbol: new SimpleFillSymbol({
          color: rasColors[0],
        }),
      },
    ],
  }),
});

const landUseLayer = new MapImageLayer({
  url: "https://www.ocgis.com/arcpub/rest/services/Environmental_Resources/Land_Development/MapServer",
  sublayers: [
    {
      id: 0,
      popupEnabled: true,
      popupTemplate: new PopupTemplate({
        outFields: ["*"],
        title: LAYERTITLES.landUse,
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "LSPC_LU_EDIT",
                label: "Land Use",
              },
            ],
          },
        ],
      }),
    },
  ],
  visible: false,
  minScale: 15000,
  maxScale: 162,
  title: LAYERTITLES.landUse,
  opacity: 0.5,
  listMode: "hide-children",
});

const basemap = new Basemap({
  baseLayers: [
    new VectorTileLayer({
      url: "https://jsapi.maps.arcgis.com/sharing/rest/content/items/806d8622ab1b4f7ca5409ffd5ea9e277/resources/styles/root.json",
      title: "Basemap",
    }),
  ],
  title: "basemap",
  id: "basemap",
});

export const queryLayers = [
  rsbLayer,
  landslideLayer,
  resourcesLayer,
  hcocLayer,
  landUseLayer,
  landslideLayer,
  liquefactionLayer,
  susceptibilityLayer,
  plumeLayer,
  depthLayer,
  constraintsLayer,
  coarseSedLayer,
  soilLayer,
  slopeLayer,
  isoLayer,
];

export const layers = [
  contourLayer,
  countyLayer,
  swLayer,
  slopeRasLayer,
  shallowAquiferLayer,
  principalAquiferLayer,
  landUseLayer,
  landslideLayer,
  liquefactionLayer,
  susceptibilityLayer,
  plumeLayer,
  depthLayer,
  hcocLayer,
  constraintsLayer,
  coarseSedLayer,
  soilLayer,
  isoLayer,
  rsbDSLayer,
  rsbLayer,
  d303Layer,
  tmdlLayer,
  resourcesLayer,
];

export const map = new ArcGISMap({
  basemap: basemap,
  layers: layers,
});
