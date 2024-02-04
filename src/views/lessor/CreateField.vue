<script setup>
import { useRouter, useRoute, RouterLink } from "vue-router";
import { onMounted, reactive, ref } from "vue";
import LayoutLessor from "@/Layout/LaoutLessor.vue";
import { useFieldStore } from "@/stores/Lessor/field";
import axios from "axios";

const selectedFile = ref(null);
const fieldData = reactive({
  img: null,
  type: "",
  price: 1,
});

const router = useRouter();
const route = useRoute();

const mode = ref("สร้างสนาม");
const upload = ref("ยังไม่ได้อัพ");

const indexField = ref(-1);

const lessorFieldStore = useFieldStore();

const addField = async () => {
  if (mode.value === "แก้ไข") {
    console.log("ภาพที่อัพแล้ว", fieldData.img);
    await lessorFieldStore.updateField(indexField.value, fieldData);
  } else {
    console.log(fieldData);
    await lessorFieldStore.addField(fieldData);
  }
  router.push({
    name: "field",
  });
};

onMounted(async () => {
  if (route.params.id) {
    console.log(mode.value);
    mode.value = "แก้ไข";
    indexField.value = route.params.id;
    console.log("id", indexField.value);

    const selectField = await lessorFieldStore.getField(indexField.value);
    fieldData.type = selectField.type;
    fieldData.price = selectField.price;
    fieldData.img = selectField.img.data.attributes.url;
    console.log("ที่จะแก้ไข", fieldData);
    console.log("ภาพที่จะแก้ไข", fieldData.img);
  }
  console.log(mode.value);
});

const handleFileChange = (event) => {
  console.log(event);
  selectedFile.value = event.target.files[0];
};
const uploadImage = async () => {
  const formData = new FormData();
  formData.append("files", selectedFile.value);
  console.log("formData", formData);
  try {
    await axios
      .post("http://localhost:1337/api/upload", formData)
      .then((res) => {
        console.log("res-data-id", res.data[0].id);
        fieldData.img = res.data[0];
        upload.value = "อัพแล้ว";
      });
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
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
                <span class="label-text">รูป</span>
              </div>
              <div v-if="mode === 'สร้างสนาม'">
                <img
                  v-if="fieldData.img"
                  :src="`http://localhost:1337${fieldData.img.url}`"
                  alt="Uploaded"
                  width="100px"
                  height="50px"
                  class="mb-2"
                />
              </div>
              <div v-else>
                <img
                  v-if="fieldData.img"
                  :src="
                    upload === 'ยังไม่ได้อัพ'
                      ? `http://localhost:1337${fieldData.img}`
                      : `http://localhost:1337${fieldData.img.url}`
                  "
                  alt="Uploaded"
                  width="100px"
                  height="50px"
                  class="mb-2"
                />
              </div>

              <input type="file" @change="handleFileChange" />
              <button @click="uploadImage" class="btn btn-neutral mt-2">
                Upload Image
              </button>
            </div>
            <div class="w-1/2">
              <div class="label">
                <span class="label-text">ประเภท</span>
              </div>
              <select
                class="select select-bordered w-3/4"
                v-model="fieldData.type"
              >
                <option disabled selected>เลือกประเภทสนาม</option>
                <option>สนามหญ้าเทียมฟุตบอล 11 คน</option>
                <option>สนามหญ้าเทียมฟุตบอล 7 คน</option>
                <option>สนามหญ้าจริงฟุตบอล 7 คน</option>
                <option>สนามหญ้าจริงฟุตบอล 11 คน</option>
              </select>
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
