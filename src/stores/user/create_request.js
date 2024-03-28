import { defineStore } from "pinia";
import axios from "axios";

export const useRequeststore = defineStore("request", {
  state: () => ({
    request: [],
    requested: [],
    cancel: [],
  }),
  actions: {
    async getField(fieldId) {
      try {
        const data = await axios.get(
          `http://localhost:1337/api/fields/${fieldId}?populate=*`
        );
        const field = data?.data?.data;
        console.log("เช่า", field);
        this.request = field;
      } catch (error) {
        console.log(error);
      }
    },
    async checkDate(date) {
      try {
        const data = await axios.get(
          `http://localhost:1337/api/fields/${date}?populate=*`
        );
        const field = data?.data?.data;
        console.log("เช่า", field);
        this.request = field;
      } catch (error) {
        console.log(error);
      }
    },
    async addRequest(requestData) {
      console.log("data-request-store", requestData);
      try {
        const data = await axios.post(
          "http://localhost:1337/api/rent-requests",
          {
            data: {
              name: requestData.name,
              user: requestData.userId,
              field_detail: requestData.fieldId,
              start_rent_time: requestData.rentStartTime,
              end_rent_time: requestData.rentEndTime,
              rent_date: requestData.dateRent,
              price: requestData.price,
              tel: requestData.tel,
              status_request: "Payed",
            },
          }
        );
        console.log("add-Request", data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async loadRequest(userId) {
      console.log("UserID", userId);
      try {
        const data = await axios.get(
          `http://localhost:1337/api/users/${userId}?populate=deep,4`
        );
        const requests = data?.data?.rent_requests;

        if (requests.length > 0) {
          this.requested = requests;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async loadRequestCancel() {
      try {
        const data = await axios.get(
          `http://localhost:1337/api/rent-requests?filters[status_request][$eq]=Cancel&populate=*`
        );
        const cancels = data?.data?.data;
        console.log("In Store", cancels);

        if (cancels.length > 0) {
          this.cancel = cancels;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getRequest(requsetId) {
      try {
        const data = await axios.get(
          `http://localhost:1337/api/rent-requests/${requsetId}?populate=*`
        );
        const request = data?.data?.data?.attributes;
        console.log("รายการเช่า", request);
        return request;
      } catch (error) {
        console.log(error);
      }
    },
    async cancelRequest(requestId) {
      console.log(requestId);
      const data = await axios.put(
        `http://localhost:1337/api/rent-requests/${requestId}`,
        {
          data: {
            status_request: "Cancel",
          },
        }
      );
      console.log("change_status", data);
      return data;
    },
    async canceledRequest(requestId) {
      console.log(requestId);
      const data = await axios.put(
        `http://localhost:1337/api/rent-requests/${requestId}`,
        {
          data: {
            status_request: "Canceled",
          },
        }
      );
      console.log("change_status", data);
      return data;
    },
  },
});
