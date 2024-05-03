<script setup>
import { useRouter, RouterLink } from "vue-router";
import { onMounted, reactive, ref, computed } from "vue";
import dayjs from "dayjs";
import layoutUser from "@/Layout/LayoutUser.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useEventStore } from "@/stores/event";
import { useAccountStore } from "@/stores/account";
import { useFieldStore } from "@/stores/Lessor/field";
import { useRequeststore } from "@/stores/user/create_request";

const userRequest = useRequeststore();
const userFields = useFieldStore();
const userStore = useAccountStore();
const eventStore = useEventStore();
const router = useRouter();

const checkUserData = ref(true);
const mode = ref("การเช่าแบบธรรมดา");
const date = ref(dayjs(""));
const formattedDate = ref(dayjs("").format("YYYY-MM-DD"));
const selection = ref([]);

const requestData = reactive({
  userId: null,
  tel: "",
  fieldId: null,
  name: "",
  dateRent: "",
  rentStartTime: "",
  rentEndTime: "",
  price: 1,
  hours: 0,
  matching: "",
  times: [],
  timeSlot: [],
  timeDisabled: [],
  checkDate: [],
  hoursFormat: 0,
  boxTime: [],
});

const priceshow = computed(() => {
  return userRequest?.request?.attributes?.price * requestData.hours;
});

const options = ref([
  {
    id: 1,
    time: "09:00:00",
    endTime: "09:30:00",
  },
  {
    id: 2,
    time: "09:30:00",
    endTime: "10:00:00",
  },
  {
    id: 3,
    time: "10:00:00",
    endTime: "10:30:00",
  },
  {
    id: 4,
    time: "10:30:00",
    endTime: "11:00:00",
  },
  {
    id: 5,
    time: "11:00:00",
    endTime: "11:30:00",
  },
  {
    id: 6,
    time: "11:30:00",
    endTime: "12:00:00",
  },
  {
    id: 7,
    time: "12:00:00",
    endTime: "12:30:00",
  },
  {
    id: 8,
    time: "12:30:00",
    endTime: "13:00:00",
  },
  {
    id: 9,
    time: "13:00:00",
    endTime: "13:30:00",
  },
  {
    id: 10,
    time: "13:30:00",
    endTime: "14:00:00",
  },
  {
    id: 11,
    time: "14:00:00",
    endTime: "14:30:00",
  },
  {
    id: 12,
    time: "14:30:00",
    endTime: "15:00:00",
  },
  {
    id: 13,
    time: "15:00:00",
    endTime: "15:30:00",
  },
  {
    id: 14,
    time: "15:30:00",
    endTime: "16:00:00",
  },
  {
    id: 15,
    time: "16:00:00",
    endTime: "16:30:00",
  },
  {
    id: 16,
    time: "16:30:00",
    endTime: "17:00:00",
  },
  {
    id: 17,
    time: "17:00:00",
    endTime: "17:30:00",
  },
  {
    id: 18,
    time: "17:30:00",
    endTime: "18:00:00",
  },
  {
    id: 19,
    time: "18:00:00",
    endTime: "18:30:00",
  },
  {
    id: 20,
    time: "18:30:00",
    endTime: "19:00:00",
  },
  {
    id: 21,
    time: "19:00:00",
    endTime: "19:30:00",
  },
  {
    id: 22,
    time: "19:30:00",
    endTime: "20:00:00",
  },
  {
    id: 23,
    time: "20:00:00",
    endTime: "20:30:00",
  },
  {
    id: 24,
    time: "20:30:00",
    endTime: "21:00:00",
  },
  {
    id: 25,
    time: "21:00:00",
    endTime: "21:30:00",
  },
  {
    id: 26,
    time: "21:30:00",
    endTime: "22:00:00",
  },
  {
    id: 27,
    time: "22:00:00",
    endTime: "22:30:00",
  },
  {
    id: 28,
    time: "22:30:00",
    endTime: "23:00:00",
  },
  {
    id: 29,
    time: "23:00:00",
    endTime: "23:30:00",
  },
  {
    id: 30,
    time: "23:30:00",
    endTime: "24:00:00",
  },
  // {
  //   id: 31,
  //   time: "24:00:00",
  //   endTime: "24:00:00",
  // },
]);

const hours = () => {
  const hour = Math.floor(requestData.hours);
  requestData.hoursFormat = hour;
  return Math.floor(requestData.hours);
};
const minutes = () => {
  return Math.round((requestData.hours - requestData.hoursFormat) * 60);
};

