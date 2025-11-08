import axios from "axios";

export async function getPastSixMonOfMatters() {
  return axios
    .get("http://localhost:3001/proxy/matters")
    .then((response) => response.data)
    .catch((error) => console.error(error));
}

export async function getFilteredMatters(filter) {
  return axios
    .get(
      `http://localhost:3001/proxy/filtered-matters?filter=${encodeURIComponent(
        filter
      )}`
    )
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => console.error(error));
}

export async function getMatters() {
  return axios
    .get("http://localhost:8080/wp-json/wp/v2/matter?matterType=passed")
    .then((response) => response?.data)
    .catch((error) => console.error(error));
}
export async function getInProgMatters() {
  return axios
    .get("http://localhost:8080/wp-json/wp/v2/matter?matterType=in-progress")
    .then((response) => response?.data)
    .catch((error) => console.error(error));
}

export async function getMatterHistory(matterId) {
  return axios
    .get(`http://localhost:3001/proxy/matterhistory/${matterId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.error(error));
}
