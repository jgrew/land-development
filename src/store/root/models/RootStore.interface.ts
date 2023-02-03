import type { MapStoreInterface } from "src/store/map/models";
import type { DelineateStoreInterface } from "src/store/delineate/models";
import type { LayoutStoreInterface } from "src/store/layout/models";
import type { QueryStoreInterface } from "src/store/query/models";

/**
 * @name RootStoreInterface
 * @description Gathers all stores used in this app
 */
export interface RootStoreInterface {
    mapStore: MapStoreInterface,
    delineateStore: DelineateStoreInterface,
    layoutStore: LayoutStoreInterface,
    queryStore: QueryStoreInterface
}