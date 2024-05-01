import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAccountStore = defineStore("account", {
  state: () => ({
    user: {},
    isLoggedIn: false,
    isAdmin: false,
    users: [],
  }),
  actions: {
    checkUser() {
      const userData = localStorage.getItem("user-data");
      const adminData = localStorage.getItem("admin-data");
      if (userData) {
        this.user = JSON.parse(userData);
        this.isLoggedIn = true;
      } else {
        this.user = JSON.parse(adminData);
        this.isAdmin = true;
      }
    },
    async singInWithEmailPassword(email, password) {
      const user = await axios.post("http://localhost:1337/api/auth/local", {
        identifier: email,
        password: password,
      });
      console.log("profile", user?.data);
      console.log("token", user?.data?.jwt);
      const status_user = user?.data?.user?.status_user;
      if (status_user == "admin") {
        console.log("status_user", user?.data?.user?.status_user);
        this.isAdmin = true;
        localStorage.setItem("admin-data", JSON.stringify(user?.data));
      } else {
        console.log("status_user", user?.data?.user?.status_user);
        this.isAdmin = false;
        localStorage.setItem("user-data", JSON.stringify(user?.data));
      }
    },
    async singUpWithEmailPassword(email, password, name, phone) {
      const data = await axios.get(
        "http://localhost:1337/api/users?filters[status_user][$eq]=player"
      );
      const userData = data.data;
      const arrayID = [];
      userData.forEach((item) => {
        console.log("singUpWithEmailPassword", item.id);
        arrayID.push(item.id);
      });
      const lastIndex = arrayID.length - 1;
      console.log(arrayID);
      const username = ref("");
      if (arrayID.length > 0) {
        username.value = `Player${arrayID[lastIndex] + 1}`;
      } else {
        username.value = "Player0";
      }
      console.log("username", username);
      const userRegister = await axios.post(
        "http://localhost:1337/api/auth/local/register",
        {
          username: username.value,
          name: name,
          email: email,
          password: password,
          tel: phone,
          status_user: "player",
        }
      );
      console.log("profile", userRegister?.data);
      console.log("token", userRegister?.data?.jwt);

      this.user = userRegister?.data;
    },
    logOut() {
      const userData = localStorage.getItem("user-data");
      const adminData = localStorage.getItem("admin-data");
      if (userData || adminData) {
        localStorage.removeItem("user-data");
        localStorage.removeItem("admin-data");
        this.isLoggedIn = false;
      }
    },
    async updateUser(userData) {
      console.log("userData-store", userData);
      const updateUser = await axios.put(
        `http://localhost:1337/api/users/${userData.userId}`,
        {
          name: userData.name,
          tel: userData.tel,
        }
      );
      const status = updateUser?.data?.status_user;
      if (status === "player") {
        const userDataLocal = localStorage.getItem("user-data");
        const editProfile = JSON.parse(userDataLocal);
        editProfile.user.name = userData.name;
        editProfile.user.tel = userData.tel;
        console.log("editProfileLocal", editProfile);
        const updateLocal = localStorage.setItem(
          "user-data",
          JSON.stringify(editProfile)
        );
        console.log("updateLocal", updateLocal);
      } else {
        const userDataLocal = localStorage.getItem("admin-data");
        const editProfile = JSON.parse(userDataLocal);
        editProfile.user.name = userData.name;
        editProfile.user.tel = userData.tel;
        console.log("editProfileLocal", editProfile);
        const updateLocal = localStorage.setItem(
          "admin-data",
          JSON.stringify(editProfile)
        );
        console.log("updateLocal", updateLocal);
      }

      console.log("update-user", updateUser?.data);
    },
    async resetPassword(userData) {
      const password = await axios.put(
        `http://localhost:1337/api/users/${userData.userId}`,
        {
          password: userData.password,
        }
      );
      console.log("reset-succes", password);
    },
    async sendEmail(userData) {
      const temPlateEmail = `
      <html>
        <head>
          <style>
            /* Your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
            }
            h1 {
              color: #007bff;
            }
            h3 {
              color: #007bff;
            }
            .password{
              background-color: #E5E8E8 ;
              padding:10px;
              border-left: 6px solid #2ECC71;
              box-shadow: 5px 5px 5px lightblue;
           }
            /* Add more styles as needed */
          </style>
        </head>
        <body>
          <h1>ลืมรหัสผ่าน!</h1>
          <div class="password"><p>รหัสผ่านใหม่ของคุณคือ: <h3>${userData.password}</h3><p> <br> <p>คุณสามารถเปลี่ยนรหัสผ่านใหม่ได้ตามต้องการในส่วนของโปร์ไฟล์<p> </div>
        </body>
      </html>
    `;
      try {
        const sendEmailRequest = await axios.post(
          "http://localhost:1337/api/forgot-password",

          {
            email: userData.email,
            subject:"ลืมรหัสผ่าน",
            body: temPlateEmail,
          }
        );
        console.log("send-email", sendEmailRequest);
      } catch (error) {
        console.log("error", error);
      }
    },
    async confirmEmail(email,password) {
      const temPlateEmail = `
      <html>
        <head>
          <style>
            /* Your CSS styles here */
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
            }
            h1 {
              color: #007bff;
            }
            h3 {
              color: #007bff;
            }
            .password{
              background-color: #E5E8E8 ;
              padding:10px;
              border-left: 6px solid #2ECC71;
              box-shadow: 5px 5px 5px lightblue;
           }
            /* Add more styles as needed */
          </style>
        </head>
        <body>
          <h1>ยินดีต้อนรับสู่ เล่นบอลกัน!</h1>
          <div class="password"><p>บัญชีคุณได้เป็นสมัครสมาชิกของ เล่นบอลกันแล้ว!!!<p> <br> <p>รหัสผ่านของคุณคือ: <h3>${password}</h3><p> <br> <p>คุณสามารถเปลี่ยนรหัสผ่านใหม่ได้ตามต้องการในส่วนของโปร์ไฟล์<p> </div>
        </body>
      </html>
    `;
      try {
        const sendEmailRequest = await axios.post(
          "http://localhost:1337/api/forgot-password",

          {
            email: email,
            subject:"สมัครสมาชิกสำเร็จ",
            body: temPlateEmail,
          }
        );
        console.log("send-email", sendEmailRequest);
      } catch (error) {
        console.log("error", error);
      }
    },
    async deleteUser(id) {
      console.log("userID", id);
      const data = await axios.delete(`http://localhost:1337/api/users/${id}`);
      console.log("delete-user", data);
      return data;
    },
    //dashBoard
    async getUser() {
      const data = await axios.get(
        "http://localhost:1337/api/users?filters[status_user][$eq]=player"
      );
      const userdata = data.data;
      console.log("getUser-Store", userdata);
      if (userdata.length > 0) {
        this.users = userdata;
      }
    },
  },
});
