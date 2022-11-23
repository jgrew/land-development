<script lang="ts">
  import { onMount } from "svelte";
  import "@esri/calcite-components/dist/components/calcite-panel";
  import "@esri/calcite-components/dist/components/calcite-link";
  import "@esri/calcite-components/dist/components/calcite-block";

  import { useAppStore } from "$store/index";

  let container: HTMLElement;
  const panelId: string = "popup";
  const { mapStore, layoutStore } = useAppStore();
  const { view } = mapStore.getters;
  const { activePanel } = layoutStore.getters;
  $: hidden = !($activePanel === panelId);

  onMount(() => {});
</script>

<calcite-panel
  heading="Features"
  height-scale="l"
  data-panel-id={panelId}
  {hidden}
>
  <calcite-block open>
    <div>Hello</div>
  </calcite-block>
</calcite-panel>
