<!-- <script setup>
import layoutUser from "@/Layout/LayoutUser.vue";
</script>
<template>
  <main>
    <layoutUser>
        <div>
            Noti
        </div>
    </layoutUser>
  </main>
</template> -->

<!-- <template>
  <VueDatePicker
    format="dd/MM/yyyy"
    locale="th"
    v-model="date"
    @update:model-value="handleChooseDate(date)"
    :min-date="new Date()"
    :disabled-dates="disabledDates"
  ></VueDatePicker>
  {{ drageDate }}
  <VueDatePicker
    format="  dd/MM/yyyy  "
    locale="th"
    v-model="drageDate"
    :multi-dates="{ dragSelect: false }"
    :min-date="new Date()"
  ></VueDatePicker>
</template>

<script setup>
import { ref } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import dayjs from "dayjs";

const drageDate = ref();
const date = ref(dayjs(""));
const formattedDate = ref(dayjs("").format("YYYY-MM-DD"));
const handleChooseDate = (date) => {
  console.log("Dayyyyyyyyyyyy", date);
  formattedDate.value = dayjs(date).format("YYYY-MM-DD");
  console.log(formattedDate.value);
};
const disabledDates = [
  "2024-04-25", // วันที่ต้องการปิดการใช้งาน
  "2024-04-26",
];
</script> -->

<!-- <template>
  <div>
    {{dates}} ----\\//----
    {{ formattedDates }}
    <ul>
      <li v-for="(date, index) in formattedDates" :key="index">{{ date }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const dates = [
  "2024-03-31T05:04:00.000Z",
  "2024-04-01T05:04:00.000Z",
  "2024-04-02T05:04:00.000Z",
  "2024-04-03T05:04:00.000Z"
];

const formattedDates = ref([]);

const formatDates = () => {
  formattedDates.value = dates.map(date => {
    return date.split('T')[0];
  });
};

onMounted(() => {
  formatDates();
});
</script> -->

<template>
  <div>
    {{ b }}
    <h2>Sorted Dates (Ascending):</h2>
    <ul>
      <li v-for="date in sortedDates" :key="date">{{ date }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
const dates = ref(["2024-04-11", "2024-04-13", "2024-04-12", "2024-04-14"]);

const a = dayjs()
const b = a.add(7, 'day')

const sortedDates = computed(() => {
  return [...dates.value].sort();
});
</script>
