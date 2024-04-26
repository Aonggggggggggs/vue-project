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

const checkUserData = ref(true);
const month = dayjs().get("month");
const date = dayjs().format("YYYY-MM-DD");
const requestToDay = ref(0);
const arrayRequestMonth = ref([]);
const chooseField = ref(null);
const getFieldId = ref([]);
const mode = ref("ทั้งหมด");
const toTalInCome = ref(0);
const arrayRentTotal = ref([]);
const requestToPay = ref(0);

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
  const userData = localStorage.getItem("user-data");
  const adminData = localStorage.getItem("admin-data");
  if (userData) {
    checkUserData.value = false;
  } else if (adminData) {
    checkUserData.value = true;
  } else {
    checkUserData.value = false;
  }
  await userStore.getUser();
  await userRequest.loadRequestCancel();
  await userRequest.inComeM();
  await lessorFields.loadFieldOpen();
  await lessorFields.loadField();

  const arrayFieldsID = [];
  const arrayRentToDay = [];
  const arrayInComeTotal = [];

  const data = await axios.get(
    "http://localhost:1337/api/rent-requests?filters[status_request][$eq]=I"
  );
  const request = data?.data?.data;
  let inComing = 0;
  if (request?.length > 0) {
    request.forEach((item) => {
      inComing += item.attributes?.price;
    });
  }
  requestToPay.value = inComing;

  if (lessorFields?.listOpen.length > 0) {
    lessorFields.list.forEach((item) => {
      rentToDay?.chartOptions?.xaxis?.categories.push(
        `สนามที่ :${item?.attributes.name}`
      );
      arrayFieldsID.push(item?.id);
    });
  }
  getFieldId.value = arrayFieldsID;
  for (i = 0; i < arrayFieldsID.length; i++) {
    const data = await axios.get(
      `http://localhost:1337/api/fields/${arrayFieldsID[i]}?&populate=*`
    );
    const fields = data.data.data;
    const checkRentToDay = fields?.attributes?.rent_requests?.data?.filter(
      (item) => {
        return (
          item?.attributes?.status_request === "P" ||
          (item?.attributes?.status_request === "W" &&
            item?.attributes?.createdAt?.split("T")[0] === date)
        );
      }
    );
    arrayRentToDay.push(checkRentToDay.length);
    const checkRentMonth = fields?.attributes?.rent_requests?.data?.filter(
      (item) => {
        return (
          item?.attributes?.status_request === "D" ||
          item?.attributes?.status_request === "W"
        );
      }
    );
    arrayRequestMonth.value.push(checkRentMonth);
    arrayInComeTotal.push(checkRentMonth);
    const checkCountRentMonth = fields?.attributes?.rent_requests?.data?.filter(
      (item) => {
        return (
          item?.attributes?.status_request === "P" ||
          item?.attributes?.status_request === "W"
        );
      }
    );
    arrayRentTotal.value.push(checkCountRentMonth);
  }
  console.log(arrayRentTotal.value);
  let inComeTotal = 0;
  const formattedTotal = arrayInComeTotal.flat();
  formattedTotal.forEach((item) => {
    inComeTotal += item.attributes.price;
  });
  toTalInCome.value = inComeTotal;
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
  const yearNow = dayjs().year();
  const monthlyPriceSums = Array(12).fill(0);
  const data = arrayRequestMonth.value.flat();
  data.forEach((item) => {
    const rentDate = item.attributes.rent_date;

    if (dayjs(rentDate).year() === yearNow) {
      const month = dayjs(rentDate).month();

      monthlyPriceSums[month] += item.attributes.price;
    }
  });

  return monthlyPriceSums;
};
const calculateMonthlyRentSums = () => {
  const yearNow = dayjs().year();
  const monthlyRentSums = Array(12).fill(0);
  const data = arrayRentTotal.value.flat();
  data.forEach((item) => {
    const rentDate = item?.attributes?.createdAt?.split("T")[0];

    if (dayjs(rentDate).year() === yearNow) {
      const month = dayjs(rentDate).month();

      monthlyRentSums[month] += 1;
    }
  });

  return monthlyRentSums;
};
const addData = () => {
  const body = {
    name: "รายได้",
    data: monthlyPriceSums,
  };
  const bodyMonth = {
    name: "จำนวนการเช่า",
    data: monthlyRentSums,
  };
  rent.series.push(body);
  rentToMonth.series.push(bodyMonth);
};
const total = async () => {
  chooseField.value = null;
  mode.value = "ทั้งหมด";
  arrayRequestMonth.value.length = 0;
  for (var i = 0; i < getFieldId.value.length; i++) {
    console.log(i);
    const data = await axios.get(
      `http://localhost:1337/api/fields/${getFieldId.value[i]}?&populate=*`
    );
    const fields = data.data.data;
    const checkRentMonth = fields?.attributes?.rent_requests?.data?.filter(
      (item) => {
        return (
          item?.attributes?.status_request === "D" ||
          item?.attributes?.status_request === "W"
        );
      }
    );
    arrayRequestMonth.value.push(checkRentMonth);
  }
};
const changeGraphField = async (id) => {
  mode.value = `${id}`;
  arrayRequestMonth.value.length = 0;
  chooseField.value = id;
  const data = await axios.get(
    `http://localhost:1337/api/fields/${id}?&populate=*`
  );
  const field = data.data.data;
  console.log("changeGraphField", field);
  const checkRentMonth = field?.attributes?.rent_requests?.data?.filter(
    (item) => {
      return (
        item?.attributes?.status_request === "D" ||
        item?.attributes?.status_request === "W"
      );
    }
  );
  console.log("checkRentMonth", checkRentMonth);
  arrayRequestMonth.value.push(checkRentMonth);
};

