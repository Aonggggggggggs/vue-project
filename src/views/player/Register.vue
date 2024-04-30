<script setup>
import { useAccountStore } from "@/stores/account";
import { useRouter } from "vue-router";
import { ref, computed, onMounted } from "vue";
import { useEventStore } from "@/stores/event";

const router = useRouter();
const eventStore = useEventStore();
const accountStore = useAccountStore();

const check = ref(false);
const checkEmail = ref(true);
const checkUserData = ref(true);
const name = ref("");
const email = ref("");
const password = ref("");
const c_password = ref("");
const phone = ref("");

const isValidName = computed(() => {
  return check.value ? /^(?=.*[ก-ฮ]).{5,}$/.test(name.value) : null;
});
const isValidEmail = computed(() => {
  return check.value
    ? /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email.value
      )
    : null;
});
const isValidPassword = computed(() => {
  return check.value
    ? /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z]).{8,}$/.test(
        password.value
      )
    : null;
});
const isPasswordConfirmed = computed(() => {
  return check.value ? password.value == c_password.value : null;
});
const isValidPhone = computed(() => {
  return check.value ? /^(?=.*[0-9]).{10}$/.test(phone.value) : null;
});

onMounted(() => {
  const userData = localStorage.getItem("user-data");
  const adminData = localStorage.getItem("admin-data");
  if (userData) {
    checkUserData.value = false;
  } else if (adminData) {
    checkUserData.value = false;
  } else {
    checkUserData.value = true;
  }
});

const register = async () => {
  check.value = true;
  if (
    isValidName.value == true &&
    isValidEmail.value == true &&
    isValidPhone.value == true &&
    isValidPassword.value == true &&
    isPasswordConfirmed.value == true
  ) {
    try {
      checkEmail.value = true;
      await accountStore.singUpWithEmailPassword(
        email.value,
        password.value,
        name.value,
        phone.value
      );
      eventStore.popupMessage("success", "สมัครสมาชิกเสร็จสิ้น");
      router.push("/login");
    } catch (error) {
      checkEmail.value = false;
      console.log(error);
    }
  } else {
    eventStore.popupMessage("info", "ข้อมูลไม่ถูกต้อง");
  }
};
</script>
<template>
  <div v-if="checkUserData === false"></div>
  <div class="h-screen flex items-cente" v-else>
    <div class="flex-1 max-w-2xl p-4 shadow-2xl m-auto rounded-lg">
      <div class="text-2xl text-center md:font-bold mb-10">สมัครสมาชิก</div>
      <div class="w-2/3 m-auto">
        <label class="form-control">
          <div class="label">
            <span class="label-text">ชื่อจริง-นามสกุล</span>
            <span v-if="isValidName == false" class="text-xs"
              >กรอกชื่อจริง-นามสกุลให้ถูกต้อง</span
            >
          </div>
          <input
            type="text"
            placeholder="ชื่อจริง-นามสกุล"
            class="input input-bordered"
            v-model="name"
          />
          <div class="label">
            <span class="label-text">อีเมล์</span>
            <span v-if="isValidEmail == false" class="text-xs"
              >กรอกอีเมล์ให้ถูกต้อง</span
            >
            <span v-if="checkEmail == false" class="text-xs">อีเมล์นี้ใช้งานแล้ว</span>
          </div>
          <input
            type="text"
            placeholder="อีเมล์"
            class="input input-bordered"
            v-model="email"
          />
          <div class="label">
            <span class="label-text">เบอร์โทร</span>
            <span v-if="isValidPhone == false" class="text-xs"
              >กรอกเบอร์โทรศัพท์ให้ถูกต้อง</span
            >
          </div>
          <input
            type="text"
            placeholder="เบอร์โทร"
            class="input input-bordered"
            v-model="phone"
          />
          <div class="label mt-10">
            <span class="label-text">รหัสผ่าน</span>
            <span v-if="isValidPassword == false" class="text-xs"
              >กรอกรหัสผ่านให้ถูกต้อง</span
            >
          </div>
          <input
            type="password"
            placeholder="A-Z,a-z,!@#$&,0-9, 6ตัวอักษรขึ้นไป"
            class="input input-bordered"
            v-model="password"
          />
          <div class="label">
            <span class="label-text">ยืนยันรหัสผ่าน</span>
            <span v-if="isPasswordConfirmed == false" class="text-xs"
              >ยืนยันรหัสผ่านไม่ถูกต้อง</span
            >
          </div>
          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            class="input input-bordered"
            v-model="c_password"
          />
        </label>
        <button class="btn btn-primary w-full my-10" @click="register()">
          สมัครสมาชิก
        </button>
      </div>
    </div>
  </div>
</template>
