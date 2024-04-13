import axios from "axios";
import { defineStore } from "pinia";

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
    async singUpWithEmailPassword(email, password, username, phone) {
      try {
        const userRegister = await axios.post(
          "http://localhost:1337/api/auth/local/register",
          {
            username: username,
            email: email,
            password: password,
            tel: phone,
            status_user: "player",
          }
        );
        console.log("profile", userRegister?.data);
        console.log("token", userRegister?.data?.jwt);

        this.user = userRegister?.data;
      } catch (error) {
        console.log("Register", error);
      }
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
          username: userData.username,
          tel: userData.tel,
        }
      );
      const status = updateUser?.data?.status_user;
      if (status === "player") {
        const userDataLocal = localStorage.getItem("user-data");
        const editProfile = JSON.parse(userDataLocal);
        editProfile.user.username = userData.username;
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
        editProfile.user.username = userData.username;
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
