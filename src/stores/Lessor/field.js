import { defineStore } from "pinia";
import axios from "axios";

export const useFieldStore = defineStore("field", {
  state: () => ({
    list: [],
    loaded: false,
  }),
  actions: {
    async loadField() {
      try {
        const data = await axios.get(
          "http://localhost:1337/api/fields?populate=*"
        );
        const fields = data?.data?.data;

        console.log("field", fields);
        console.log("count", fields.length);

        if (fields?.length > 0) {
          this.list = fields;
          this.loaded = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getField(fieldId) {
      try {
        const data = await axios.get(
          `http://localhost:1337/api/fields/${fieldId}?populate=*`
        );
        const field = data?.data?.data?.attributes;
        return field;
      } catch (error) {
        console.log(error);
      }
    },
    async addField(dataField) {
      console.log("data-field", dataField);
      try {
        const data = await axios.post("http://localhost:1337/api/fields", {
          data: {
            type: dataField.type,
            price: dataField.price,
            img: dataField.img.id,
          },
        });
        console.log("add-Field", data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async updateField(fieldId, dataField) {
      console.log("updating-field", dataField);
      console.log("updating-imge-id", dataField.img.id);

      const data = await axios.put(
        `http://localhost:1337/api/fields/${fieldId}`,
        {
          data: {
            type: dataField.type,
            price: dataField.price,
            img: dataField.img.id,
          },
        }
      );
      console.log("update-sussec", data);
      return data;
    },
    async removeField(fieldId) {
      console.log(fieldId);
      const data = await axios.delete(
        `http://localhost:1337/api/fields/${fieldId}`
      );
      console.log("remove", data);
      return data;
    },
  },
});
