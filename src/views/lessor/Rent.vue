<script setup>
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import { useAccountStore } from "@/stores/account";
import { useRequeststore } from "@/stores/user/create_request";
import { useFieldStore } from "@/stores/Lessor/field";
import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";

const userStore = useAccountStore();
const userRequest = useRequeststore();
const lessorFields = useFieldStore();

const month = dayjs().get("month");
const date = dayjs().format("YYYY-MM-DD");
const requestToDay = ref(0);

const thaiMonths = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

onMounted(async () => {
  await userStore.getUser();
  await userRequest.loadRequestCancel();
  await userRequest.inComeM();
  await lessorFields.loadFieldOpen();
  const array = [];
  const countByType = {};
  if (lessorFields?.list.length > 0) {
    console.log("fields", lessorFields.list);
    lessorFields.list.forEach((item, index) => {
      mock?.chartOptions?.xaxis?.categories.push(item?.attributes?.type);
      console.log(`request${index}`, item?.attributes?.rent_requests?.data);
      item?.attributes?.rent_requests?.data.forEach((res) => {
        if (res?.attributes?.status_request === "Payed") {
          if (res.attributes.createdAt?.split("T")[0] === date) {
            console.log(item?.attributes?.type);
            array.push(item?.attributes?.type);
          }
        }
      });
    });
  }
  console.log(array);
  requestToDay.value = array.length;
  array.forEach((type) => {
    if (countByType[type]) {
      countByType[type] += 1;
    } else {
      countByType[type] = 1;
    }
  });
  const counts = Object.values(countByType);
  console.log("counts", counts);
  const body = {
    data: counts,
  };
  mock?.series.push(body);
});

const rent = {
  options: {
    chart: {
      id: "vuechart-example",
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
  },
  series: [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
    {
      name: "series-2",
      data: [20, 55, 50, 50, 49, 60, 70, 91],
    },
    {
      name: "series-2",
      data: [11, 54, 54, 40, 70, 46, 85, 100],
    },
  ],
};
const mock = reactive({
  series: [],
  chartOptions: {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [],
    },
  },
});
</script>
<template>
  <main>
    <LayoutLessor>
      <div class="pl-10 mt-10">
        <div class="flex-1 text-3xl text-center md:font-bold mb-4">
          หน้าแดชบอร์ด // {{ mock?.series }}
        </div>
        <div class="stats shadow w-full">
          <div class="stat">
            <div class="stat-figure text-secondary"></div>
            <div class="stat-title">รายได้</div>
            <div class="stat-value">฿{{ userRequest?.inComeMonthRequest }}</div>
            <div class="stat-desc">เดือน {{ thaiMonths[month] }}</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-secondary"></div>
            <div class="stat-title">การเช่า</div>
            <div class="stat-value">{{ requestToDay }}</div>
            <div class="stat-desc">วันนี้</div>
          </div>
          <div class="stat">
            <div class="stat-figure text-secondary"></div>
            <div class="stat-title">ขอยกเลิก</div>
            <div class="stat-value">{{ userRequest?.cancel.length }}</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-secondary"></div>
            <div class="stat-title">ผู้ใช้</div>
            <div class="stat-value">{{ userStore?.users.length }}</div>
          </div>
        </div>
        <div
          class="mt-10"
          v-if="mock?.chartOptions?.xaxis?.categories.length > 0"
        >
          <apexchart
            type="bar"
            height="350"
            :options="mock.chartOptions"
            :series="mock.series"
          ></apexchart>
        </div>
        <!-- <div>
          <apexchart
            type="bar"
            height="350"
            :options="rent.options"
            :series="rent.series"
          ></apexchart>
        </div> -->
      </div>
    </LayoutLessor>
  </main>
</template>