const onchang = () => {
  requestData.boxTime.length = 0;
  requestData.rentStartTime = null;
  requestData.rentEndTime = null;
  requestData.hours = null;
  selection.value.sort((a, b) => a.id - b.id);
  const firstTime = selection.value[0];
  const lastIndex = selection.value.length - 1;
  const lastTime = selection.value[lastIndex];

  if (selection.value.length === 1) {
    if (firstTime.id === 30) {
      selection.value.push(options.value[firstTime.id - 2]);
      selection.value.sort((a, b) => a.id - b.id);
      console.log("selection", selection.value);
      const lastIndex = selection.value.length - 1;
      const lastTime = selection.value[lastIndex];
      requestData.rentStartTime = firstTime.time;
      requestData.rentEndTime = lastTime.endTime;
      requestData.hours = selection.value.length / 2;
    } else {
      console.log(firstTime.id);
      selection.value.push(options.value[firstTime.id]);
      console.log("เลือกแล้ว === 1", selection.value);
      const lastIndex = selection.value.length - 1;
      const lastTime = selection.value[lastIndex];
      requestData.rentStartTime = firstTime.time;
      requestData.rentEndTime = lastTime.endTime;
      requestData.hours = selection.value.length / 2;
    }
  }
  if (selection.value.length > 1) {
    const arrayTime = [];
    console.log("เลือกแล้ว > 1", selection.value);
    const lastIndex = selection.value.length - 1;
    const lastTime = selection.value[lastIndex];
    const firstTime = selection.value[0];

    for (var i = firstTime.id; i <= lastTime.id; i++) {
      console.log(i);
      arrayTime.push(options.value[i - 1]);
    }
    console.log("arrayTime", arrayTime);
    selection.value = arrayTime;
    console.log("เลือกแล้ว FOR", selection.value);
    const timeDisabledValues = Object.values(requestData?.timeDisabled);
    console.log("DisabledValues", timeDisabledValues);
    selection.value.forEach((item) => {
      if (timeDisabledValues.includes(item?.id) === true) {
        console.log("disabled");
        selection.value.length = 0;
        requestData.rentStartTime = null;
        requestData.rentEndTime = null;
        requestData.hours = null;
      } else {
        console.log("สมาชิกครบ");
        console.log(selection.value);
        requestData.rentStartTime = firstTime.time;
        requestData.rentEndTime = lastTime.endTime;
        requestData.hours = selection.value.length / 2;
      }
    });
  }

  if (selection.value.length > 2) {
    requestData.boxTime.push(firstTime.id);
    requestData.boxTime.push(lastTime.id);
    console.log("boxTime", requestData.boxTime);
  }
  if (selection.value.length === 2) {
    const lastIndex2 = selection.value.length - 1;
    const lastTime2 = selection.value[lastIndex2];
    requestData.boxTime.push(firstTime.id);
    requestData.boxTime.push(lastTime2.id);
    console.log("boxTime", requestData.boxTime);
  }
  if (selection.value.length === 0) {
    requestData.rentStartTime = null;
    requestData.rentEndTime = null;
    requestData.hours = null;
    requestData.boxTime.length = 0;
  }
};

const formattedTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

function handleMouseMove(event) {
  const gridContainer = event.currentTarget;
  const scrollPosition =
    (event.clientY / gridContainer.offsetHeight) * gridContainer.scrollHeight;
  gridContainer.scrollTop = scrollPosition;
}

