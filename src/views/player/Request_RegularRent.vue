<script setup>
import layoutUser from "@/Layout/LayoutUser.vue";
import { onMounted, ref, computed } from "vue";
import Table from "@/components/Table.vue";
import { useRequeststore } from "@/stores/user/create_request";
import { useAccountStore } from "@/stores/account";
import "dayjs/locale/th";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Bangkok");

const userStore = useAccountStore();
const userRequest = useRequeststore();
const selectedStatus = ref("P");
const date = dayjs().format("YYYY-MM-DD");
const dateNow = dayjs().format("DD/MM/YYYY");
const checkUserData = ref(true);
const sixDaysText = ref("");
const formattedSixDaysText = ref("");

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

  const status = localStorage.getItem("status");
  if (status) {
    selectedStatus.value = status;
    localStorage.removeItem("status");
  }

  const userId = userStore?.user?.user?.id;
  await userRequest.loadRequest(userId);
  console.log("requested", userRequest?.requested);
});
const formattedTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};
const formattedSixDate = (date) => {
  const sixDays = dayjs(date).subtract(6, "day").format("YYYY-MM-DD");
  sixDaysText.value = sixDays;
  formattedSixDaysText.value = sixDays;
  console.log("sixDays", sixDaysText.value);
  return sixDays;
};
const changeRequest = async (requestId) => {
  try {
    await userRequest.cancelRequest(requestId);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
const payRequest = async (requestId) => {
  try {
    await userRequest.payRequest(requestId);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
const filteredRequests = computed(() => {
  const statusFilter = selectedStatus.value;
  return userRequest?.requested.filter((request) => {
    return (
      request.status_request === statusFilter &&
      request.type_request === "เช่าแบบประจำ"
    );
  });
});
</script>
<template>
  <main>
    <div v-if="checkUserData === false"></div>
    <layoutUser v-else>
      <div>
        <div class="flex-1 text-2xl text-center md:font-bold mt-3">
          รายการเช่าแบบประจำ
        </div>
        <div class="label-text text-base pl-10 mt-10 flex gap-4">
          สถานะ :
          <div>
            <span class="text-base btn btn-primary">P ชำระเงินแล้ว</span>
          </div>
          <div>
            <span class="text-base btn btn-warning"
              >CI การยกเลิก(สามารถทำการยกเลิกได้ถึงก่อน 2 วันที่เล่น)</span
            >
          </div>
          <div>
            <span class="text-base btn btn-error">C การยกเลิกสำเร็จ</span>
          </div>
          <div>
            <span class="text-base btn btn-success"
              >D คำร้องขอเช่าสนามเสร็จสิ้นแล้ว</span
            >
          </div>
          <div>
            <span class="text-base btn btn-info"
              >I รอชำระเงิน</span
            >
          </div>
          <div>
            <span class="text-base btn btn-active btn-ghost"
              >U ไม่ได้ชำระเงิน</span
            >
          </div>
        </div>
        <div class="pl-10 mt-10">
          <label for="statusFilter">เลือกตามสถานะ : </label>
          <select
            v-model="selectedStatus"
            id="statusFilter"
            class="select select-bordered max-w-xs"
          >
            <option value="P">P</option>
            <option value="I">I</option>
            <option value="D">D</option>
            <option value="U">U</option>
            <option value="C">C</option>
            <option value="CI">CI</option>
          </select>
        </div>
        <div class="flex justify-end mr-24">
          <div class="badge badge-secondary badge-md">วันที่ {{ dateNow }}</div>
        </div>
        <Table
          :headers="[
            'รูป',
            'ประเภท',
            'ราคา',
            'วัน/เดือน/ปี ที่เช่า',
            'เวลาที่เช่า',
            'สถานะ',
            '',
            selectedStatus === 'P'
              ? 'ระยะเวลาวันยกเลิก'
              : selectedStatus === 'I'
              ? 'ระยะเวลาวันชำระเงิน'
              : '',
          ]"
          class="font-semibold"
        >
          <tr v-for="request in filteredRequests">
            <td>
              <div class="avatar">
                <div class="w-24 rounded">
                  <img
                    :src="
                      'http://localhost:1337' + request?.field_detail?.img?.url
                    "
                  />
                </div>
              </div>
            </td>
            <td>{{ request?.field_detail?.type }}</td>
            <td>{{ request?.price }} บ.</td>
            <td>{{ dayjs(`${request?.rent_date}`).format("DD/MM/YYYY") }}</td>
            <td>
              {{ formattedTime(request?.start_rent_time) }} น. -
              {{ formattedTime(request?.end_rent_time) }}
              น.
            </td>
            <td
              :class="{
                'btn btn-success mt-9 ml-3': request?.status_request === 'D',
                'btn btn-error mt-9 ml-3': request?.status_request === 'C',
                'btn btn-primary mt-12 ml-3': request?.status_request === 'P',
                'btn btn-warning mt-9 ml-3': request?.status_request === 'CI',
                'btn btn-info mt-12 ml-3': request?.status_request === 'I',
                'btn btn-active btn-ghost mt-9 ml-3':
                  request?.status_request === 'U',
              }"
            >
              {{ request?.status_request }}
            </td>
            <td>
              <div>
                <div class="flex gap-2" v-if="request?.status_request === 'P'">
                  <div
                    v-if="
                      dayjs(request?.rent_date).diff(dayjs(date), 'day') >= 3
                    "
                    class="btn btn-ghost"
                    @click="changeRequest(request.id)"
                  >
                    ยกเลิก
                  </div>
                </div>
                <div class="flex gap-2" v-if="request?.status_request === 'I'">
                  <div class="btn btn-ghost" @click="payRequest(request.id)">
                    จ่ายเงิน
                  </div>
                </div>
              </div>
            </td>
            <td v-if="request?.status_request === 'I'">
              <div class="w-3/4">
                <div
                  class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content w-1/2 text-center mb-2"
                >
                  <span class="font-mono text-5xl text-center">
                    {{ dayjs(sixDaysText).diff(dayjs(date), "day") + 1 }}
                  </span>
                  วัน
                </div>
                (นับวันปัจจุบัน) <br>
                ระยะเวลาชำระเงินถึงวันที่: <br />
                <div class="badge badge-warning gap-2">
                  <div v-if="!formattedSixDaysText">
                    {{ formattedSixDate(request?.rent_date) }}
                  </div>
                  {{ dayjs(formattedSixDaysText).format("DD/MM/YYYY") }}
                </div>
              </div>
            </td>
            <td v-if="request?.status_request === 'P'">
              <div
                class="w-3/4"
                v-if="dayjs(request?.rent_date).diff(dayjs(date), 'day') >= 3"
              >
                <div
                  class="flex flex-col p-2 bg-neutral rounded-box text-neutral-content w-1/2 text-center mb-2"
                >
                  <span class="font-mono text-5xl text-center">
                    {{ dayjs(request?.rent_date).diff(dayjs(date), "day") - 2 }}
                  </span>
                  วัน
                </div>
                (นับวันปัจจุบัน) <br>
                ระยะเวลายกเลิกถึงวันที่: <br />
                <div class="badge badge-warning gap-2">
                  {{
                    dayjs(request?.rent_date)
                      .subtract(3, "day")
                      .format("DD/MM/YYYY")
                  }}
                </div>
              </div>
            </td>
          </tr>
        </Table>
      </div>
    </layoutUser>
  </main>
</template>
