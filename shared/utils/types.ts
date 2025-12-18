import type { User } from "better-auth";
import type { RouteLocationRaw } from "vue-router";

export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapPoint = {
  id: number;
  name: string;
  description: string | null;
  to?: RouteLocationRaw;
  toLabel?: string;
} & LatLongItem;

export type UserWithId = Omit<User, "id"> & {
  id: number;
};

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user?: UserWithId;
  }
}

// Nominatim API 响应数据类型
export type NominatimResult = {
  place_id: number;
  licence: string;
  osm_type: "node" | "way" | "relation";
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: string[];
};

// 搜索结果数组类型
export type SearchResult = NominatimResult[];

export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
  mapPoint?: MapPoint | null;
};
