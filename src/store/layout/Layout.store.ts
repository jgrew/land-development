import * as SvelteStore from "svelte/store";
import type {
  LayoutStateInterface,
  LayoutStoreInterface,
  LayoutStoreGettersInterface,
  LayoutStoreActionsInterface,
} from "./models/index";

const writableLayoutStore = SvelteStore.writable<LayoutStateInterface>({
  activePanel: "legend",
  shellConfig: {
    top: [
      {
        id: "query",
        type: "panel",
        icon: "search",
        text: "Guidance",
      },
      {
        id: "delineate",
        type: "panel",
        icon: "analysis",
        text: "Delineate",
      },
      {
        id: "print",
        type: "panel",
        icon: "print",
        text: "Export",
      },
    ],
    bottom: [
      {
        id: "legend",
        type: "panel",
        icon: "legend",
        text: "Legend",
      },
      {
        id: "popup",
        type: "panel",
        icon: "popup",
        text: "Features",
      },
    ],
  },
});

export const useLayoutStore = (): LayoutStoreInterface => {
  const actions: LayoutStoreActionsInterface = {
    setActivePanel: (nextPanel: string) => {
      console.log("LayoutStore: action: setActivePanel", nextPanel);
      writableLayoutStore.update((state) => {
        state.activePanel = state.activePanel === nextPanel ? null : nextPanel;
        return state;
      });
    },
  };

  const shellConfig = SvelteStore.derived(
    writableLayoutStore,
    ($state) => $state.shellConfig
  );

  const activePanel = SvelteStore.derived(
    writableLayoutStore,
    ($state) => $state.activePanel
  );

  const getters: LayoutStoreGettersInterface = {
    shellConfig,
    activePanel,
  };

  return {
    getters,
    actions,
  };
};
