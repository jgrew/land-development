import * as SvelteStore from "svelte/store";
import type {
  QueryStateInterface,
  QueryStoreInterface,
  QueryStoreActionsInterface,
  QueryStoreGettersInterface,
} from "./models/index";
import type { sketchTool } from "$models/esri.interface";
import type { PromiseResults } from "$models/index";
import { LAYERTITLES } from "$models/index";
import {
  createRSBTracePopup,
  createISOPopup,
  createImpairmentPopup,
  createRSBPopup,
  createResourcesPopup,
} from "$lib/popupHelpers";
import { useMapStore } from "$store/map/Map.store";
import Search from "@arcgis/core/widgets/Search";
import CustomContent from "@arcgis/core/popup/content/CustomContent";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import { TextSymbol, SimpleMarkerSymbol } from "@arcgis/core/symbols";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Query from "@arcgis/core/rest/support/Query";
import PopupTemplate from "@arcgis/core/PopupTemplate";
import { jsPDF } from "jspdf";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);

const { view, queryLayers } = useMapStore().getters;

const writableQueryStore = SvelteStore.writable<QueryStateInterface>({
  state: "ready",
  results: null,
  search: null,
  target: null,
  label: null,
  sketchGraphics: null,
  sketchViewModel: null,
  marker: null,
});

