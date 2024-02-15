import { defineStore } from "pinia";
import axios from "axios";

export const useRequeststore = defineStore("request", {
  state: () => ({
    request: [],
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
    async addRequest(requestData) {
      console.log("data-request-store", requestData);
      try {
        const data = await axios.post(
          "http://localhost:1337/api/rent-requests",
          {
            data: {
              user: requestData.userId,
              field_detail:requestData.fieldId,
              start_rent_time:requestData.rentStartTime,
              end_rent_time:requestData.rentEndTime,
              rent_date:requestData.dateRent,
              price: requestData.price,
              status_request: "progress",
            },
          }
        );
        console.log("add-Request", data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    // async loadField() {
    //   try {
    //     const data = await axios.get(
    //       "http://localhost:1337/api/fields?populate=*"
    //     );
    //     const fields = data?.data?.data;

    //     console.log("field", fields);
    //     console.log("count", fields.length);

    //     if (fields.length > 0) {
    //       this.list = fields;
    //       this.loaded = true;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    // async getField(fieldId) {
    //   try {
    //     const data = await axios.get(
    //       `http://localhost:1337/api/fields/${fieldId}?populate=*`
    //     );
    //     const field = data?.data?.data?.attributes;
    //     return field;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
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
    // async removeField(fieldId) {
    //   console.log(fieldId);
    //   const data = await axios.delete(
    //     `http://localhost:1337/api/fields/${fieldId}`
    //   );
    //   console.log("remove", data);
    //   return data;
    // },
  },
});
