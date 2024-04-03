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

const date = ref(dayjs(""));
const formattedDate = ref(dayjs("").format("YYYY-MM-DD"));
const selection = ref([]);
const drageDate = ref([]);
const formatDrageDate = ref([]);
const check = ref(false);

const requestData = reactive({
  userId: null,
  tel: "",
  fieldId: null,
  name: "",
  // dateRent: "",
  // rentStartTime: "",
  // rentEndTime: "",
  // price: 1,
  days: 0,
  // matching: "",
  // times: [],
  // timeSlot: [],
  // timeDisabled: [],
  checkDate: [],
});

const isValidName = computed(() => {
  return check.value ? /^(?=.*[ก-ฮ]).{5,}$/.test(requestData.name) : null;
});

// const formattedTime = (time) => {
//   const [hours, minutes] = time.split(":");
//   return `${hours}:${minutes}`;
// };

// function handleMouseMove(event) {
//   const gridContainer = event.currentTarget;
//   const scrollPosition =
//     (event.clientY / gridContainer.offsetHeight) * gridContainer.scrollHeight;
//   gridContainer.scrollTop = scrollPosition;
// }

onMounted(async () => {
  await userFields.loadFieldOpen();
  console.log("field", userFields.list);
  requestData.tel = userStore?.user?.user?.tel;
  requestData.userId = userStore?.user?.user?.id;
});

const handleChooseField = async (fieldId) => {
  await userRequest.getField(fieldId);
  console.log("request", userRequest);
  requestData.fieldId = userRequest.request.id;
  const checkRents =
    userRequest?.request?.attributes?.rent_requests?.data?.filter((item) => {
      return (
        item?.attributes?.status_request === "Payed" ||
        item?.attributes?.status_request === "RPayed"
      );
    });
  const arraycheckDayRent = [];
  const checkDayRent =
    userRequest?.request?.attributes?.rent_requests?.data?.filter((item) => {
      return item?.attributes?.status_request === "DPayed";
    });
  checkDayRent.map((item) => {
    arraycheckDayRent.push(item.attributes.date_range);
  });
  const allArraycheckDayRent = arraycheckDayRent.flat();
  const arrayCheckRents = [];
  checkRents.map((item) => {
    arrayCheckRents.push(item.attributes.rent_date);
  });
  console.log("arrayCheckRents", arrayCheckRents);
  console.log("allArraycheckDayRent", allArraycheckDayRent);

  allArraycheckDayRent.map((item) => {
    arrayCheckRents.push(item);
  });
  requestData.checkDate = arrayCheckRents;
  console.log("requestData.checkDate", requestData.checkDate);
};
// const handleChooseDate = (date) => {
//   console.log("Dayyyyyyyyyyyy", date);
//   formattedDate.value = dayjs(date).format("YYYY-MM-DD");
//   requestData.dateRent = formattedDate.value;
//   console.log("chooseDate", requestData?.dateRent);
//   const matchingRentDate =
//     userRequest?.request?.attributes?.rent_requests?.data?.filter(
//       (rentRequest) => {
//         return (
//           rentRequest?.attributes?.rent_date === requestData.dateRent &&
//           rentRequest?.attributes?.status_request === "Payed"
//         );
//       }
//     );
//   console.log("matching", matchingRentDate);
//   const arrayTime = [];
//   matchingRentDate.map((item) => {
//     arrayTime.push(`${formattedTime(item.attributes.start_rent_time)}:00`);
//     arrayTime.push(`${formattedTime(item.attributes.end_rent_time)}:00`);
//   });

//   requestData.times = arrayTime;

//   console.log("times", requestData.times);

//   isDisabled();
// };
const handleChooseDayRent = () => {
  requestData.arrayDrageDate = drageDate;
  formatDrageDate.value = requestData.arrayDrageDate.map((date) => {
    return dayjs(date).format("YYYY-MM-DD");
  });
};
const handleCountsDay = (drageDate) => {
  console.log(drageDate.length);
  requestData.days = drageDate.length;
};
// const isDisabled = () => {
//   const arrayTime = [];
//   while (requestData.times.length > 0) {
//     const subArrayTime = [];
//     const subArrayTimeDisabled = [];
//     requestData.times.map((item, index) => {
//       if (index === 0 || index === 1) {
//         subArrayTime.push(item);
//         const dateObjects = subArrayTime.map(
//           (time) => new Date(`1970-01-01T${time}Z`)
//         );

//         dateObjects.sort((a, b) => a - b);

//         const newTimes = [];
//         dateObjects.forEach((time, index, array) => {
//           const formattedTime = time.toISOString().substr(11, 8);
//           newTimes.push(formattedTime);
//           if (index < array.length - 1) {
//             const nextTime = new Date(array[index + 1]);
//             while (time.getTime() < nextTime.getTime() - 30 * 60 * 1000) {
//               time.setTime(time.getTime() + 30 * 60 * 1000);
//               newTimes.push(time.toISOString().substr(11, 8));
//             }
//           }
//         });
//         console.log("timeSlot", newTimes);
//         requestData.timeSlot = newTimes;
//         requestData.timeSlot.map((item) => {
//           arrayTime.push(item);
//         });
//         console.log("subTimeDisable", subArrayTimeDisabled);
//       }
//     });
//     requestData.times.splice(0, 2);
//     console.log("timeSplice", requestData.times);
//   }
//   console.log("requestData.timeDisabled", requestData.timeDisabled);
//   console.log("arrayTime", arrayTime);
//   requestData.timeDisabled = arrayTime;
// };

const handleSubmit = async () => {
  console.log("submit");
  handleChooseDayRent();
  check.value = true;
  // requestData.price =
  //   userRequest?.request?.attributes?.price * requestData.days;
  // console.log("requestData", requestData);
  // if (
  //   isValidName.value == true &&
  //   requestData.rentStartTime &&
  //   requestData.rentEndTime &&
  //   requestData.dateRent &&
  //   requestData.price != 1 &&
  //   requestData.rentStartTime != requestData.rentEndTime
  // ) {
  //   await userRequest.addRequest(requestData);
  //   router.push("/request");
  // } else {
  //   console.log("ข้อมูลไม่ครบ");
  //   eventStore.popupMessage("error", "ข้อมูลไม่ครบ");
  // }
};
</script>
<template>
  <main>
    <layoutUser>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-10xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="flex-1 text-2xl text-center md:font-bold">
            การเช่าเหมาวัน
          </div>
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
                    v-for="field in userFields.list"
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
                <span class="label-text text-xl ml-10">วันเช่า</span>
              </div>
              <div class="w-4/4 ml-10">
                {{ drageDate }}
                <VueDatePicker
                  format="dd/MM/yyyy"
                  locale="th"
                  v-model="drageDate"
                  :disabled="!requestData.fieldId"
                  multi-dates
                  multi-dates-limit="10"
                  :min-date="new Date()"
                  @update:model-value="handleCountsDay(drageDate)"
                  :disabled-dates="requestData.checkDate"
                />
                {{ formatDrageDate }}
              </div>
            </div>
          </div>
          <div class="card w-96 bg-primary text-primary-content mt-5 m-auto">
            <div v-if="requestData.fieldId" class="card-body">
              <h2 class="card-title">ราคาทั้งหมด</h2>
              <input
                disabled
                :placeholder="
                  userRequest?.request?.attributes?.price * requestData.days
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
              ยืนยัน
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
