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
});

const price = computed(() => {
  return userRequest?.request?.attributes?.price * requestData.hours;
});

const options = ref([
  {
    id: 1,
    time: "09:00:00",
  },
  {
    id: 2,
    time: "09:30:00",
  },
  {
    id: 3,
    time: "10:00:00",
  },
  {
    id: 4,
    time: "10:30:00",
  },
  {
    id: 5,
    time: "11:00:00",
  },
  {
    id: 6,
    time: "11:30:00",
  },
  {
    id: 7,
    time: "12:00:00",
  },
  {
    id: 8,
    time: "12:30:00",
  },
  {
    id: 9,
    time: "13:00:00",
  },
  {
    id: 10,
    time: "13:30:00",
  },
  {
    id: 11,
    time: "14:00:00",
  },
  {
    id: 12,
    time: "14:30:00",
  },
  {
    id: 13,
    time: "15:00:00",
  },
  {
    id: 14,
    time: "15:30:00",
  },
  {
    id: 15,
    time: "16:00:00",
  },
  {
    id: 16,
    time: "16:30:00",
  },
  {
    id: 17,
    time: "17:00:00",
  },
  {
    id: 18,
    time: "17:30:00",
  },
  {
    id: 19,
    time: "18:00:00",
  },
  {
    id: 20,
    time: "18:30:00",
  },
  {
    id: 21,
    time: "19:00:00",
  },
  {
    id: 22,
    time: "19:30:00",
  },
  {
    id: 23,
    time: "20:00:00",
  },
  {
    id: 24,
    time: "20:30:00",
  },
  {
    id: 25,
    time: "21:00:00",
  },
  {
    id: 26,
    time: "21:30:00",
  },
  {
    id: 27,
    time: "22:00:00",
  },
  {
    id: 28,
    time: "22:30:00",
  },
  {
    id: 29,
    time: "23:00:00",
  },
  {
    id: 30,
    time: "23:30:00",
  },
  {
    id: 31,
    time: "24:00:00",
  },
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
  requestData.rentStartTime = null;
  requestData.rentEndTime = null;
  requestData.hours = null;
  selection.value.sort((a, b) => a.id - b.id);
  const lastIndex = selection.value.length - 1;
  const firstTime = selection.value[0];
  const secondTime = selection.value[1];
  const lastTime = selection.value[lastIndex];
  if (selection.value.length > 0) {
    console.log("array time มีมากกว่า 0", selection.value);
    if (lastTime.id - firstTime.id > 1) {
      if (secondTime.id - firstTime.id === 1) {
        console.log("Drage ");
      } else {
        console.log("Loop ");

        console.log(selection.value);
        for (var i = firstTime.id + 1; i < lastTime.id; i++) {
          console.log(i);
          selection.value.push(options.value[i - 1]);
        }
      }
    }
  } else {
    selection.value.length = 0;
    requestData.rentStartTime = null;
    requestData.rentEndTime = null;
    requestData.hours = null;
    console.log("array time มีน้อยกว่า 0");
  }
  selection.value.sort((a, b) => a.id - b.id);
  console.log("time-range", selection.value);
  const arrayIdCheck = [];
  if (selection.value.length > 2) {
    for (var i = firstTime.id; i <= lastTime.id; i++) {
      arrayIdCheck.push(i);
    }
    const ids = new Set(selection.value.map((obj) => obj.id));
    console.log(arrayIdCheck);
    const allMembersExist = arrayIdCheck.every((id) => ids.has(id));

    if (allMembersExist === true) {
      const timeDisabledValues = Object.values(requestData?.timeDisabled);
      console.log("DisabledValues", timeDisabledValues);
      selection.value.forEach((item) => {
        console.log("item", item?.time);
        console.log(timeDisabledValues.includes(`${item?.time}`));
        if (timeDisabledValues.includes(`${item?.time}`) === true) {
          console.log("disabled");
          selection.value.length = 0;
          requestData.rentStartTime = null;
          requestData.rentEndTime = null;
          requestData.hours = null;
        } else {
          console.log("สมาชิกครบ");
          console.log(selection.value);
          requestData.rentStartTime = firstTime.time;
          requestData.rentEndTime = lastTime.time;
          requestData.hours = (selection.value.length - 1) / 2;
        }
      });
    } else {
      selection.value.length = 0;
      requestData.rentStartTime = null;
      requestData.rentEndTime = null;
      requestData.hours = null;
      console.log("สมาชิกไม่ครบ");
    }
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
    arrayTime.push(`${formattedTime(item.attributes.start_rent_time)}:00`);
    arrayTime.push(`${formattedTime(item.attributes.end_rent_time)}:00`);
  });

  requestData.times = arrayTime;

  console.log("times", requestData.times);

  isDisabled();
};

const isDisabled = () => {
  const arrayTime = [];
  while (requestData.times.length > 0) {
    const subArrayTime = [];
    // const subArrayTimeDisabled = [];
    requestData.times.map((item, index) => {
      if (index === 0 || index === 1) {
        subArrayTime.push(item);
        const dateObjects = subArrayTime.map(
          (time) => new Date(`1970-01-01T${time}Z`)
        );

        dateObjects.sort((a, b) => a - b);

        const newTimes = [];
        dateObjects.forEach((time, index, array) => {
          const formattedTime = time.toISOString().substr(11, 8);
          newTimes.push(formattedTime);
          if (index < array.length - 1) {
            const nextTime = new Date(array[index + 1]);
            while (time.getTime() < nextTime.getTime() - 30 * 60 * 1000) {
              time.setTime(time.getTime() + 30 * 60 * 1000);
              newTimes.push(time.toISOString().substr(11, 8));
            }
          }
        });
        console.log("timeSlot", newTimes);
        requestData.timeSlot = newTimes;
        requestData.timeSlot.map((item) => {
          arrayTime.push(item);
        });
        // console.log("subTimeDisable", subArrayTimeDisabled);
      }
    });
    requestData.times.splice(0, 2);
    console.log("timeSplice", requestData.times);
  }
  console.log("requestData.timeDisabled", requestData.timeDisabled);
  console.log("arrayTime", arrayTime);
  requestData.timeDisabled = arrayTime;
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
                  inline
                  auto-apply
                />
              </div>
              <div class="label mt-10">
                <span class="label-text text-xl m-auto">เวลาเช่า</span>
              </div>
              <span class="label-text text-sm"
                >แนะนำ : <br />สามารถเอาเมาส์ลากเลือกเวลาได้ หรือกดเลือก 2
                ครั้งในการเลือกเวลาเรื่มและเวลาจบ โดยจะต้องกด Sihft
                ค้างแล้วกดที่เวลา</span
              >

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
                      :disabled="requestData?.timeDisabled.includes(item.time)"
                    >
                      {{ formattedTime(item.time) }} น.
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
                disabled
                :placeholder="price"
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
</style>
