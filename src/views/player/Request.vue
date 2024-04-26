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
  const userId = userStore?.user?.user?.id;
  await userRequest.loadRequest(userId);
  console.log("requested", userRequest?.requested);
});
const formattedTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};
const changeRequest = async (requestId) => {
  try {
    await userRequest.cancelRequest(requestId);
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
      request.type_request === "เช่าแบบธรรมดา"
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
          รายการเช่าแบบธรรมดา
        </div>
        <div class="label-text text-sm pl-10 mt-10">
          แจ้งเตือน : <br />สร้างคำร้องขอเช่าสนามแล้วชำระเงินแล้วจะเป็นสถานะ
          <span class="text-base text-primary font-semibold">(P)</span>
          ถ้าทำการยกเลิกคำร้องเช่าสนามจะเปลี่ยนสถานะ
          <span class="text-base text-warning font-semibold">(CI)</span>
          โดยจะทำการยกเลิกได้(สามารถทำการยกเลิกได้ถึงก่อน 2 วันที่เล่น)
          แล้วจะให้ทางผู้ให้เช่าจะโทรมาคุยรายละเอียด แล้วจะเปลี่ยนเป็นสถานะ
          <span class="text-base text-error font-semibold">(C)</span>
          และสถานะ<span class="text-base text-success font-semibold">(D)</span>
          คือคำร้องขอเช่าสนามเสร็จสิ้นแล้ว
        </div>
        <div class="pl-10 mt-10">
          <label for="statusFilter">เลือกตามสถานะ : </label>
          <select
            v-model="selectedStatus"
            id="statusFilter"
            class="select select-bordered max-w-xs"
          >
            <option value="P">P</option>
            <option value="D">D</option>
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
                'btn btn-success mt-9': request?.status_request === 'D',
                'btn btn-error mt-9': request?.status_request === 'C',
                'btn btn-primary mt-9': request?.status_request === 'P',
                'btn btn-warning mt-9': request?.status_request === 'CI',
              }"
            >
              {{ request?.status_request }}
            </td>
            <td>
              <div
                class="flex gap-2"
                v-if="request?.status_request === 'P'"
              >
                <div
                  v-if="dayjs(request?.rent_date).diff(dayjs(date), 'day') >= 2"
                  class="btn btn-ghost"
                  @click="changeRequest(request.id)"
                >
                  ยกเลิก
                </div>
              </div>
            </td>
          </tr>
        </Table>
      </div></layoutUser
    >
  </main>
</template>
