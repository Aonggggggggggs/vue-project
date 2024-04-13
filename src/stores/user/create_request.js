import { defineStore } from "pinia";
import axios from "axios";
import dayjs from "dayjs";

export const useRequeststore = defineStore("request", {
  state: () => ({
    request: [],
    requested: [],
    cancel: [],
    //dashBoard
    toDayRequest: [],
    inComeMonthRequest: 0,
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
              type_request: "เช่าแบบธรรมดา",
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
    async addRequestDayRents(requestData) {
      console.log("data-request-store", requestData);
      try {
        const a = requestData.daysRent.length - 1;
        const data = await axios.post(
          "http://localhost:1337/api/rent-requests",
          {
            data: {
              type_request: "เช่าแบบเหมาวัน",
              name: requestData.name,
              user: requestData.userId,
              field_detail: requestData.fieldId,
              price: requestData.price,
              tel: requestData.tel,
              rent_date: requestData.daysRent[a],
              date_range: requestData.daysRent,
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
    async addRequestRegularRents(requestData) {
      console.log("data-request-store", requestData);
      try {
        const data = await axios.post(
          "http://localhost:1337/api/rent-requests",
          {
            data: {
              type_request: "เช่าแบบประจำ",
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
        for (var i = 0; i < requestData.weeks - 1; i++) {
          const data = await axios.post(
            "http://localhost:1337/api/rent-requests",
            {
              data: {
                type_request: "เช่าแบบประจำ",
                name: requestData.name,
                user: requestData.userId,
                field_detail: requestData.fieldId,
                start_rent_time: requestData.rentStartTime,
                end_rent_time: requestData.rentEndTime,
                rent_date: requestData.showWeeks[i],
                price: requestData.price,
                tel: requestData.tel,
                status_request: "In Progress",
              },
            }
          );
          console.log("add-Request", data);
        }
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
          `http://localhost:1337/api/rent-requests?filters[status_request][$eq]=Canceling&populate=*`
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
            status_request: "Canceling",
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
            status_request: "Cancel",
          },
        }
      );
      console.log("change_status", data);
      return data;
    },
    async payRequest(requestId) {
      console.log(requestId);
      const data = await axios.put(
        `http://localhost:1337/api/rent-requests/${requestId}`,
        {
          data: {
            status_request: "Payed",
          },
        }
      );
      console.log("change_status", data);
      return data;
    },
    // dashBoard
    async inComeM() {
      const date = dayjs().get("month");
      console.log("date", date);
      const data = await axios.get(
        "http://localhost:1337/api/rent-requests?filters[status_request][$eq]=Done"
      );
      const request = data?.data?.data;
      console.log("inCome", request);
      let inCome_M = 0;
      if (request?.length > 0) {
        request.forEach((item) => {
          if (dayjs(item?.attributes?.rent_date).get("month") === date) {
            console.log("IF");
            inCome_M += item.attributes?.price;
          }
        });
      }
      console.log(inCome_M);
      this.inComeMonthRequest = inCome_M;
    },
  },
});
