<script setup>
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import { useAccountStore } from "@/stores/account";
import { useRequeststore } from "@/stores/user/create_request";
import { useFieldStore } from "@/stores/Lessor/field";
import { ref, reactive, onMounted, computed } from "vue";
import dayjs from "dayjs";
import axios from "axios";

const userStore = useAccountStore();
const userRequest = useRequeststore();
const lessorFields = useFieldStore();

const month = dayjs().get("month");
const date = dayjs().format("YYYY-MM-DD");
const requestToDay = ref(0);
const arrayRequestMonth = ref([]);

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
    lessorFields.list.forEach((item, index) => {
      rentToDay?.chartOptions?.xaxis?.categories.push(`สนามที่${index + 1}`);
      arrayFieldsID.push(item?.id);
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
    arrayRentToDay.push(checkRentToDay.length);
    const checkRentMonth = fields?.attributes?.rent_requests?.data?.filter(
      (item) => {
        return item?.attributes?.status_request === "Done";
      }
    );
    arrayRequestMonth.value.push(checkRentMonth);
  }
  console.log("arrayRequestMonth", arrayRequestMonth.value);

  const body = {
    name: "จำนวนการเช่า",
    data: arrayRentToDay,
  };
  rentToDay?.series.push(body);
  for (var i = 0; i < arrayRentToDay.length; i++) {
    requestToDay.value += arrayRentToDay[i];
  }
  addData();
});
const calculateMonthlyPriceSums = () => {
  const monthlyPriceSums = Array(12).fill(0);
  const data = arrayRequestMonth.value.flat();
  data.forEach((item) => {
    const rentDate = item.attributes.rent_date;

    if (rentDate) {
      const month = dayjs(rentDate).month();

      monthlyPriceSums[month] += item.attributes.price;
    }
  });

  return monthlyPriceSums;
};
const addData = () => {
  const body = {
    name: "รายได้",
    data: monthlyPriceSums,
  };
  rent.series.push(body);
};
const monthlyPriceSums = computed(() => calculateMonthlyPriceSums());
const rent = reactive({
  options: {
    chart: {
      id: "vuechart-example",
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "15px",
        fontFamily: "Kanit",
        colors: ["#F4F6F7"],
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "15px",
          fontFamily: "Kanit",
        },
      },
    },
    xaxis: {
      labels: {
        style: {
          fontSize: "15px",
          fontFamily: "Kanit",
        },
      },
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
  series: [],
});
const rentToDay = reactive({
  series: [],
  chartOptions: {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          fontSize: "10px",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "15px",
        fontFamily: "Kanit",
        colors: ["#F4F6F7"],
      },
    },
    fill: {
      colors: "#2ECC71",
    },
    yaxis: {
      labels: {
        maxWidth: 100,
        style: {
          fontSize: "15px",
          fontFamily: "Kanit",
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
          แดชบอร์ด
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
          class="flex justify-between mt-2"
          v-if="rentToDay?.chartOptions?.xaxis?.categories.length > 0"
        >
          <div class="w-1/2">
            <apexchart
              type="bar"
              height="350"
              :options="rentToDay.chartOptions"
              :series="rentToDay.series"
            ></apexchart>
          </div>
          <div class="w-1/2">
            <div class="stats stats-vertical shadow ml-10">
              <div class="stat">
                <div class="stat-title">Downloads</div>
                <div class="stat-value">54K</div>
                <div class="stat-desc">MOCKไปก่อน</div>
              </div>

              <div class="stat">
                <div class="stat-title">New Users</div>
                <div class="stat-value">20</div>
                <div class="stat-desc">MOCKไปก่อน</div>
              </div>

              <div class="stat">
                <div class="stat-title">New Registers</div>
                <div class="stat-value">10</div>
                <div class="stat-desc">MOCKไปก่อน</div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-1 text-2xl text-start md:font-bold mt-10">
          รายได้แต่ละเดือน
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
