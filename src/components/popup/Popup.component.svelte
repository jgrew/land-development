<script lang="ts">
  import "@esri/calcite-components/dist/components/calcite-panel";
  import "@esri/calcite-components/dist/components/calcite-link";
  import "@esri/calcite-components/dist/components/calcite-block";
  import { useAppStore } from "$store/index";
  import Feature from "$components/shared/feature/Feature.component.svelte";

  const panelId: string = "popup";
  const { mapStore, layoutStore, queryStore } = useAppStore();
  const { view, hitTestResults } = mapStore.getters;
  const { activePanel } = layoutStore.getters;
  $: hidden = !($activePanel === panelId);

  const clear = (): void => {
    mapStore.actions.clearHitTestResults();
  };
</script>

<calcite-panel
  heading="Features"
  height-scale="l"
  data-panel-id={panelId}
  {hidden}
>
  {#if $hitTestResults.length > 0}
    <calcite-block open>
      <div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <calcite-link on:click={clear}> Clear </calcite-link>
        <calcite-accordion>
          {#each $hitTestResults as { features, title }, i}
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
      </div>
    </calcite-block>
  {:else}
    <calcite-block open>
      <div>Click on the map to view feature information</div>
    </calcite-block>
  {/if}
</calcite-panel>
