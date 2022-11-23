import type { RootStoreInterface } from "./models";
import { useMapStore } from "../map/Map.store";
import { useLayoutStore } from "../layout/Layout.store";
import { useDelineateStore} from "../delineate/Delineate.store";
import { useQueryStore } from "../query/Query.store";

export const useAppStore = (): RootStoreInterface => {
  return {
    mapStore: useMapStore(),
    layoutStore: useLayoutStore(),
    delineateStore: useDelineateStore(),
    queryStore: useQueryStore()
  };
};
