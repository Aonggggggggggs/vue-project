<script setup>
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import Table from "@/components/Table.vue";
import { useRequeststore } from "@/stores/user/create_request";
import { ref, onMounted } from "vue";
import "dayjs/locale/th";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Bangkok");

const userRequest = useRequeststore();

onMounted(async () => {
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

const formattedTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes}`;
};
</script>
<template>
  <LayoutLessor
    ><div>
      <Table
        :headers="[
          'ชื่อ',
          'เบอร์',
          'ประเภท',
          'ราคา',
          'วัน/เดือน/ปี ที่เช่า',
          'เวลาที่เช่า',
          'สถานะ',
          '',
        ]"
        class="font-semibold"
      >
        <tr v-for="request in userRequest?.cancel">
          <td>{{ request?.attributes?.name }}</td>
          <td>{{ request?.attributes?.tel }}</td>
          <td>
            {{ request?.attributes?.field_detail?.data?.attributes?.type }}
          </td>
          <td>{{ request?.attributes?.price }} บ.</td>
          <td>
            {{
              dayjs(`${request?.attributes?.rent_date}`).format("DD/MM/YYYY")
            }}
          </td>

          <td>
            {{ formattedTime(request?.attributes?.start_rent_time) }} น. -
            {{ formattedTime(request?.attributes?.end_rent_time) }}
            น.
          </td>
          <td
            :class="{
              'btn btn-warning mt-2 mb-2':
                request?.attributes?.status_request === 'Canceling',
            }"
          >
            {{ request?.attributes?.status_request }}
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
