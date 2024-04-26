import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

export const useFieldStore = defineStore("field", {
  state: () => ({
    list: [],
    listOpen: [],
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
    async loadFieldOpen() {
      try {
        const data = await axios.get(
          "http://localhost:1337/api/fields?filters[field_status][$eq]=Open&populate=*"
        );
        const fields = data?.data?.data;

        console.log("field", fields);
        console.log("count", fields.length);

        if (fields?.length > 0) {
          this.listOpen = fields;
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
      const dataId = await axios.get("http://localhost:1337/api/fields");
      const idField = dataId.data.data;
      const arrayID = [];
      console.log(idField);
      idField.forEach((item) => {
        console.log("idField", item.id);
        arrayID.push(item.id);
      });
      const lastIndex = arrayID.length - 1;
      console.log(arrayID);
      const name = ref("");
      if (arrayID.length > 0) {
        name.value = `F${arrayID[lastIndex] + 1}`;
      } else {
        name.value = "F0";
      }
      console.log("username", name.value);
      console.log("data-field", dataField);
      try {
        const data = await axios.post("http://localhost:1337/api/fields", {
          data: {
            name: name.value,
            type: dataField.type,
            price: dataField.price,
            img: dataField.img.id,
            field_status: "Open",
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
            field_status: dataField.status,
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
