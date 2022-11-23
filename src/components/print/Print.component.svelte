<script lang="ts">
  import { onMount } from "svelte";
  import "@esri/calcite-components/dist/components/calcite-panel";
  import "@esri/calcite-components/dist/components/calcite-link";
  import "@esri/calcite-components/dist/components/calcite-block";
  import Print from "@arcgis/core/widgets/Print";
  import { useAppStore } from "$store/index";

  let container: HTMLElement;
  const panelId: string = "print";
  const { mapStore, layoutStore } = useAppStore();
  const { view } = mapStore.getters;
  const { activePanel } = layoutStore.getters;
  $: hidden = !($activePanel === panelId);

  onMount(() => {
    new Print({
      view: $view,
      printServiceUrl:
        "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
      container: container,
      label: "Print",
    });
  });
</script>

<calcite-panel
  heading="Export"
  height-scale="l"
  data-panel-id={panelId}
  {hidden}
>
  <calcite-block open>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <calcite-link
      href="https://data-ocpw.opendata.arcgis.com/search?q=land%20development"
      target="_blank"
      icon-start="link">Open Data Portal</calcite-link
    >
    <div bind:this={container} />
  </calcite-block>
</calcite-panel>
