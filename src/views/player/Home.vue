<script setup>
import layoutUser from "@/Layout/LayoutUser.vue";
import Map from "@/components/icon/Map.vue";
</script>

<template>
  <main>
    <layoutUser>
      <div class="hero min-h-screen">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <img src="@/assets/logo.png" class="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 class="text-5xl font-bold">ที่อยู่ของสนามเรา</h1>
            <p class="py-6">
              มหาวิทยาลัยพะเยา <br />
              เป็นมหาวิทยาลัยในกำกับของรัฐบาลตั้งอยู่ในจังหวัดพะเยา เดิมชื่อ
              มหาวิทยาลัยนเรศวร วิทยาเขตพะเยาต่อมา
              มีการตราพระราชบัญญัติมหาวิทยาลัยพะเยา พ.ศ. 2553 เมื่อวันที่ 12
              กรกฎาคม พ.ศ. 2553 และประกาศในราชกิจจานุเบกษาเมื่อวันที่ 16 กรกฎาคม
              พ.ศ. 2553
              <br />ที่อยู่: 19 ตำบลแม่กา อำเภอเมืองพะเยา พะเยา 56000 <br />สี:
              สีม่วง,สีทอง <br />ก่อตั้ง: 16 กรกฎาคม 2553 <br />ประเภทโรงเรียน:
              สถาบันอุดมศึกษาในกำกับของรัฐบาล <br />โทรศัพท์: 054-466-666
            </p>
            <button class="btn btn-primary">
              <a
                href="https://maps.app.goo.gl/QHuWPbmkDvSv9wQJ7"
                target="_blank"
                ><Map></Map
              ></a>
            </button>
          </div>
        </div>
      </div>
    </layoutUser>
  </main>
</template>
