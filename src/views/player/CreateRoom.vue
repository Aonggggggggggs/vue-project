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

const startTime = ref("");
const endTime = ref("");
const requestData = reactive({
  userId: null,
  fieldId: null,
  dateRent: "",
  rentStartTime: "",
  rentEndTime: "",
  price: 1,
});

const pad = (num) => (num < 10 ? `0${num}` : `${num}`);

const formattedTime = computed(() => {
  const { hours, minutes, seconds } = startTime.value;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
});
const formattedEndTime = computed(() => {
  const { hours, minutes, seconds } = endTime.value;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
});

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
  requestData.rentStartTime = formattedTime.value;
  requestData.rentEndTime = formattedEndTime.value;
  requestData.price = userRequest?.request?.attributes?.price * 3;
  console.log("requestData", requestData);
  if (
    requestData.rentStartTime != "undefined:undefined:undefined" &&
    requestData.rentEndTime != "undefined:undefined:undefined" &&
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
                      <p>
                        เวลาที่ให้บริการ :{{ field.attributes.time_start }}น. -
                        {{ field.attributes.time_end }}น.
                      </p>

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
              {{ formattedDate }}
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
              <div class="flex w-2/4 ml-10">
                <div
                  class="grid h-20 flex-grow card rounded-box place-items-center"
                >
                  {{ formattedTime }}

                  <VueDatePicker v-model="startTime" time-picker />
                </div>
                <div class="divider divider-horizontal">ถึง</div>
                <div
                  class="grid h-20 flex-grow card rounded-box place-items-center"
                >
                  {{ formattedEndTime }}
                  <VueDatePicker v-model="endTime" time-picker></VueDatePicker>
                </div>
              </div>
              <div
                class="card w-96 bg-primary text-primary-content mt-10"
                v-if="userRequest?.request?.attributes?.price"
              >
                <div class="card-body">
                  <h2 class="card-title">ราคาทั้งหมด</h2>
                  <input
                    disabled
                    :placeholder="userRequest?.request?.attributes?.price * 3"
                    class="input input-bordered w-full max-w-xs"
                  />
                  <p class="text-end">บาท.</p>
                </div>
              </div>
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
<!-- :disabled="
                !requestData.userId ||
                !equestData.fieldId ||
                !requestData.dateRent ||
                !requestData.rentStartTime ||
                !requestData.rentEndTime ||
                !requestData.price
              " -->
