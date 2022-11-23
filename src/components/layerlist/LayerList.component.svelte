<script lang="ts">
  import { onMount } from "svelte";
  import "@esri/calcite-components/dist/components/calcite-panel";
  import "@esri/calcite-components/dist/components/calcite-link";
  import LayerList from "@arcgis/core/widgets/LayerList";
  import { useAppStore } from "$store/index";

  let container: HTMLElement;
  let layerList: __esri.LayerList;
  const panelId: string = "legend";
  const { mapStore, layoutStore } = useAppStore();
  const { view } = mapStore.getters;
  const { activePanel } = layoutStore.getters;
  $: hidden = !($activePanel === panelId);

  const hideAll = (): void => {
    const layers = layerList.operationalItems;
    layers.forEach((layer) => {
      layer.visible = false;
    });
  };

  onMount(() => {
    layerList = new LayerList({
      view: $view,
      selectionEnabled: true,
      container: container,
      listItemCreatedFunction: function (event) {
        const item = event.item;

        if (item.layer.type != "group") {
          item.panel = {
            content: "legend",
            open: false,
          };
        }

        item.actionsSections = [
          [
            {
              title: "Increase opacity",
              className: "esri-icon-up",
              id: "increase-opacity",
            },
            {
              title: "Decrease opacity",
              className: "esri-icon-down",
              id: "decrease-opacity",
            },
          ],
        ];
      },
    });

    layerList.on("trigger-action", (event) => {
      const id = event.action.id;
      const layer = event.item.layer;
      if (id === "increase-opacity") {
        if (layer.opacity < 1) {
          layer.opacity += 0.1;
        }
      } else if (id === "decrease-opacity") {
        if (layer.opacity > 0) {
          layer.opacity -= 0.1;
        }
      }
    });
  });
</script>

<calcite-panel
  heading="Legend"
  height-scale="l"
  data-panel-id={panelId}
  {hidden}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <calcite-link on:click={hideAll}> Hide all </calcite-link>
  <div id="layers-container" bind:this={container} />
</calcite-panel>
