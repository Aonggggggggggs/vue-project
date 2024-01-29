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

        console.log("ก่อนเก็บ", fields);
        console.log("จำนวน", fields.length);

        if (fields.length > 0) {
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
      console.log("datafield", dataField);
      try {
        const data = await axios.post("http://localhost:1337/api/fields", {
          data: {
            name: dataField.name,
            type: dataField.type,
            address: dataField.address,
            price: dataField.price,
            phone: dataField.phone,
          },
        });
        console.log("appField", data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    async updateField(fieldId, dataField) {
      console.log("updating field", dataField);
      const data = await axios.put(
        `http://localhost:1337/api/fields/${fieldId}`,
        {
          data: {
            name: dataField.name,
            type: dataField.type,
            address: dataField.address,
            price: dataField.price,
            // this.list[index].img = dataField.img;
            phone: dataField.phon,
          },
        }
      );
      console.log("update", data);
      return data;
    },
    async removeField(fieldId) {
      console.log(fieldId)
      const data = await axios.delete(
        `http://localhost:1337/api/fields/${fieldId}`
      );
      console.log('remove',data);
      return data;
    },
  },
});
