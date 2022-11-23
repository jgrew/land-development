<script lang="ts">
  import { onMount } from "svelte";
  import "@esri/calcite-components/dist/components/calcite-shell";
  import "@esri/calcite-components/dist/components/calcite-shell-panel";
  import "@esri/calcite-components/dist/components/calcite-action";
  import "@esri/calcite-components/dist/components/calcite-action-bar";
  import "@esri/calcite-components/dist/components/calcite-panel";
  import "@esri/calcite-components/dist/components/calcite-label";
  import "@esri/calcite-components/dist/components/calcite-rating";
  import "@esri/calcite-components/dist/components/calcite-action-group";
  import type { CalciteShellPanel } from "@esri/calcite-components/dist/components/calcite-shell-panel";
  import {
    Map,
    LayerList,
    Delineate,
    Disclaimer,
    Print,
    Query,
    Popup,
  } from "$components/index";
  import { useAppStore } from "$store/index";


  const { layoutStore, mapStore } = useAppStore();
  const shellConfig = layoutStore.getters.shellConfig;
  const activePanel = layoutStore.getters.activePanel;
  const view = mapStore.getters.view;
  let shellPanel: CalciteShellPanel;
  $: collapsed = $activePanel === null;
  let actionBarExpanded: boolean = false;
  let viewIsReady: boolean;
  $: $view?.watch("ready", (ready) => {
    viewIsReady = ready;
  });

  // Watch calcite-shell-panel resize event and pad the view
  const resizeObserver = new ResizeObserver((entries) => {
    let value = entries[0].contentRect.right;
    mapStore.actions.setPadding({ left: value });
  });

  const handleActionBarClick = ({ target }: { target: HTMLElement }) => {
    if (target.tagName !== "CALCITE-ACTION") {
      return;
    }
    const nextPanel = target.dataset.actionId;

    layoutStore.actions.setActivePanel(nextPanel);
  };

  const handleActionBarToggle = () => {
    actionBarExpanded = !actionBarExpanded;
    let value = actionBarExpanded ? 135 : 45;
    mapStore.actions.setPadding({ left: value });
  };

  onMount(() => {
    resizeObserver.observe(shellPanel);
  });
</script>

<calcite-shell content-behind>
  <div id="header" slot="header">
    <header class="header">
      <div class="title-area">
        <img class="logo" src="./oc_seal.gif" alt="OC Seal" />
        <h1 class="heading">OC Stormwater Program Land Development Tool</h1>
      </div>
    </header>
  </div>

  <calcite-shell-panel
    {collapsed}
    slot="panel-start"
    height-scale="l"
    width-scale="l"
    bind:this={shellPanel}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <calcite-action-bar
      expanded
      slot="action-bar"
      on:calciteActionBarToggle={handleActionBarToggle}
      on:click={handleActionBarClick}
    >
      {#each $shellConfig["top"] as { id, type, icon, text }, i}
        <calcite-action
          data-action-id={id}
          data-action-type={type}
          {icon}
          {text}
        />
      {/each}
      {#each $shellConfig["bottom"] as { id, type, icon, text }, i}
        <calcite-action
          data-action-id={id}
          data-action-type={type}
          {icon}
          {text}
          slot="bottom-actions"
        />
      {/each}
    </calcite-action-bar>
    {#if viewIsReady}
      <LayerList />
      <Delineate />
      <Print />
      <Query />
      <Popup />
    {/if}
  </calcite-shell-panel>
  <Map />
</calcite-shell>
<Disclaimer />

<style>
  .header {
    height: 49px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header .title-area {
    display: flex;
    vertical-align: middle;
    align-items: center;
  }

  .header .title-area img.logo {
    margin-left: 2px;
    max-height: 45px;
    line-height: 49px;
    vertical-align: middle;
  }

  .header .title-area h1 {
    align-items: center;
    margin-left: 15px;
    font-size: 18px;
    font-weight: 500;
    line-height: 16.35px;
  }
</style>
