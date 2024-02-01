<script setup>
import { RouterLink } from "vue-router";
import { onMounted } from "vue";
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import Edit from "@/components/icon/Edit.vue";
import Trash from "@/components/icon/Trash.vue";
import Table from "@/components/Table.vue";
import { useFieldStore } from "@/stores/Lessor/field";

const lessorFields = useFieldStore();

onMounted(async () => {
  await lessorFields.loadField();
  console.log("field", lessorFields.list);
});
const removeField = async (fieldId) => {
  try {
    await lessorFields.removeField(fieldId);
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
</script>
<template>
  <main>
    <LayoutLessor>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-7xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="flex-1 text-2xl text-center md:font-bold mb-2">สนาม</div>
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
            <tr v-for="field in lessorFields.list">
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
                  <RouterLink
                    :to="{ name: 'edit_field', params: { id: field.id } }"
                    class="btn btn-ghost"
                    ><Edit></Edit
                  ></RouterLink>
                  <div class="btn btn-ghost" @click="removeField(field.id)">
                    <Trash></Trash>
                  </div>
                </div>
              </td>
            </tr>
          </Table>
        </div>
      </div>
    </LayoutLessor>
  </main>
</template>
