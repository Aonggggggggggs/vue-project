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

const mode = ref("การเช่าแบบธรรมดา");
const date = ref(dayjs(""));
const formattedDate = ref(dayjs("").format("YYYY-MM-DD"));
const selection = ref([]);
const check = ref(false);

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
});

const isValidName = computed(() => {
  return check.value ? /^(?=.*[ก-ฮ]).{5,}$/.test(requestData.name) : null;
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
//
const onchang = () => {
  if (selection.value.length > 0) {
    console.log("arrayTime", selection.value);
    const lastTime = selection.value.length - 1;
    console.log("firstTime", selection.value[0]);
    console.log("lastTime", selection.value[lastTime]);
    //หาเวลาระหว่างกลาง
    if (
      selection.value[lastTime].id - selection.value[0].id + 1 !=
      selection.value.length
    ) {
      console.log("หาเวลาระหว่างกลาง");
      for (
        var i = selection.value[0].id + 1;
        i < selection.value[lastTime].id;
        i++
      ) {
        console.log(i);
        selection.value.push(options.value[i - 1]);
      }
    }
    //หาเวลาระหว่างกลาง
    //กรณี เวลาจบ > เริ่ม
    if (selection.value[0].id > selection.value[lastTime].id) {
      console.log("กรณี เวลาจบ > เริ่ม");
      console.log(selection.value);
      for (
        var i = selection.value[lastTime].id + 1;
        i < selection.value[0].id;
        i++
      ) {
        console.log(i);
        selection.value.push(options.value[i - 1]);
      }
      if (
        selection.value[0].id - selection.value[lastTime].id ===
        selection.value.length - 1
      ) {
        requestData.rentStartTime = selection.value[lastTime].time;
        requestData.rentEndTime = selection.value[0].time;
        requestData.hours = (selection.value.length - 1) / 2;
        //disable
        const timeDisabledValues = Object.values(requestData?.timeDisabled);
        selection.value.forEach((item, index) => {
          console.log("item", item?.time);
          console.log("กรณี เวลาจบ > เริ่ม",timeDisabledValues.includes(`${item?.time}`));
          console.log(requestData?.timeDisabled[index]);
          if (timeDisabledValues.includes(`${item?.time}`) === true) {
            console.log("disabled");
            selection.value.length = 0;
            requestData.rentStartTime = null;
            requestData.rentEndTime = null;
            requestData.hours = null;
          }
        });
        //disable
      } else {
        selection.value.length = 0;
        requestData.rentStartTime = null;
        requestData.rentEndTime = null;
        requestData.hours = null;
      }
      //กรณี เวลาจบ > เริ่ม
    } else {
      if (selection.value[0].id != selection.value[lastTime].id) {
        console.log("เริ่ม != จบ");
        console.log("selection", selection.value);
        requestData.rentStartTime = selection.value[0].time;
        requestData.rentEndTime = selection.value[lastTime].time;
        requestData.hours = (selection.value.length - 1) / 2;
        if (selection.value[1].id > selection.value[lastTime].id) {
          selection.value.length = 0;
          requestData.rentStartTime = null;
          requestData.rentEndTime = null;
          requestData.hours = null;
        }
        //disable
        const timeDisabledValues = Object.values(requestData?.timeDisabled);
        selection.value.forEach((item, index) => {
          console.log("เริ่ม != จบ",timeDisabledValues.includes(`${item?.time}`));
          console.log(requestData?.timeDisabled[index]);
          if (timeDisabledValues.includes(`${item?.time}`) === true) {
            selection.value.length = 0;
            requestData.rentStartTime = null;
            requestData.rentEndTime = null;
            requestData.hours = null;
          }
        });
        //disable
      } else {
        requestData.rentStartTime = null;
        requestData.rentEndTime = null;
        requestData.hours = null;
      }
    }
  } else {
    requestData.rentStartTime = null;
    requestData.rentEndTime = null;
    requestData.hours = null;
  }
};
//
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
  console.log(mode.value);
  await userFields.loadFieldOpen();
  console.log("field", userFields.listOpen);
  requestData.tel = userStore?.user?.user?.tel;
  requestData.userId = userStore?.user?.user?.id;

  const gridContainer = document.querySelector(".drag-select");
  gridContainer.addEventListener("mousemove", handleMouseMove);
});
const handleChooseField = async (fieldId) => {
  //ล้างข้อมูล
  date.value = null;
  requestData.timeDisabled.length = 0;
  //ล้างข้อมูล
  await userRequest.getField(fieldId);
  console.log("request", userRequest);
  requestData.fieldId = userRequest.request.id;
  const arraycheckDayRent = [];
  const checkDayRent =
    userRequest?.request?.attributes?.rent_requests?.data?.filter((item) => {
      return (
        item?.attributes?.type_request === "เช่าแบบเหมาวัน" &&
        item?.attributes?.status_request === "Payed"
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
  console.log("Dayyyyyyyyyyyy", date);
  formattedDate.value = dayjs(date).format("YYYY-MM-DD");
  requestData.dateRent = formattedDate.value;
  console.log("chooseDate", requestData?.dateRent);
  const matchingRentDate =
    userRequest?.request?.attributes?.rent_requests?.data?.filter(
      (rentRequest) => {
        return (
          rentRequest?.attributes?.rent_date === requestData.dateRent &&
          (rentRequest?.attributes?.status_request === "In Progress" ||
            rentRequest?.attributes?.status_request === "Payed")
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
    const subArrayTimeDisabled = [];
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
        console.log("subTimeDisable", subArrayTimeDisabled);
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
  check.value = true;
  requestData.price =
    userRequest?.request?.attributes?.price * requestData.hours;
  console.log("requestData", requestData);
  if (
    isValidName.value == true &&
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
    <layoutUser>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-10xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="flex-1 text-2xl text-center md:font-bold">{{ mode }}</div>
          <div class="flex flex-col w-full mt-14">
            <div class="w-3/3 m-auto">
              <div class="label mt-10">
                <span class="label-text text-xl ml-10">ชื่อจริง-นามสกุล</span>
              </div>
              <div class="label">
                <span v-if="isValidName == false" class="text-xs ml-40"
                  >กรอกชื่อให้ถูกต้อง</span
                >
              </div>
              <input
                type="text"
                placeholder=""
                class="input input-bordered ml-10"
                v-model="requestData.name"
              />
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

              <div>
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
            </div>
          </div>
          <div
            class="card w-96 bg-primary text-primary-content mt-5 m-auto"
            v-if="requestData.rentStartTime && requestData.rentEndTime"
          >
            <div class="card-body">
              <h2 class="card-title">เวลาทั้งหมด</h2>
              <div class="flex flex-col w-full lg:flex-row">
                <div
                  class="grid flex-grow h-10 card bg-base-300 rounded-box place-items-center"
                >
                  {{
                    requestData.rentStartTime
                      ? formattedTime(requestData.rentStartTime)
                      : ""
                  }}
                  น.
                </div>
                <div class="divider lg:divider-horizontal">ถึง</div>
                <div
                  class="grid flex-grow h-10 card bg-base-300 rounded-box place-items-center"
                >
                  {{
                    requestData.rentEndTime
                      ? formattedTime(requestData.rentEndTime)
                      : ""
                  }}
                  น.
                </div>
              </div>
              <h4 class="m-auto flex gap-1">
                ทั้งหมด
                <div
                  class="bg-base-300 rounded-box w-10 m-auto flex justify-center"
                >
                  {{ requestData.hours }}
                </div>
                ชม.
              </h4>
              <h2 class="card-title">ราคาทั้งหมด</h2>
              <input
                disabled
                :placeholder="
                  userRequest?.request?.attributes?.price * requestData.hours
                "
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
              >กลับไปห้อง</RouterLink
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
