import type { Readable } from "svelte/store";
import type { ShellConfig } from "$models/index";

/**
 * @name LayoutStoreActionsInterface
 * @description Represents the layout state actions
 */
export interface LayoutStoreActionsInterface {
  /**
   * Set the string name of current active panel
   * @param {string} nextPanel panel name, should match shell config
   */
  setActivePanel(nextPanel: string): void;
}

/**
 * @name LayoutStoreGettersInterface
 * @description Interface represents Layout store getters
 * Getters will be used to consume the data from the store.
 */
export interface LayoutStoreGettersInterface {
  /** Configuration for calcite-shell action bar */
  shellConfig: Readable<ShellConfig>;
  /** Currently selected action/panel */
  activePanel: Readable<string>;
}

/**
 * @name LayoutStoreInterface
 * @description Interface represents our Layout store module
 */
export interface LayoutStoreInterface {
  actions: LayoutStoreActionsInterface;
  getters: LayoutStoreGettersInterface;
}
