<script setup>
import { useRouter, useRoute, RouterLink } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import { useFieldStore } from "@/stores/Lessor/field";
const fieldData = reactive({
  name: "",
  phone: "",
  address: "",
  map: "",
  type: "",
  price: 1,
  img: "",
});
const router = useRouter();
const route = useRoute();
const indexField = ref(-1);
const mode = ref("สร้างสนาม");
const lessorFieldStore = useFieldStore();
const addField = async () => {
  if (mode.value === "แก้ไข") {
    await lessorFieldStore.updateField(indexField.value, fieldData);
  } else {
    await lessorFieldStore.addField(fieldData);
  }
  router.push({
    name: "field",
  });
};
onMounted(async () => {
  if (route.params.id) {
    indexField.value = route.params.id;
    mode.value = "แก้ไข";
    console.log("id", indexField.value);

    const selectField = await lessorFieldStore.getField(indexField.value);
    fieldData.name = selectField.name;
    fieldData.phone = selectField.phone;
    fieldData.address = selectField.address;
    fieldData.map = selectField.map;
    fieldData.type = selectField.type;
    fieldData.price = selectField.price;
    fieldData.img = selectField.img;
  }
});
</script>
<template>
  <main>
    <LayoutLessor>
      <div class="h-screen flex items-cente">
        <div class="flex-1 max-w-4xl p-4 shadow-2xl m-auto rounded-lg">
          <div class="flex-1 text-2xl text-center md:font-bold">{{ mode }}</div>
          <div class="flex w-full mt-14" id="twoBox">
            <div class="w-1/2">
              <div class="label">
                <span class="label-text w-3/4">ชื่อสนาม</span>
              </div>
              <input
                type="text"
                placeholder="name field"
                class="input input-bordered w-3/4"
                v-model="fieldData.name"
              />
              <div class="label">
                <span class="label-text w-3/4">เบอร์โทร</span>
              </div>
              <input
                type="text"
                placeholder="tel."
                class="input input-bordered w-3/4"
                v-model="fieldData.phone"
              />
              <div class="label">
                <span class="label-text w-3/4">ที่อยู่</span>
              </div>
              <input
                type="text"
                placeholder="address"
                class="input input-bordered w-3/4"
                v-model="fieldData.address"
              />
              <!-- <div class="label">
                <span class="label-text w-3/4">ลิ้งที่อยู่ที่อยู่</span>
              </div> -->
              <!-- <input
                type="text"
                placeholder="link"
                class="input input-bordered w-3/4"
                v-model="fieldData.map"
              /> -->
            </div>
            <div class="w-1/2">
              <div class="label">
                <span class="label-text">รูป</span>
              </div>
              <input
                type="file"
                class="w-3/4"
              />
              <div class="label">
                <span class="label-text">ประเภท</span>
              </div>
              <input
                type="text"
                placeholder="type"
                class="input input-bordered w-3/4"
                v-model="fieldData.type"
              />
              <div class="label">
                <span class="label-text w-1/2">ราคา</span>
                <span class="label-text w-1/4">ชม.</span>
              </div>
              <input
                type="number"
                placeholder="pice"
                class="input input-bordered w-3/4"
                v-model="fieldData.price"
              />
            </div>
          </div>
          <div class="flex mt-16 w-2/4 m-auto justify-between">
            <button class="btn btn-neutral w-32" @click="addField()">
              {{ mode }}
            </button>
            <RouterLink :to="{ name: 'field' }" class="btn btn-ghost w-32"
              >กลับไปสนาม</RouterLink
            >
          </div>
        </div>
      </div>
    </LayoutLessor>
  </main>
</template>
<style>
#twoBox {
  margin-left: 70px;
}
</style>
