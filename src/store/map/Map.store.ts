import * as SvelteStore from "svelte/store";
import type {
  MapStateInterface,
  MapStoreInterface,
  MapStoreGettersInterface,
  MapStoreActionsInterface,
} from "./models/index";
import * as mapElements from "./Map.esri";
import FeatureFilter from "@arcgis/core/layers/support/FeatureFilter";

const writableMapStore = SvelteStore.writable<MapStateInterface>({
  view: null,
  map: mapElements.map,
  queryLayers: mapElements.queryLayers,
  rsbLayer: mapElements.rsbLayer,
  rsbDsLayer: mapElements.rsbDSLayer,
  highlight: null,
  // operationalLayers: mapElements.layers
});

export const useMapStore = (): MapStoreInterface => {
  const actions: MapStoreActionsInterface = {
    zoomToGraphic: async (graphic: __esri.Graphic) => {
      console.log("MapStore: action: zoomToGraphic", graphic);
      const mapView = SvelteStore.get(writableMapStore).view;
      mapView.goTo(
        {
          target: graphic,
          // zoom: 20,
        },
        { duration: 400 }
      );
    },

    setView: async (view: __esri.MapView) => {
      console.log("MapStore: action: setView", view);
      writableMapStore.update((state) => {
        state.view = view;
        return state;
      });
    },

    highlight: (graphic: __esri.Graphic, layerId: string = null) => {
      console.log("MapStore: action: highlight", graphic);
      let layer;
      const mapView = SvelteStore.get(writableMapStore).view;
      if (layerId) {
        layer = mapView.map.allLayers.find((layer) => {
          return layer.id === layerId;
        }) as __esri.FeatureLayer;
      } else {
        layer = graphic.layer;
      }

      mapView.whenLayerView(layer).then((layerView: any) => {
        writableMapStore.update((state) => {
          if (state.highlight) {
            state.highlight.remove();
          }
          // console.log(layerView)
          state.highlight = layerView.highlight(graphic.attributes["OBJECTID"]);

          return state;
        });
      });
    },
    setPadding: (padding: __esri.ViewPadding) => {
      console.log("MapStore: action: setPadding", padding);
      SvelteStore.get(writableMapStore).view.padding = padding;
    },
    applyFilter: async (layer: __esri.FeatureLayer, query: __esri.Query) => {
      const { geometry, spatialRelationship, where } = query;
      const props: __esri.FeatureFilterProperties = {
        geometry,
        spatialRelationship,
        where,
      };

      const title = layer.title;

      const layerView = await SvelteStore.get(writableMapStore).view.whenLayerView(layer)

      if (layerView) {
        const filter = new FeatureFilter(props);
        layerView.filter = filter
      }
    },
  };

  const view = SvelteStore.derived(writableMapStore, ($state) => $state.view);
  const map = SvelteStore.derived(writableMapStore, ($state) => $state.map);
  const queryLayers = SvelteStore.derived(
    writableMapStore,
    ($state) => $state.queryLayers
  );
  const rsbLayer = SvelteStore.derived(
    writableMapStore,
    ($state) => $state.rsbLayer
  );
  const rsbDsLayer = SvelteStore.derived(
    writableMapStore,
    ($state) => $state.rsbDsLayer
  );

  const getters: MapStoreGettersInterface = {
    view,
    map,
    queryLayers,
    rsbLayer,
    rsbDsLayer,
  };

  return {
    getters,
    actions,
  };
};
