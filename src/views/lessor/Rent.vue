<script setup>
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import { useAccountStore } from "@/stores/account";
import { useRequeststore } from "@/stores/user/create_request";
import { useFieldStore } from "@/stores/Lessor/field";
import { ref, reactive, onMounted } from "vue";
import dayjs from "dayjs";
import axios from "axios";

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
  const arrayFieldsID = [];
  const arrayRentToDay = [];
  if (lessorFields?.list.length > 0) {
    console.log("fields", lessorFields.list);
    lessorFields.list.forEach((item, index) => {
      rentToDay?.chartOptions?.xaxis?.categories.push(
        `สนามที่${index + 1} ${item?.attributes?.type}`
      );
      arrayFieldsID.push(item?.id);
      console.log(`request${index}`, item?.attributes?.rent_requests?.data);
    });
  }
  for (i = 0; i < arrayFieldsID.length; i++) {
    const data = await axios.get(
      `http://localhost:1337/api/fields/${arrayFieldsID[i]}?&populate=*`
    );
    const fields = data.data.data;
    const checkRentToDay = fields?.attributes?.rent_requests?.data?.filter(
      (item) => {
        return (
          item?.attributes?.status_request === "Payed" &&
          item?.attributes?.createdAt?.split("T")[0] === date
        );
      }
    );
    console.log(checkRentToDay.length);
    arrayRentToDay.push(checkRentToDay.length);
  }
  const body = {
    data: arrayRentToDay,
  };
  rentToDay?.series.push(body);
  for (var i = 0; i < arrayRentToDay.length; i++) {
    requestToDay.value += arrayRentToDay[i];
  }
});

const rent = {
  options: {
    chart: {
      id: "vuechart-example",
    },
    xaxis: {
      categories: [
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
      ],
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
const rentToDay = reactive({
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
    yaxis: {
      labels: {
        style: {
          fontSize: "15px",
        },
      },
    },
  },
});
</script>
<template>
  <main>
    <LayoutLessor>
      <div class="pl-10 mt-10">
        <div class="flex-1 text-3xl text-center md:font-bold mb-4">
          หน้าแดชบอร์ด
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
        <div class="flex-1 text-2xl text-start md:font-bold mt-10">
          การเช่าสนามแต่ละสนามในวันนี้
        </div>
        <div
          class="mt-2"
          v-if="rentToDay?.chartOptions?.xaxis?.categories.length > 0"
        >
          <apexchart
            type="bar"
            height="350"
            :options="rentToDay.chartOptions"
            :series="rentToDay.series"
            class="text-sm"
          ></apexchart>
        </div>
        <div class="flex-1 text-2xl text-start md:font-bold mt-10">
          รายรับแต่ละเดือนแต่ละสนาม
        </div>
        <div class="mt-2">
          <apexchart
            type="bar"
            height="350"
            :options="rent.options"
            :series="rent.series"
          ></apexchart>
        </div>
      </div>
    </LayoutLessor>
  </main>
</template>