export const useQueryStore = (): QueryStoreInterface => {
  const actions: QueryStoreActionsInterface = {
    createSketch: () => {
      console.log("QueryStore: action: createSketch");
      writableQueryStore.update((state) => {
        state.state = "loading";
        return state;
      });
      let sketchGraphics = new GraphicsLayer();
      sketchGraphics.listMode = "hide";
      let sketchViewModel = new SketchViewModel({
        layer: sketchGraphics,
        defaultUpdateOptions: {
          tool: "reshape",
          toggleToolOnClick: false,
        },
        view: SvelteStore.get(view),
        defaultCreateOptions: { hasZ: false },
        pointSymbol: new SimpleMarkerSymbol({
          color: [19, 237, 5, 1],
          style: "diamond",
        }),
      });

      sketchViewModel.on("create", (event) => {
        if (event.state === "complete") {
          let target = event.graphic;
          useQueryStore().actions.createLabel(target);
          useMapStore().actions.zoomToGraphic(target);
          writableQueryStore.update((state) => {
            state.target = target.geometry;
            return state;
          });
        }
      });

      sketchViewModel.on("update", (event) => {
        if (event.state === "complete") {
          let target = event.graphics[0].geometry;
          writableQueryStore.update((state) => {
            state.target = target;
            return state;
          });
        }
      });

      SvelteStore.get(view).map.add(sketchGraphics);

      writableQueryStore.update((state) => {
        state.state = "ready";
        state.sketchGraphics = sketchGraphics;
        state.sketchViewModel = sketchViewModel;
        return state;
      });
    },

    createSearch: () => {
      console.log("QueryStore: action: createSearch");
      const searchProperties: __esri.widgetsSearchProperties = {
        view: SvelteStore.get(view),
        resultGraphicEnabled: false,
        autoSelect: false,
        popupEnabled: false,
      };

      let search = new Search(searchProperties);

      search.viewModel.watch("state", (state) => {
        if (state === "ready") {
          search.on("search-complete", async (results) => {
            writableQueryStore.update((state) => {
              if (state.target) {
                useQueryStore().actions.clear();
              }
              return state;
            });
            useQueryStore().actions.searchComplete(results);
          });
        }
      });

      writableQueryStore.update((state) => {
        state.search = search;
        return state;
      });

      return search;
    },
    searchComplete: (searchResult) => {
      console.log("QueryStore: action: searchComplete");

      let feature: __esri.Graphic = null;
      searchResult.results.some((result) => {
        return result.results.some((sillyObject) => {
          if (sillyObject.feature) {
            feature = sillyObject.feature;
            return true;
          } else {
            return false;
          }
        });
      });

      if (
        feature.geometry &&
        feature.geometry.type &&
        feature.geometry.type === "polygon"
      ) {
        feature = new Graphic({
          geometry: feature.geometry.extent.center,
          attributes: feature.attributes,
        });
      }

      writableQueryStore.update((state) => {
        state.target = feature.geometry;
        return state;
      });

      useQueryStore().actions.createMarker(feature);
      useQueryStore().actions.createLabel(feature);
      useMapStore().actions.zoomToGraphic(feature);
    },
    clearSketch: () => {
      console.log("QueryStore: action: clearSketch");
      let mapView = SvelteStore.get(view);
      writableQueryStore.update((state) => {
        if (state.label) {
          mapView.graphics.remove(state.label);
        }
        if (state.marker) {
          mapView.graphics.remove(state.marker);
        }
        state.target = null;
        state.sketchViewModel.cancel();
        state.sketchGraphics.removeAll();
        return state;
      });
    },
    clearSearch: () => {
      console.log("QueryStore: action: clearSearch");
      SvelteStore.get(writableQueryStore).search.clear();
    },
    createLabel: (graphic: __esri.Graphic) => {
      console.log("QueryStore: action: createLabel", graphic);
      let mapView = SvelteStore.get(view);

      writableQueryStore.update((state) => {
        if (state.label) {
          mapView.graphics.remove(state.label);
        }
        return state;
      });

      const text = "Project Location";
      let label = new Graphic({
        geometry: graphic.geometry,
        symbol: new TextSymbol({
          text: text,
          haloColor: "#595959",
          haloSize: "1px",
          color: "white",
          horizontalAlignment: "center",
          yoffset: 4,
        }),
      });
      mapView.graphics.add(label);

      writableQueryStore.update((state) => {
        state.label = label;
        return state;
      });
    },
    createMarker: (graphic: __esri.Graphic) => {
      console.log("QueryStore: action: createMarker", graphic);
      let mapView = SvelteStore.get(view);

      writableQueryStore.update((state) => {
        if (state.marker) {
          mapView.graphics.remove(state.marker);
        }
        return state;
      });

      const text = "Project Location";
      let marker = new Graphic({
        geometry: graphic.geometry,
        symbol: new TextSymbol({
          text: text,
          haloColor: "#595959",
          haloSize: "1px",
          color: "white",
          horizontalAlignment: "center",
          yoffset: 4,
        }),
      });
      mapView.graphics.add(marker);

      writableQueryStore.update((state) => {
        state.marker = marker;
        return state;
      });
    },
    draw: (tool: sketchTool) => {
      console.log("QueryStore: action: draw");
      useQueryStore().actions.clear();
      SvelteStore.get(writableQueryStore).sketchViewModel.create(tool);
    },
    query: async () => {
      console.log("QueryStore: action: query");
      writableQueryStore.update((state) => {
        state.state = "loading";
        return state;
      });

      const promises = [];
      SvelteStore.get(queryLayers).forEach((queryLayer) => {
        if (!queryLayer || queryLayer.type !== "feature") {
          return Promise.resolve();
        }

        const query = useQueryStore().actions.createQuery(queryLayer);
        useMapStore().actions.applyFilter(queryLayer, query);

        if (queryLayer && typeof queryLayer["createQuery"] === "function") {
          promises.push(
            queryLayer.queryFeatures(query).then((results) => {
              return Promise.resolve({
                featureSet: results,
                title: queryLayer?.title,
                id: queryLayer?.id,
              });
            })
          );
        }
      });

      let results;
      try {
        results = await Promise.allSettled(promises);
      } catch (error) {
        console.error("QueryStore: action: query", error);
      }

      const isFulfilled = <T>(
        input: PromiseSettledResult<T>
      ): input is PromiseFulfilledResult<T> => input.status === "fulfilled";

      const fulfilled: PromiseFulfilledResult<PromiseResults>[] =
        results.filter(isFulfilled);

      let storeResults = [];
      if (fulfilled) {
        let mapView = SvelteStore.get(view);
        fulfilled.forEach((result) => {
          const data = result.value;
          if (
            data?.featureSet.features &&
            data.featureSet.features?.length &&
            data.featureSet.features.length > 0
          ) {
            let id = data?.id;
            let title = data?.title;

            mapView.map.findLayerById(id).visible = true;

            storeResults.push({
              title: title,
              features: data.featureSet.features,
            });
          }
        });
      }
      // console.log(storeResults)
      writableQueryStore.update((state) => {
        state.state = "ready";
        state.results = storeResults;
        return state;
      });
    },
    createQuery: (layer: __esri.FeatureLayer | __esri.MapImageLayer) => {
      console.log("QueryStore: action: createQuery");
      const geometry = SvelteStore.get(writableQueryStore).target;
      let layerSwitch = null;
      switch (layer.type) {
        case "map-image":
          layerSwitch = (<__esri.MapImageLayer>layer).findSublayerById(0);
          break;
        default:
          layerSwitch = layer;
          break;
      }

      const query =
        layerSwitch && typeof layerSwitch["createQuery"] === "function"
          ? (<__esri.FeatureLayer>layerSwitch).createQuery()
          : new Query();

      query.geometry = geometry;
      return query;
    },
    clear: async () => {
      console.log("QueryStore: action: clear");
      useQueryStore().actions.clearSearch();
      useQueryStore().actions.clearSketch();

      let mapView = SvelteStore.get(view);
      let promises = [];
      let results = SvelteStore.get(writableQueryStore).results;

      if (results) {
        results.forEach((result) => {
          const matchLayer = mapView.map.allLayers.find((mapLayer) => {
            return mapLayer.title === result.title;
          });

          matchLayer.visible = false;
          promises.push(mapView.whenLayerView(matchLayer));
        });

        const promiseResult: __esri.FeatureLayerView[] = await Promise.all(
          promises
        );

        if (promiseResult) {
          promiseResult.forEach((layerView) => {
            layerView.filter = null;
          });
        }
      }

      writableQueryStore.update((state) => {
        state.results = null;
        return state;
      });
    },
    exportPDF: () => {
      const pdf = new jsPDF("l");
      const pdfTitle = `Orange County Land Development Resources`;

      pdf.text(pdfTitle, 14, 20);
      let yPosition: number = 35;

      SvelteStore.get(writableQueryStore).results.forEach((result) => {
        const layerTitle = `Layer: ${result.title}`;
        pdf.setFontSize(12);
        pdf.text(layerTitle, 20, yPosition);
        const tableBody: any[] = [];
        const layer = result.features[0].layer as __esri.FeatureLayer;

        const tableHeadValues = layer.fields
          .map((field: __esri.Field) => {
            return ![
              "LastEditor",
              "LastUpdate",
              "CreatedUser",
              "CreatedDate",
              "Shape__Area",
              "Shape__Length",
              "link1",
              "link2",
              "link3",
              "link4",
              "link5",
              "link6",
              "OBJECTID_1",
              "rb",
              "rb_name",
            ].includes(field.name)
              ? field.name
              : null;
          })
          .filter(Boolean)
          .reduce((acc, current) => ((acc[current] = current), acc), {});

        const tableHead = [tableHeadValues];

        result.features.forEach((feature: __esri.Graphic) => {
          // console.log(feature);
          // const layer = feature.layer as esri.FeatureLayer;
          const attributes = feature.attributes;
          const tableRow = {};

          let columns = tableHead[0];

          if (result.title === "Planning Resources") {
            columns = {
              ...columns,
              ...["link1", "link2", "link3", "link4", "link5", "link6"].reduce(
                (acc, current) => ((acc[current] = current), acc),
                {}
              ),
            };
          }

          Object.keys(columns).forEach((key) => {
            if (attributes.hasOwnProperty(key)) {
              tableRow[key] = attributes[key];
              // console.log(key, attributes[key]);
            }
          });

          tableBody.push(tableRow);
        });

        const columns = Object.keys(tableHead[0]).map((key) => {
          return { header: key, dataKey: key };
        });

        // console.log(tableHead, tableBody, columns);
        // const preTableY = Math.ceil((pdf as any).lastAutoTable.finalY);

        yPosition = yPosition + 2;

        if (result.title === "Planning Resources") {
          // console.log(layerTitle);

          (pdf as any).autoTable({
            body: tableBody,
            startY: yPosition,
            rowPageBreak: "avoid",
            bodyStyles: { valign: "top" },
            styles: { cellPadding: 0.5, fontSize: 8 },
            columns: columns,
            // drawCell: function (cell: any, opts: any) {
            //   console.log(cell, opts);
            // },
            willDrawCell: function (data: any, cell: any) {
              if (
                data.section === "body" &&
                data.column.dataKey.includes("link")
              ) {
                // console.log(data);
                let linkNum = data.column.dataKey.match(/\d+/)[0];
                let posX = data.cell.x;
                let posY = data.cell.y + 3;
                let text = data.cell.raw;
                let url = data.row.raw[`link${linkNum}`];
                if (text) {
                  (pdf as any).textWithLink(text, posX, posY, {
                    url: url,
                  });
                }
              }
            },
          });
        } else {
          (pdf as any).autoTable({
            // head: tableHead,
            body: tableBody,
            startY: yPosition,
            rowPageBreak: "avoid",
            bodyStyles: { valign: "top" },
            styles: { cellPadding: 0.5, fontSize: 8 },
            columns: columns,
          });
        }

        const postTableY = Math.ceil((pdf as any).lastAutoTable.finalY);
        yPosition = postTableY ? postTableY + 10 : yPosition + 5;
      });

      pdf.output("dataurlnewwindow", { filename: "export.pdf" });
    },
    createFeaturePopup: (graphic: __esri.Graphic) => {
      console.log("DelineateStore: action: createFeaturePopup");
      const isFeature = graphic?.layer.type === "feature";
      let heading = graphic.attributes["OBJECTID"];

      if (isFeature) {
        switch (graphic.layer.title) {
          case LAYERTITLES.rsbTrace:
            heading = `#${graphic.attributes["CatchIDN"]}`;
            graphic.popupTemplate = new PopupTemplate({
              outFields: ["*"],
              title: LAYERTITLES.rsbTrace,
              content: createRSBTracePopup(graphic),
              lastEditInfoEnabled: false,
            });
            break;
          case LAYERTITLES.resources:
            heading = graphic.attributes["CITY"];
            graphic.popupTemplate = new PopupTemplate({
              outFields: ["*"],
              title: LAYERTITLES.resources,
              content: createResourcesPopup(graphic, false),
              lastEditInfoEnabled: false,
            });
            break;
          case LAYERTITLES.rsb:
            heading = `#${graphic.attributes["CatchIDN"]}`;
            graphic.popupTemplate = new PopupTemplate({
              outFields: ["*"],
              title: LAYERTITLES.rsb,
              content: createRSBPopup(graphic),
              lastEditInfoEnabled: false,
            });
            break;
          case LAYERTITLES.impairedLines:
            graphic.popupTemplate = new PopupTemplate({
              outFields: ["*"],
              title: LAYERTITLES.impairedLines,
              content: [
                new CustomContent({
                  outFields: ["*"],
                  creator: () => {
                    return createImpairmentPopup(graphic);
                  },
                }),
              ],
              lastEditInfoEnabled: false,
            });
            break;
          case LAYERTITLES.impairedPolys:
            graphic.popupTemplate = new PopupTemplate({
              outFields: ["*"],
              title: LAYERTITLES.impairedPolys,
              content: [
                new CustomContent({
                  outFields: ["*"],
                  creator: () => {
                    return createImpairmentPopup(graphic);
                  },
                }),
              ],
              lastEditInfoEnabled: false,
            });
            break;
          case LAYERTITLES.assessedLines:
            graphic.popupTemplate = new PopupTemplate({
              outFields: ["*"],
              title: LAYERTITLES.assessedLines,
              content: [
                new CustomContent({
                  outFields: ["*"],
                  creator: () => {
                    return createImpairmentPopup(graphic);
                  },
                }),
              ],
              lastEditInfoEnabled: false,
            });
            break;
          case LAYERTITLES.assessedPolys:
            graphic.popupTemplate = new PopupTemplate({
              outFields: ["*"],
              title: LAYERTITLES.assessedPolys,
              content: [
                new CustomContent({
                  outFields: ["*"],
                  creator: () => {
                    return createImpairmentPopup(graphic);
                  },
                }),
              ],
              lastEditInfoEnabled: false,
            });
            break;

          case LAYERTITLES.iso:
            graphic.popupTemplate = new PopupTemplate({
              outFields: ["*"],
              title: LAYERTITLES.iso,
              content: [
                new CustomContent({
                  outFields: ["*"],
                  creator: () => {
                    return createISOPopup(graphic);
                  },
                }),
              ],
              lastEditInfoEnabled: false,
            });
            break;
          default:
            break;
        }
      }
      return { heading: heading, graphic: graphic };
    },
  };

  const state = SvelteStore.derived(
    writableQueryStore,
    ($state) => $state.state
  );
  const results = SvelteStore.derived(
    writableQueryStore,
    ($state) => $state.results
  );
  const search = SvelteStore.derived(
    writableQueryStore,
    ($state) => $state.search
  );
  const target = SvelteStore.derived(
    writableQueryStore,
    ($state) => $state.target
  );
  const sketchViewModel = SvelteStore.derived(
    writableQueryStore,
    ($state) => $state.sketchViewModel
  );

  const getters: QueryStoreGettersInterface = {
    state,
    results,
    search,
    target,
    sketchViewModel,
  };

  return {
    getters,
    actions,
  };
};
