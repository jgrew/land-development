<script lang="ts">
  import { onMount } from "svelte";
  import "@esri/calcite-components/dist/components/calcite-panel";
  import "@esri/calcite-components/dist/components/calcite-link";
  import "@esri/calcite-components/dist/components/calcite-label";
  import "@esri/calcite-components/dist/components/calcite-block";
  import "@esri/calcite-components/dist/components/calcite-select";
  import "@esri/calcite-components/dist/components/calcite-notice";
  import "@esri/calcite-components/dist/components/calcite-option";
  import "@esri/calcite-components/dist/components/calcite-accordion";
  import "@esri/calcite-components/dist/components/calcite-accordion-item";
  import "@esri/calcite-components/dist/components/calcite-button";
  import "@esri/calcite-components/dist/components/calcite-flow";
  import "@esri/calcite-components/dist/components/calcite-flow-item";
  import "@esri/calcite-components/dist/components/calcite-fab";
  import type { CalciteFlow } from "@esri/calcite-components/dist/components/calcite-flow";
  import { useAppStore } from "$store/index";

  const panelId: string = "delineate";
  let flowNode: CalciteFlow;
  let featureContainer: HTMLElement;
  const { delineateStore, layoutStore, mapStore } = useAppStore();
  const { activePanel } = layoutStore.getters;
  const { target, state, result } = delineateStore.getters;
  const { rsbDsLayer } = mapStore.getters;
  $: hidden = !($activePanel === panelId);
  $: disabled = $target === null;

  $: if ($result) {
    let feature = delineateStore.actions.createFeature();
    feature.container = featureContainer;
  }
  const handleBack = () => {
    delineateStore.actions.clear();
  };

  onMount(() => {
    delineateStore.actions.init();
  });
</script>

<calcite-panel
  heading="Delineate"
  height-scale="l"
  data-panel-id={panelId}
  {hidden}
>
  <calcite-flow bind:this={flowNode}>
    <calcite-flow-item>
      <calcite-block loading={$state==='loading'} open>
        <calcite-label>
          Select a trace direction
          <calcite-select label="Select a trace group">
            <calcite-option selected value="Downstream">
              Downstream
            </calcite-option>
          </calcite-select>
        </calcite-label>
        <calcite-notice active color="blue" icon width="full">
          <div slot="message">
            This tool delineates watersheds from the regional subbasin dataset.
            <calcite-link
              icon-start="link"
              href="https://data-ocpw.opendata.arcgis.com/datasets/regional-subbasins/explore"
              target="_blank"
            >
              More info
            </calcite-link>
          </div>
        </calcite-notice>
      </calcite-block>
      <calcite-panel open>
        <calcite-block
          heading="Starting Point"
          summary="Add a point where the trace should start."
          open
        >
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <calcite-button
            appearance="outline"
            icon-start="plus"
            on:click={() => delineateStore.actions.draw()}
            >Add Point</calcite-button
          >
        </calcite-block>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <calcite-fab
          slot="fab"
          appearance="solid"
          color="blue"
          icon="app-run"
          text="Run"
          text-enabled
          {disabled}
          loading={$state === "loading"}
          on:click={() => delineateStore.actions.trace()}
        />
      </calcite-panel>
    </calcite-flow-item>
    {#if $result}
      <calcite-flow-item
        heading="Trace Results"
        on:calciteFlowItemBack={handleBack}
      >
        <calcite-block open>
          <div bind:this={featureContainer} />
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <calcite-button
            appearance="transparent"
            icon-end="magnifying-glass-plus"
            slot="control"
            on:click={() => {
              mapStore.actions.zoomToGraphic($result);
              mapStore.actions.highlight($result, $rsbDsLayer.id);
            }}>Zoom</calcite-button
          >
        </calcite-block>
      </calcite-flow-item>
    {/if}
  </calcite-flow>
</calcite-panel>
