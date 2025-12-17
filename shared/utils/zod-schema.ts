import z from "zod";

export const SearchSchema = z.object({
  q: z.string().min(1),
});

export type SearchSchema = z.infer<typeof SearchSchema>;

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
