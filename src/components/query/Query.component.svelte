<script lang="ts">
  import { onMount } from "svelte";
  import "@esri/calcite-components/dist/components/calcite-panel";
  import "@esri/calcite-components/dist/components/calcite-action";
  import "@esri/calcite-components/dist/components/calcite-link";
  import "@esri/calcite-components/dist/components/calcite-block";
  import "@esri/calcite-components/dist/components/calcite-accordion";
  import "@esri/calcite-components/dist/components/calcite-accordion-item";
  import "@esri/calcite-components/dist/components/calcite-flow";
  import "@esri/calcite-components/dist/components/calcite-flow-item";
  import "@esri/calcite-components/dist/components/calcite-button";
  import "@esri/calcite-components/dist/components/calcite-fab";
  import type { CalciteFlow } from "@esri/calcite-components/dist/components/calcite-flow";
  import { useAppStore } from "$store/index";
  import Feature from "$components/shared/feature/Feature.component.svelte";

  let searchContainer: HTMLElement;
  let flowNode: CalciteFlow;
  const panelId: string = "query";
  const { layoutStore, queryStore } = useAppStore();
  const { target, state, results } = queryStore.getters;
  const { activePanel } = layoutStore.getters;
  $: hidden = !($activePanel === panelId);
  $: disabled = $target === null;

  const handleBack = () => {
    queryStore.actions.clear();
  };

  onMount(() => {
    queryStore.actions.createSketch();
    let search = queryStore.actions.createSearch();
    search.container = searchContainer;
  });
</script>

<calcite-panel
  heading="Guidance"
  height-scale="l"
  data-panel-id={panelId}
  {hidden}
>
  <calcite-flow bind:this={flowNode}>
    <calcite-flow-item>
      <calcite-block
        open
        heading="Use this tool to learn about available resources for your project"
      >
        <div>
          <p>Start by searching for an address</p>
          <div class="search-container" bind:this={searchContainer} />
          <div class="separator">OR</div>
          <p>Use one of the tools below to draw a location on the map</p>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <calcite-button
            appearance="outline"
            scale="m"
            icon-start="plus"
            value="point"
            on:click={() => queryStore.actions.draw("point")}
          >
            Point
          </calcite-button>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <calcite-button
            appearance="outline"
            scale="m"
            icon-start="polygon"
            value="polygon"
            on:click={() => queryStore.actions.draw("polygon")}
          >
            Polygon
          </calcite-button>
        </div>
      </calcite-block>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <calcite-fab
        slot="fab"
        appearance="solid"
        color="blue"
        icon="magnifying-glass"
        text="Search"
        text-enabled
        {disabled}
        loading={$state === "loading"}
        on:click={() => queryStore.actions.query()}
      />
    </calcite-flow-item>
    {#if $results}
      <calcite-flow-item heading="Results" on:calciteFlowItemBack={handleBack}>
        <calcite-block open>
          <calcite-accordion>
            {#each $results as { features, title }, i}
              <calcite-accordion-item
                heading={title}
                description={features.length > 1
                  ? `${features.length} features`
                  : null}
                expanded={title === "Planning Resources"}
              >
                {#each features as feature, j}
                  <Feature
                    featureProp={queryStore.actions.createFeaturePopup(feature)}
                    length={features.length}
                  />
                {/each}
              </calcite-accordion-item>
            {/each}
          </calcite-accordion>
        </calcite-block>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <calcite-action
          icon="save"
          text-enabled
          text="Save to PDF"
          slot="header-actions-end"
          on:click={() => queryStore.actions.exportPDF()}
        />
      </calcite-flow-item>
    {/if}
  </calcite-flow>
</calcite-panel>

<style>
  .search-container {
    width: 100%;
  }
  .separator {
    display: flex;
    align-items: center;
    text-align: center;
  }

  .separator::before,
  .separator::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #000;
  }

  .separator:not(:empty)::before {
    margin-right: 0.25em;
  }

  .separator:not(:empty)::after {
    margin-left: 0.25em;
  }
</style>
