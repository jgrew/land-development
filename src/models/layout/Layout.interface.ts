/**
 * @name ShellAction
 * @description props for calcite-shell actions
 */
export type ShellAction = {
  id: string;
  type: string;
  icon: string;
  text: string;
};

/**
 * @name ShellAction
 * @description collection of action props for calcite-shell
 */
export type ShellConfig = {
  top: ShellAction[];
  bottom: ShellAction[];
};

/**
 * @name State
 * @description component state
 */
export type State = "ready" | "loading" | "error";
