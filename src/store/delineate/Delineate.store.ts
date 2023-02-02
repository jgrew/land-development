import * as SvelteStore from "svelte/store";
import type {
  DelineateStateInterface,
  DelineateStoreInterface,
  DelineateStoreGettersInterface,
  DelineateStoreActionsInterface,
} from "./models/index";
import { useMapStore } from "$store/map/Map.store";
import { createRSBTracePopup } from "$lib/popupHelpers";

import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import { TextSymbol, SimpleMarkerSymbol } from "@arcgis/core/symbols";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Feature from "@arcgis/core//widgets/Feature";
import PopupTemplate from "@arcgis/core/PopupTemplate";

// const { mapStore } = useAppStore();
const { view, rsbLayer, rsbDsLayer } = useMapStore().getters;

const writableDelineateStore = SvelteStore.writable<DelineateStateInterface>({
  state: "ready",
  sketchGraphics: null,
  dsQuery: null,
  rsbQuery: null,
  rsbStore: null,
  result: null,
  target: null,
  model: null,
  label: null,
});

export const useDelineateStore = (): DelineateStoreInterface => {
  const actions: DelineateStoreActionsInterface = {
    init: () => {
      console.log("DelineateStore: action: init");
      writableDelineateStore.update((state) => {
        state.state = "loading";
        return state;
      });

      let rsbStore = new FeatureLayer({
        portalItem: {
          id: "f37d7323d6d54c8982287ee6e331dedf",
        },
        outFields: ["Watershed", "CatchIDN", "AreaAcre", "OBJECTID"],
        visible: false,
        title: "Trace Result",
      });

      let dsQuery = rsbStore.createQuery();
      dsQuery.outFields = ["Watershed", "CatchIDN", "AreaAcre", "OBJECTID"];
      let rsbQuery = SvelteStore.get(rsbLayer).createQuery();

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
          color: [1, 64, 175, 1],
          style: "square",
        }),
      });

      sketchViewModel.on("create", (event) => {
        if (event.state === "complete") {
          let target = event.graphic.geometry;
          useDelineateStore().actions.createLabel(
            new Graphic({
              geometry: target,
            })
          );
          writableDelineateStore.update((state) => {
            state.target = target;
            return state;
          });
        }
      });

      sketchViewModel.on("update", (event) => {
        if (event.state === "complete") {
          let target = event.graphics[0].geometry;
          writableDelineateStore.update((state) => {
            state.target = target;
            return state;
          });
        }
      });

      SvelteStore.get(view).map.add(sketchGraphics);

      writableDelineateStore.update((state) => {
        state.state = "ready";
        state.dsQuery = dsQuery;
        state.rsbQuery = rsbQuery;
        state.sketchGraphics = sketchGraphics;
        state.rsbStore = rsbStore;
        state.model = sketchViewModel;
        return state;
      });
    },
    draw: () => {
      console.log("DelineateStore: action: draw");
      useDelineateStore().actions.clear();
      SvelteStore.get(rsbDsLayer).visible = false;
      SvelteStore.get(writableDelineateStore).model.create('point')
    },
    clear: () => {
      console.log("DelineateStore: action: clear");
      writableDelineateStore.update((state) => {
        let mapView = SvelteStore.get(view);
        let dsLayer = SvelteStore.get(rsbDsLayer);
        dsLayer.visible = false;
        dsLayer.listMode = "hide";
        dsLayer.definitionExpression = "1=0";

        state.model.cancel();
        state.sketchGraphics.removeAll();

        if (state.label) {
          mapView.graphics.remove(state.label);
        }

        state.target = null;
        state.result = null;
        return state;
      });
    },
    trace: async () => {
      console.log("DelineateStore: action: trace");
      writableDelineateStore.update((state) => {
        state.state = "loading";
        return state;
      });

      let thisStore = SvelteStore.get(writableDelineateStore);
      let dsLayer = SvelteStore.get(rsbDsLayer);
      const location = new Graphic({
        geometry: thisStore.target,
      });

      thisStore.rsbQuery.geometry = location.geometry;
      thisStore.rsbQuery.outFields = ["CatchIDN"];
      let results = await SvelteStore.get(rsbLayer).queryFeatures(
        thisStore.rsbQuery
      );
      const catchIDN = results?.features[0].attributes.CatchIDN;
      const where = `CatchIDN = ${catchIDN}`;
      thisStore.dsQuery.where = where;
      dsLayer.definitionExpression = where;
      dsLayer.visible = true;
      dsLayer.listMode = "show";
      const traceResult = await thisStore.rsbStore.queryFeatures(
        thisStore.dsQuery
      );

      const trace = traceResult.features[0];

      writableDelineateStore.update((state) => {
        state.state = "ready";
        state.result = trace;
        return state;
      });
    },
    createLabel: (graphic: __esri.Graphic) => {
      console.log("DelineateStore: action: createLabel", {graphic});
      writableDelineateStore.update((state) => {
        let mapView = SvelteStore.get(view);
        if (state.label) {
          mapView.graphics.remove(state.label);
        }
        const text = "Delineation Point";
        state.label = new Graphic({
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
        mapView.graphics.add(state.label);
        return state;
      });
    },
    createFeature: () => {
      console.log("DelineateStore: action: createFeature");
      let graphic = SvelteStore.get(writableDelineateStore).result;
      let mapView = SvelteStore.get(view);
      const content = createRSBTracePopup(graphic);
      graphic.popupTemplate = new PopupTemplate({
        title: "Trace Results",
        outFields: ["*"],
        content: content,
      });

      const feature = new Feature({
        graphic,
        defaultPopupTemplateEnabled: false,
        view: mapView,
        spatialReference: mapView.spatialReference,
        visibleElements: {
          title: false,
        },
      });

      return feature;
    },
  };

  const state = SvelteStore.derived(
    writableDelineateStore,
    ($state) => $state.state
  );
  const target = SvelteStore.derived(
    writableDelineateStore,
    ($state) => $state.target
  );
  const result = SvelteStore.derived(
    writableDelineateStore,
    ($state) => $state.result
  );
  const model = SvelteStore.derived(
    writableDelineateStore,
    ($state) => $state.model
  );

  const getters: DelineateStoreGettersInterface = {
    state,
    target,
    result,
    model
  };

  return {
    getters,
    actions,
  };
};