const monthlyPriceSums = computed(() => calculateMonthlyPriceSums());
const monthlyRentSums = computed(() => calculateMonthlyRentSums());
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
    plotOptions: {
      bar: {
        borderRadius: 4,
      },
    },
    title: {
      text: "รายได้ต่อเดือน",
      offsetX: 25,
      style: {
        fontSize: "18px",
        fontFamily: "Kanit",
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
const rentToMonth = reactive({
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
    plotOptions: {
      bar: {
        borderRadius: 4,
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
    fill: {
      colors: "#E67E22",
    },
    title: {
      text: "จำนวนการเช่าสนามต่อเดือน",
      offsetX: 25,
      style: {
        fontSize: "18px",
        fontFamily: "Kanit",
      },
    },
    xaxis: {
      labels: {
        style: {
          fontSize: "12px",
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
    title: {
      text: "จำนวนการเช่าสนามต่อวัน",
      offsetX: 25,
      style: {
        fontSize: "18px",
        fontFamily: "Kanit",
      },
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
    <div v-if="checkUserData === false"></div>
    <LayoutLessor v-else>
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
            <div class="stat-title">จำนวนการเช่า</div>
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
        <div class="flex-1 text-2xl text-start md:font-bold mt-10 mb-5">
          การเช่าสนาม
        </div>
        <div
          class="flex justify-between mt-2"
          v-if="rentToDay?.chartOptions?.xaxis?.categories.length > 0"
        >
          <div class="w-1/4">
            <apexchart
              type="bar"
              height="350"
              :options="rentToDay.chartOptions"
              :series="rentToDay.series"
            ></apexchart>
          </div>
          <div class="w-3/4">
            <apexchart
              type="bar"
              height="350"
              :options="rentToMonth.options"
              :series="rentToMonth.series"
            ></apexchart>
          </div>
        </div>
        <div>
          <div
            class="stats stats-vertical lg:stats-horizontal shadow mt-5 mb-2"
          >
            <div class="stat">
              <div class="stat-title">รายได้ทั้งหมด</div>
              <div class="stat-value">฿{{ toTalInCome }}</div>
              <div class="stat-desc">ทั้งหมด</div>
            </div>

            <div class="stat">
              <div class="stat-title">จำนวนสนามทั้งหมด</div>
              <div class="stat-value">{{ lessorFields?.list?.length }}</div>
            </div>

            <div class="stat">
              <div class="stat-title">จำนวนสนามที่ปิด</div>
              <div class="stat-value">
                {{ lessorFields?.list?.length - lessorFields?.listOpen.length }}
              </div>
            </div>
            <div class="stat">
              <div class="stat-title">เงินที่จะได้รับ</div>
              <div class="stat-value">฿{{ requestToPay }}</div>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <apexchart
            type="bar"
            height="350"
            :options="rent.options"
            :series="rent.series"
          ></apexchart>
        </div>
        <div class="flex justify-center">
          <div class="text-xl">เลือกสนามที่</div>
        </div>
        <div class="flex gap-4 justify-center mt-2 mb-10">
          <div
            :class="{
              btn: true,
              'btn-primary': mode === 'ทั้งหมด',
            }"
            @click="total()"
          >
            ทั้งหมด
          </div>
          <div
            v-for="(item, index) in lessorFields?.list"
            :class="{
              btn: true,
              'btn-primary': chooseField === item.id,
            }"
            @click="changeGraphField(item.id)"
          >
            {{ item?.attributes.name }}
          </div>
        </div>
      </div>
    </LayoutLessor>
  </main>
</template>