onMounted(async () => {
  const userData = localStorage.getItem("user-data");
  const adminData = localStorage.getItem("admin-data");
  if (userData) {
    checkUserData.value = true;
  } else if (adminData) {
    checkUserData.value = false;
  } else {
    checkUserData.value = false;
  }
  console.log(mode.value);
  await userFields.loadFieldOpen();
  console.log("field", userFields.listOpen);
  requestData.tel = userStore?.user?.user?.tel;
  requestData.userId = userStore?.user?.user?.id;
  requestData.name = userStore?.user?.user?.name;

  const gridContainer = document.querySelector(".drag-select");
  gridContainer.addEventListener("mousemove", handleMouseMove);
});
const handleChooseField = async (fieldId) => {
  //ล้างข้อมูล
  requestData.boxTime.length = 0;
  date.value = null;
  requestData.timeDisabled.length = 0;
  requestData.hours = 0;
  requestData.rentStartTime = null;
  requestData.rentEndTime = null;
  selection.value.length = 0;
  //ล้างข้อมูล
  await userRequest.getField(fieldId);
  console.log("request", userRequest);
  requestData.fieldId = userRequest.request.id;
  const arraycheckDayRent = [];
  const checkDayRent =
    userRequest?.request?.attributes?.rent_requests?.data?.filter((item) => {
      return (
        (item?.attributes?.type_request === "เช่าแบบเหมาวัน" &&
          item?.attributes?.status_request === "W") ||
        (item?.attributes?.type_request === "เช่าแบบเหมาวัน" &&
          item?.attributes?.status_request === "P")
      );
    });
  checkDayRent.map((item) => {
    arraycheckDayRent.push(item.attributes.date_range);
  });
  const allArraycheckDayRent = arraycheckDayRent.flat();
  const arrayCheckRents = [];
  console.log("arrayCheckRents", arrayCheckRents);
  console.log("allArraycheckDayRent", allArraycheckDayRent);

  allArraycheckDayRent.map((item) => {
    arrayCheckRents.push(item);
  });
  requestData.checkDate = arrayCheckRents;
  console.log("requestData.checkDate", requestData.checkDate);
};
const handleChooseDate = (date) => {
  //ล้างข้อมูล
  requestData.boxTime.length = 0;
  requestData.hours = 0;
  requestData.rentStartTime = null;
  requestData.rentEndTime = null;
  selection.value.length = 0;
  //ล้างข้อมูล
  console.log("Dayyyyyyyyyyyy", date);
  formattedDate.value = dayjs(date).format("YYYY-MM-DD");
  requestData.dateRent = formattedDate.value;
  console.log("chooseDate", requestData?.dateRent);
  const matchingRentDate =
    userRequest?.request?.attributes?.rent_requests?.data?.filter(
      (rentRequest) => {
        return (
          rentRequest?.attributes?.rent_date === requestData.dateRent &&
          (rentRequest?.attributes?.status_request === "I" ||
            rentRequest?.attributes?.status_request === "P" ||
            rentRequest?.attributes?.status_request === "W")
        );
      }
    );
  console.log("matching", matchingRentDate);
  const arrayTime = [];
  matchingRentDate.map((item) => {
    arrayTime.push(item?.attributes?.box_time);
  });

  requestData.times = arrayTime;

  console.log("Box-times", requestData.times);
  function getRange(proxyArray) {
    return Array.from(
      { length: proxyArray[1] - proxyArray[0] + 1 },
      (_, i) => proxyArray[0] + i
    );
  }
  const ranges = requestData.times.map((proxyArray) => getRange(proxyArray));
  const mergedArray = ranges.flat();
  console.log(mergedArray);
  requestData.timeDisabled = mergedArray;
  console.log("timeDisabled", requestData.timeDisabled);
};

