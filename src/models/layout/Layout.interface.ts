export type ShellAction = {
  id: string;
  type: string;
  icon: string;
  text: string;
};

export type ShellConfig = {
  top: ShellAction[];
  bottom: ShellAction[];
};

export type State = "ready" | "loading" | "error";
