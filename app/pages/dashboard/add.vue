<script lang="ts" setup>
import type { NominatimResult } from "~~/shared/utils/types";
import type { FetchError } from "ofetch";

import { toTypedSchema } from "@vee-validate/zod";
import getFetchErrorMessage from "#shared/utils/get-fetch-error-message";
import { InsertLocation } from "~~/server/db/schema";

const { $csrfFetch } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");
const { handleSubmit, errors, meta, setErrors, setFieldValue, controlledValues } = useForm({
  validationSchema: toTypedSchema(InsertLocation),
  initialValues: {
    name: "",
    description: "",
    long: (CENTER_CHINA as [number, number])[0],
    lat: (CENTER_CHINA as [number, number])[1],
  },
});
const mapStore = useMapStore();

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    await $csrfFetch("/api/locations", {
      method: "post",
      body: values,
    });
    submitted.value = true;
    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data?.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

function formatNumber(value?: number) {
  if (!value)
    return 0;
  return value.toFixed(5);
}

function searchResultSelected(result: NominatimResult) {
  setFieldValue("name", result.display_name);
  mapStore.addedPoint = {
    id: 1,
    name: "AddedPoint",
    description: "",
    long: Number(result.lon),
    lat: Number(result.lat),
    centerMap: true,
  };
}

effect(() => {
  if (mapStore.addedPoint) {
    setFieldValue("long", mapStore.addedPoint.long);
    setFieldValue("lat", mapStore.addedPoint.lat);
  }
});

onMounted(() => {
  mapStore.addedPoint = {
    id: 1,
    name: "AddedPoint",
    description: "",
    long: (CENTER_CHINA as [number, number])[0],
    lat: (CENTER_CHINA as [number, number])[1],
  };
});

onBeforeRouteLeave(() => {
  // 在离开当前页面之前执行的逻辑
  if (!submitted.value && meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const answer = window.confirm(
      "You have unsaved changes. Are you sure you want to leave?",
    );
    if (!answer) {
      return false; // 阻止导航
    }
  }
  mapStore.addedPoint = null;
});
</script>

<template>
  <div class="container mx-auto max-w-md p-4">
    <div class="my-4">
      <h1 class="text-lg font-semibold">
        Add Location
      </h1>
      <p class="text-sm">
        A location is a place you have traveled. It can be a city, country, landmark, or any other
        notable destination.
      </p>
    </div>
    <div
      v-if="submitError"
      role="alert"
      class="alert alert-error"
    >
      <Icon name="tabler:alert-triangle" size="24" />
      <span>{{ submitError }}</span>
    </div>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
      <AppFormField
        label="Name"
        name="name"
        :error="errors.name"
        :disabled="loading"
      />
      <AppFormField
        label="Description"
        name="description"
        type="textarea"
        :error="errors.description"
        :disabled="loading"
      />
      <!-- <AppFormField
        label="Latitude"
        name="lat"
        :error="errors.lat"
        :disabled="loading"
      />
      <AppFormField
        label="Longitude"
        name="long"
        :error="errors.long"
        :disabled="loading"
      /> -->
      <p class="text-xs text-gray-400">
        Current coordinates: {{ formatNumber(controlledValues.lat as number) }},{{ formatNumber(controlledValues.long as number) }}
      </p>
      <div class="text-sm text-gray-400">
        <p>To set the coordinates:</p>
        <ul class="list-disc ml-4">
          <li>
            Drag the marker <Icon name="tabler:map-pin-filled" class="text-warning" /> on map.
          </li>
          <li>
            Double click on the map.
          </li>
          <li>
            Search for a location below.
          </li>
        </ul>
      </div>

      <div class="flex justify-end gap-2">
        <button
          :disabled="loading"
          type="button"
          class="btn btn-outline "
          @click="router.back()"
        >
          <Icon name="tabler:arrow-left" size="24" />
          Cancel
        </button>
        <button
          :disabled="loading"
          type="submit"
          class="btn btn-primary "
        >
          Add
          <span v-if="loading" class="loading loading-spinner loading-sm" />
          <Icon
            v-else
            name="tabler:plus"
            size="24"
          />
        </button>
      </div>
    </form>
    <div class="divider" />
    <AppPlaceSearch @result-selected="searchResultSelected" />
  </div>
</template>
