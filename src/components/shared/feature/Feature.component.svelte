<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import Feature from "@arcgis/core/widgets/Feature";
  import { useAppStore } from "$store/index";
  import "@esri/calcite-components/dist/components/calcite-block";
  import type { FeatureProp } from "$models/index";
  import Graphic from "@arcgis/core/Graphic";

  const { mapStore } = useAppStore();
  const { view } = mapStore.getters;
  let container: HTMLElement;
  let feature: __esri.Feature;
  export let length: number;
  export let template: __esri.PopupTemplate = undefined;
  export let featureProp: FeatureProp = undefined;
  export let visibleElements: __esri.FeatureVisibleElements = {
    title: false,
  };

  $: open = length == 1 ? true : false;
  $: collapsible = length == 1 ? false : true;

  const createFeature = () => {
    let graphic = featureProp?.graphic;
    if (!graphic) {
      return;
    }

    if (template) {
      graphic.popupTemplate = template;
    }

    if (feature) {
      feature.graphic = graphic;
    } else {
      feature = new Feature({
        graphic: graphic,
        visibleElements,
        defaultPopupTemplateEnabled: false,
        map: $view.map,
        container: container,
      });
    }
  };

  onMount(() => {
    createFeature();
  });
  afterUpdate(() => {
    createFeature();
  });
</script>

<calcite-block {open} heading={featureProp.heading} {collapsible}>
  <div bind:this={container} />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <calcite-action
    text-enabled
    text="Zoom"
    icon="magnifying-glass-plus"
    slot="header-menu-actions"
    on:click={() => {
      mapStore.actions.zoomToGraphic(featureProp.graphic);
      mapStore.actions.highlight(
        featureProp.graphic,
        featureProp.graphic.layer.id
      );
    }}
  />
</calcite-block>
