//just demo for mocking an object
import axios from "axios";
let person = {
  name: "mayank",
  getName(name) {
    return name;
  },
  axiosInstance: axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/",
    timeout: 1000,
    headers: { "X-Custom-Header": "foobar" },
  }),
};

export { person };
