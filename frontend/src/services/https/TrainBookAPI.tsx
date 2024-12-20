import { TrainbookInterface } from "../../interfaces/ITrainbook";

const apiUrl = "http://localhost:8080";

// GET all trainbooks
export async function GetTrainbooks() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/trainbook`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// GET trainbook by ID
export async function GetTrainbookById(id: number) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/trainbook/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// POST (Create) a new trainbook
export async function CreateTrainbook(data: TrainbookInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/trainbook`, requestOptions)
    .then((res) => (res.status === 201 ? res.json() : false));

  return res;
}

// PATCH (Update) an existing trainbook
export async function UpdateTrainbookById(data: TrainbookInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/trainbook/${data.ID}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// DELETE a trainbook by ID
export async function DeleteTrainbookById(id: number) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/trainbook/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? true : false));

  return res;
}
