<script lang="ts">
  import MapView from "@arcgis/core/views/MapView";
  import { onMount } from "svelte";
  import { useAppStore } from "$store/index";

  let container: HTMLDivElement;
  const { mapStore } = useAppStore();
  let map = mapStore.getters.map

  onMount(() => {
    mapStore.actions.setView(
      new MapView({
        container,
        map: $map,
        center: [-117.760746, 33.70296],
        zoom: 11,
        padding: {
          left: 49,
        },
      })
    );
  });
</script>

<div class="viewDiv" bind:this={container} />

<style>
  .viewDiv {
    height: 100%;
    width: 100%;
  }
</style>
