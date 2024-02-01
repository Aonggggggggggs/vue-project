<script setup>
import { useRouter, useRoute, RouterLink } from "vue-router";
import { onMounted } from "vue";
import layoutUser from "@/Layout/LayoutUser.vue";
import Table from "@/components/Table.vue";
import Edit from "@/components/icon/Edit.vue";
import { useFieldStore } from "@/stores/Lessor/field";
const userFields = useFieldStore();
onMounted(async () => {
  await userFields.loadField();
  console.log("field", userFields.list);
});
</script>
<template>
  <main>
    <layoutUser>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-7xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="flex-1 text-2xl text-center md:font-bold">สร้างห้อง</div>
          <div class="flex flex-col w-full mt-14">
            <div class="w-2/3 m-auto">
              <div class="label">
                <span class="label-text">สนาม</span>
              </div>
              <Table
                :headers="[
                  'ID',
                  'ชื่อสนาม',
                  'รูป',
                  'ประเภท',
                  'เบอร์โทร',
                  'ที่อยู่',
                  'ราคา',
                  '',
                ]"
              >
                <tr v-for="field in userFields.list">
                  <td>{{ field.id }}</td>
                  <th>{{ field.attributes.name }}</th>
                  <td>
                    <img
                  :src="
                    'http://localhost:1337' +
                    field.attributes.img.data.attributes.url
                  "
                  class="w-24"
                />
                  </td>
                  <td>{{ field.attributes.type }}</td>
                  <td>{{ field.attributes.phone }}</td>
                  <td>{{ field.attributes.address }}</td>
                  <td>{{ field.attributes.price }}</td>
                  <td>
                    <div class="flex gap-2">
                      <Edit></Edit>
                    </div>
                  </td>
                </tr>
              </Table>
              <div class="label mt-10">
                <span class="label-text">เวลา</span>
              </div>
            </div>
          </div>
          <div class="flex mt-16 w-2/4 m-auto justify-between">
            <button class="btn btn-neutral w-32">ยืนยัน</button>
            <RouterLink :to="{ name: 'room' }" class="btn btn-ghost w-32"
              >กลับไปห้อง</RouterLink
            >
          </div>
        </div>
      </div></layoutUser
    >
  </main>
</template>