const handleSubmit = async () => {
  requestData.price =
    userRequest?.request?.attributes?.price * requestData.hours;
  console.log("requestData", requestData);
  if (
    requestData.rentStartTime &&
    requestData.rentEndTime &&
    requestData.dateRent &&
    requestData.price != 1 &&
    requestData.rentStartTime != requestData.rentEndTime
  ) {
    await userRequest.addRequest(requestData);
    router.push("/request");
    console.log("ผ่านนนน");
  } else {
    console.log("ข้อมูลไม่ครบ");
    eventStore.popupMessage("info", "กรุณากรอกข้อมูลให้ครบถ้วน");
  }
};
</script>
<template>
  <main>
    <div v-if="checkUserData === false"></div>
    <layoutUser v-else>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-10xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="flex-1 text-2xl text-center md:font-bold">{{ mode }}</div>
          <div class="flex flex-col w-full mt-14">
            <div class="w-3/3 m-auto">
              <div class="label">
                <span class="label-text text-xl ml-10">สนาม</span>
              </div>
              <div
                class="grid container overflow-auto flex-nowrap space-x-10 w-3/4 m-auto"
              >
                <div class="flex flex-row gap-4">
                  <div
                    v-for="field in userFields.listOpen"
                    class="card w-60 bg-base-100 shadow-xl m-5"
                  >
                    <figure>
                      <img
                        :src="
                          'http://localhost:1337' +
                          field?.attributes?.img?.data?.attributes?.url
                        "
                        class="h-44"
                      />
                    </figure>

                    <div class="card-body">
                      <h4 class="card-title">
                        ราคา :{{ field?.attributes?.price }}/ ชม.
                      </h4>
                      <p>ประเภท :{{ field?.attributes?.type }}</p>

                      <div class="card-actions justify-end">
                        <button
                          :class="{
                            btn: true,
                            'btn-primary': requestData.fieldId === field.id,
                          }"
                          @click="handleChooseField(field.id)"
                        >
                          เลือก
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="label mt-10">
                <span class="label-text text-xl m-auto">วันเช่า</span>
              </div>
              <div class="w-4/4">
                <VueDatePicker
                  class="justify-center"
                  v-model="date"
                  format="dd/MM/yyyy"
                  locale="th"
                  @update:model-value="handleChooseDate(date)"
                  :disabled="!requestData.fieldId"
                  :min-date="new Date()"
                  :disabled-dates="requestData.checkDate"
                  :enable-time-picker="false"
                  :month-change-on-scroll="false"
                  hide-offset-dates
                  inline
                  auto-apply
                ></VueDatePicker>
              </div>

              <div class="label mt-10">
                <span class="label-text text-xl m-auto">เวลาเช่า</span>
              </div>
              <div
                class="card w-3/5 bg-secondary text-primary-content m-auto mt-5"
              >
                <div class="card-body">
                  <h2 class="card-title">แจ้งเตือน!</h2>
                  <p>
                    1.สามารถเอาเมาส์ลากเลือกเวลาได้ หรือกดเลือก 2
                    ครั้งในการเลือกเวลาเรื่มและเวลาจบ โดยจะต้องกด Sihft
                    ค้างแล้วกดที่เวลา<br />2.แล้วแต่กล่องเป็นเวลาละ 30นาที
                    มีเวลาเริ่มเวลาจบและไม่สามารถเลือกเวลาเช่าต่ำกว่า 1ชั่วโมง
                  </p>
                </div>
              </div>
              <div v-if="requestData.dateRent">
                <drag-select
                  v-model="selection"
                  @change="onchang()"
                  style="height: 170px; overflow-y: auto"
                  class="m-auto"
                >
                  <div class="flex flex-row gap-4">
                    <drag-select-option
                      v-for="item in options"
                      :value="item"
                      :key="item"
                      :disabled="requestData?.timeDisabled.includes(item.id)"
                    >
                      <div class="flex flex-col">
                        <span class="text-sm text-center"
                          >{{ formattedTime(item.time) }} น.</span
                        >
                        <span class="text-sm text-center">ถึง</span>
                        <span class="text-sm text-center"
                          >{{ formattedTime(item.endTime) }} น.</span
                        >
                      </div>
                    </drag-select-option>
                  </div>
                </drag-select>
              </div>
              <div v-else class="flex justify-center mt-4">
                <progress class="progress w-1/2"></progress>
              </div>
            </div>
          </div>
          <div
            class="card w-96 bg-primary text-primary-content mt-5 m-auto"
            v-if="requestData.fieldId"
          >
            <div class="card-body">
              <h2 class="card-title">เวลาทั้งหมด</h2>
              <div class="flex flex-col w-full lg:flex-row">
                <div
                  class="grid flex-grow h-10 card bg-base-300 rounded-box place-items-center"
                >
                  <span v-if="requestData.rentStartTime"
                    >{{
                      requestData.rentStartTime
                        ? formattedTime(requestData.rentStartTime)
                        : ""
                    }}
                    น.</span
                  >
                  <span v-else>-</span>
                </div>
                <div class="divider lg:divider-horizontal">ถึง</div>
                <div
                  class="grid flex-grow h-10 card bg-base-300 rounded-box place-items-center"
                >
                  <span v-if="requestData.rentEndTime"
                    >{{
                      requestData.rentStartTime
                        ? formattedTime(requestData.rentEndTime)
                        : ""
                    }}
                    น.</span
                  >
                  <span v-else>-</span>
                </div>
              </div>
              <h4 class="m-auto flex gap-1">
                ทั้งหมด
                <div
                  class="bg-base-300 rounded-box w-10 m-auto flex justify-center"
                >
                  {{ hours() }}
                </div>
                ชม.
                <span
                  class="bg-base-300 rounded-box w-10 m-auto flex justify-center"
                  >{{ minutes() }}</span
                >
                นาที
              </h4>
              <h2 class="card-title">ราคาทั้งหมด</h2>
              <input
                :value="priceshow"
                readonly
                class="input input-bordered w-full max-w-xs"
              />
              <p class="text-end">บาท.</p>
            </div>
          </div>
          <div></div>
          <div class="flex mt-16 w-2/4 m-auto justify-between">
            <button
              class="btn btn-neutral w-32"
              type="submit"
              @click="handleSubmit()"
            >
              ชำระเงิน
            </button>
            <RouterLink :to="{ name: 'request' }" class="btn btn-ghost w-32"
              >กลับไปที่คำร้อง</RouterLink
            >
          </div>
        </div>
      </div></layoutUser
    >
  </main>
</template>
<style>
.drag-select {
  display: grid;
  padding: 10px;
}
.drag-select__wrapper {
  width: 1100px;
  border: 0px solid #086f5a !important;
}

.drag-select__area {
  background: rgba(66, 153, 225, 0.5);
}
.drag-select-option {
  width: 100px;
  height: 100px;
  margin: auto;
  margin-bottom: 10px;
  color: #000;
  border-radius: 5px;
  border: 2px solid #000;

  display: flex;
  justify-content: center;
  align-items: center;
}

.drag-select-option--selected {
  color: #000000;
  background: #a5dd9b !important;
}
.drag-select-option--disabled {
  color: #000000;
  background: #f28585 !important;
}
.dp__cell_disabled {
  color: #f28585;
  font-weight: bold;
  cursor: not-allowed;
}
.dp__active_date {
  background: #a5dd9b;
  color: #000000;
  font-weight: bold;
}
.dp__today {
  border: 1px solid;
}
</style>
