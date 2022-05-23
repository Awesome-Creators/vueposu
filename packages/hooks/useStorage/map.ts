import type { Ref } from "vue-demi";
import type { Obj } from "@vueposu/utils";

export type StorageMap = Obj<Ref<string | null>>;

export const localStorageMap: StorageMap = {};
export const sessionStorageMap: StorageMap = {};
