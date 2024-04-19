<script setup>
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import Table from "@/components/Table.vue";
import { useRequeststore } from "@/stores/user/create_request";
import { ref, onMounted, computed } from "vue";
import "dayjs/locale/th";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Bangkok");

const userRequest = useRequeststore();
const checkUserData = ref(true);

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
  await userRequest.loadRequestCancel();
  console.log("request cancel", userRequest?.cancel);
});

const canceledRequest = async (requestId) => {
  try {
    await userRequest.canceledRequest(requestId);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};

const filteredRequests = computed(() => {
  return userRequest?.cancel?.filter((request) => {
    return request?.attributes?.status_request === "Canceling";
  });
});

const formattedTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};
</script>
<template>
  <div v-if="checkUserData === false"></div>
  <LayoutLessor v-else>
    <div>
      <div class="pl-10 mt-10">
        <div class="flex-1 text-3xl text-center md:font-bold mb-2">
          ขอยกเลิกการเช่า
        </div>
      </div>
      <Table
        :headers="[
          'ชื่อ',
          'เบอร์',
          'เช่า',
          'ประเภท',
          'ราคา',
          'รายละเอียด',
          'สถานะ',
          '',
        ]"
        class="font-semibold"
      >
        <tr v-for="request in filteredRequests">
          <td>{{ request?.attributes?.name }}</td>
          <td>{{ request?.attributes?.tel }}</td>
          <td>{{ request.attributes.type_request }}</td>
          <td>
            {{ request?.attributes?.field_detail?.data?.attributes?.type }}
          </td>
          <td>{{ request?.attributes?.price }} บ.</td>
          <td
            v-if="
              request?.attributes?.type_request === 'เช่าแบบธรรมดา' ||
              request?.attributes?.type_request === 'เช่าแบบประจำ'
            "
          >
            วันที่ :
            {{
              dayjs(`${request?.attributes?.rent_date}`).format("DD/MM/YYYY")
            }}
            <br />เวลา :
            {{ formattedTime(request?.attributes?.start_rent_time) }} น. -
            {{ formattedTime(request?.attributes?.end_rent_time) }}
            น.
          </td>
          <td v-else>
            วันที่ :
            <div v-for="days in request?.attributes?.date_range">
              {{ dayjs(`${days}`).format("DD/MM/YYYY") }}
            </div>
          </td>
          <td>
            <div
              :class="{
                'btn btn-warning':
                  request?.attributes?.status_request === 'Canceling',
              }"
            >
              {{ request?.attributes?.status_request }}
            </div>
          </td>
          <td>
            <div class="btn btn-ghost" @click="canceledRequest(request.id)">
              คืนเงิน
            </div>
          </td>
        </tr></Table
      >
    </div></LayoutLessor
  >
</template>
