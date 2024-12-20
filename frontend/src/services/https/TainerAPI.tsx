import { TrainersInterface } from "../../interfaces/ITrainer";

const apiUrl = "http://localhost:8080";

// GET all trainers
export async function GetTrainers() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/trainers`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// GET trainer by ID
export async function GetTrainerById(id: string | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/trainers/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// POST (Create) a new trainer
export async function CreateTrainer(data: TrainersInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/trainers`, requestOptions)
    .then((res) => (res.status === 201 ? res.json() : false));

  return res;
}

// PATCH (Update) an existing trainer
export async function UpdateTrainerById(data: TrainersInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/trainers/${data.ID}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// DELETE a trainer by ID
export async function DeleteTrainerById(id: number): Promise<{ status: number; data?: any } | void> {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(`${apiUrl}/trainers/${id}`, requestOptions);
      if (response.status === 200) {
        const data = await response.json();
        return { status: 200, data };
      }
      return { status: response.status, data: await response.json() };
    } catch (error) {
      console.error("Error deleting trainer:", error);
      return;
    }
  }  