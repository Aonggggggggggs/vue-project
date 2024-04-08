<script setup>
import { useRouter, RouterLink } from "vue-router";
import { onMounted, reactive, ref, computed } from "vue";
import dayjs, { Dayjs } from "dayjs";
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

const drageDate = ref([]);

const check = ref(false);

const requestData = reactive({
  userId: null,
  tel: "",
  fieldId: null,
  name: "",
  price: 1,
  days: 0,
  checkDate: [],
  formattDate: [],
  daysRent: [],
});

const isValidName = computed(() => {
  return check.value ? /^(?=.*[ก-ฮ]).{5,}$/.test(requestData.name) : null;
});

const sortedDates = computed(() => {
  return [...requestData.formattDate].sort();
});
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
        item?.attributes?.status_request === "In Progress"
      );
    });
  const arraycheckDayRent = [];
  const checkDayRent =
    userRequest?.request?.attributes?.rent_requests?.data?.filter((item) => {
      return item?.attributes?.type_request === "เช่าแบบเหมาวัน";
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
const handleCountsDay = (drageDate) => {
  if (drageDate) {
    console.log("drageDate.length", drageDate.length);
    requestData.formattDate = drageDate.map((item) => {
      return dayjs(item).format("YYYY-MM-DD");
    });
    requestData.days = drageDate.length;
    console.log("formattDate", requestData.formattDate);
  } else {
    console.log("ไม่มี");
    requestData.formattDate = [];
    requestData.days = 0;
  }
};
const handleSubmit = async () => {
  console.log("submit");
  requestData.daysRent = sortedDates;
  console.log(" requestData.daysRent", requestData.daysRent);
  check.value = true;
  requestData.price =
    (userRequest?.request?.attributes?.price *
      12 *
      requestData.days *
      (100 - 20)) /
    100;
  console.log("requestData.price", requestData.price);
  if (
    isValidName.value == true &&
    requestData.daysRent.length > 0 &&
    requestData.price != 1
  ) {
    await userRequest.addRequestDayRents(requestData);
    router.push("/request_dayrent");
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
                <span class="label-text text-xl m-auto">วันเช่า</span>
              </div>
              <div class="w-4/4">
                <VueDatePicker
                  class="justify-center"
                  format="dd/MM/yyyy"
                  locale="th"
                  v-model="drageDate"
                  :disabled="!requestData.fieldId"
                  multi-dates
                  :min-date="new Date()"
                  @update:model-value="handleCountsDay(drageDate)"
                  :disabled-dates="requestData.checkDate"
                  inline
                  auto-apply
                />
              </div>
            </div>
          </div>
          <div class="card w-6/12 bg-primary text-primary-content mt-5 m-auto">
            <div v-if="requestData.fieldId" class="card-body">
              <h2 class="card-title">วันที่เช่า</h2>
              <div class="max-w-xl text-sm breadcrumbs">
                <ul class="badge badge-lg" v-if="sortedDates.length > 0">
                  <li v-for="date in sortedDates" :key="date">
                    {{ dayjs(date).format("DD/MM/YYYY") }}
                  </li>
                </ul>
              </div>
              <h4 class="ml-2 flex gap-1" v-if="requestData.days > 0">
                ทั้งหมด
                <div class="bg-base-300 rounded-box w-10 flex justify-center">
                  {{ requestData.days }}
                </div>
                วัน
              </h4>
              <h2 class="card-title">ราคาทั้งหมด (ส่วนลด20%!!!! )</h2>
              <input
                disabled
                :placeholder="
                  (userRequest?.request?.attributes?.price *
                    18 *
                    requestData.days *
                    (100 - 20)) /
                  100
                "
                class="input input-bordered w-full"
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
