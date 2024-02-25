<script setup>
import { useRouter, useRoute, RouterLink } from "vue-router";
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

const date = ref(dayjs(""));
const formattedDate = ref(dayjs("").format("YYYY-MM-DD"));

const selectedOptions = ref([]);
const requestData = reactive({
  userId: null,
  fieldId: null,
  dateRent: "",
  rentStartTime: "",
  rentEndTime: "",
  price: 1,
  hours: 0,
});

const options = ref([
  { id: 1, time: "06:00:00" },
  {
    id: 2,
    time: "06:30:00",
  },
  {
    id: 3,
    time: "07:00:00",
  },
  {
    id: 4,
    time: "07:30:00",
  },
  {
    id: 5,
    time: "08:00:00",
  },
  {
    id: 6,
    time: "08:30:00",
  },
  {
    id: 7,
    time: "09:00:00",
  },
  {
    id: 8,
    time: "09:30:00",
  },
  {
    id: 9,
    time: "10:00:00",
  },
  {
    id: 10,
    time: "10:30:00",
  },
  {
    id: 11,
    time: "11:00:00",
  },
  {
    id: 12,
    time: "11:30:00",
  },
  {
    id: 13,
    time: "12:00:00",
  },
  {
    id: 14,
    time: "12:30:00",
  },
  {
    id: 15,
    time: "13:30:00",
  },
  {
    id: 16,
    time: "14:00:00",
  },
  {
    id: 17,
    time: "14:30:00",
  },
  {
    id: 18,
    time: "15:00:00",
  },
  {
    id: 19,
    time: "15:30:00",
  },
  {
    id: 20,
    time: "16:00:00",
  },
  {
    id: 21,
    time: "16:30:00",
  },
  {
    id: 22,
    time: "17:00:00",
  },
  {
    id: 23,
    time: "17:30:00",
  },
  {
    id: 24,
    time: "18:00:00",
  },
  {
    id: 25,
    time: "18:30:00",
  },
  {
    id: 26,
    time: "19:00:00",
  },
  {
    id: 27,
    time: "19:30:00",
  },
  {
    id: 28,
    time: "20:00:00",
  },
  {
    id: 29,
    time: "20:30:00",
  },
  {
    id: 30,
    time: "21:00:00",
  },
  {
    id: 31,
    time: "21:30:00",
  },
  {
    id: 32,
    time: "22:00:00",
  },
  {
    id: 33,
    time: "22:30:00",
  },
  {
    id: 34,
    time: "23:00:00",
  },
  {
    id: 35,
    time: "23:30:00",
  },
  {
    id: 36,
    time: "24:00:00",
  },
]);

const formattedTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};

const getSelectedValues = () => {
  if (selectedOptions.value.length > 1) {
    const lastTime = selectedOptions.value.length - 1;
    const firstId = selectedOptions.value[0].id;
    if (firstId + lastTime == selectedOptions.value[lastTime].id) {
      console.log((selectedOptions.value.length - 1) / 2);
      console.log("Rang Time", selectedOptions.value);
      console.log("Selected Start:", selectedOptions.value[0].time);
      console.log("Selected End:", selectedOptions.value[lastTime].time);
      requestData.rentStartTime = selectedOptions.value[0].time;
      requestData.rentEndTime = selectedOptions.value[lastTime].time;
      requestData.hours = (selectedOptions.value.length - 1) / 2;
    } else {
      eventStore.popupMessage("error", "กรุณาเรียงเวลาเช่าให้ถูกต้อง");
    }
  } else {
    eventStore.popupMessage("error", "กรุณาเลือกเวลาเช่าสิ้นสุด");
  }
};

onMounted(async () => {
  await userFields.loadField();
  console.log("field", userFields.list);
  requestData.userId = userStore?.user?.user?.id;
});
const handleChooseField = async (fieldId) => {
  await userRequest.getField(fieldId);
  console.log("request", userRequest);
  requestData.fieldId = userRequest.request.id;
};
const handleChooseDate = (date) => {
  formattedDate.value = dayjs(date).format("YYYY-MM-DD");
  requestData.dateRent = formattedDate.value;
  console.log("chooseDate", requestData.dateRent);
};
const handleSubmit = async () => {
  requestData.price =
    userRequest?.request?.attributes?.price * requestData.hours;
  console.log("requestData", requestData);
  if (
    requestData.rentStartTime &&
    requestData.rentEndTime &&
    requestData.dateRent &&
    requestData.price != 1
  ) {
    await userRequest.addRequest(requestData);
  } else {
    console.log("ข้อมูลไม่ครบ");
    eventStore.popupMessage("error", "ข้อมูลไม่ครบ");
  }
};
</script>
<template>
  <main>
    <layoutUser>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-10xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="flex-1 text-2xl text-center md:font-bold">สร้างห้อง</div>
          <div class="flex flex-col w-full mt-14">
            <div class="w-3/3 m-auto">
              <div class="label">
                <span class="label-text">สนาม</span>
              </div>
              <div
                class="grid container overflow-auto flex-nowrap space-x-10 w-3/4 m-auto"
              >
                <div class="flex flex-row gap-4">
                  <div
                    v-for="field in userFields.list"
                    class="card w-60 bg-base-100 shadow-xl"
                  >
                    <figure>
                      <img
                        :src="
                          'http://localhost:1337' +
                          field.attributes.img.data.attributes.url
                        "
                        class="h-44"
                      />
                    </figure>

                    <div class="card-body">
                      <h4 class="card-title">
                        ราคา :{{ field.attributes.price }}/ ชม.
                      </h4>
                      <p>ประเภท :{{ field.attributes.type }}</p>
                      <!-- <p>
                        เวลาที่ให้บริการ :{{ field.attributes.time_start }}น. -
                        {{ field.attributes.time_end }}น.
                      </p> -->

                      <div class="card-actions justify-end">
                        <button
                          class="btn btn-primary"
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
                <span class="label-text">วันเช่า</span>
              </div>
              <div class="w-1/4 ml-10">
                <VueDatePicker
                  v-model="date"
                  format="yyyy-MM-dd"
                  @update:model-value="handleChooseDate(date)"
                />
              </div>
              <div class="label mt-10">
                <span class="label-text">เวลาเช่า</span>
              </div>
              <div class="grid grid-cols-18 gap-1">
                <label
                  v-for="option in options"
                  :key="option.id"
                  class="flex items-center"
                >
                  <input
                    type="checkbox"
                    v-model="selectedOptions"
                    :value="option"
                    class="checkbox checkbox-secondary checkbox-xs"
                    :disabled="['06:00:00', '06:30:00'].includes(option.time)"
                  />
                  <p>{{ formattedTime(option.time) }} น.</p>
                </label>
              </div>
            </div>
            <button
              @click="getSelectedValues"
              class="btn btn-active btn-accent btn-primary w-32 m-auto mt-4"
            >
              ยืนยันเวลาเช่า
            </button>
          </div>
          <div
            class="card w-96 bg-primary text-primary-content mt-5 m-auto"
            v-if="userRequest?.request?.attributes?.price"
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
          <div class="flex mt-16 w-2/4 m-auto justify-between">
            <button
              class="btn btn-neutral w-32"
              type="submit"
              @click="handleSubmit()"
            >
              ยืนยัน
            </button>
            <RouterLink :to="{ name: 'room' }" class="btn btn-ghost w-32"
              >กลับไปห้อง</RouterLink
            >
          </div>
        </div>
      </div></layoutUser
    >
  </main>
</template>
