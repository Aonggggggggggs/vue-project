import { defineStore } from "pinia";
import axios from "axios";

export const useRequeststore = defineStore("request", {
  state: () => ({
    request: [],
    requested: [],
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
      console.log("data-request-store", requestData.name);
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
              status_request: "In Progress",
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

        // console.log("requests-store", requests);
        // console.log("count", requests.length);

        if (requests.length > 0) {
          this.requested = requests;
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
    // async updateField(fieldId, dataField) {
    //   console.log("updating-field", dataField);
    //   console.log("updating-imge-id", dataField.img.id);

    //   const data = await axios.put(
    //     `http://localhost:1337/api/fields/${fieldId}`,
    //     {
    //       data: {
    //         type: dataField.type,
    //         price: dataField.price,
    //         img: dataField.img.id,
    //       },
    //     }
    //   );
    //   console.log("update-sussec", data);
    //   return data;
    // },
    async removeRequest(requestId) {
      console.log(requestId);
      const data = await axios.delete(
        `http://localhost:1337/api/rent-requests/${requestId}`
      );
      console.log("remove", data);
      return data;
    },
  },
});
