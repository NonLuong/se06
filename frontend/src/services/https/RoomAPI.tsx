import { RoomInterface } from "../../interfaces/IRoom";

const apiUrl = "http://localhost:8080";

// GET all rooms
export async function GetRooms() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/rooms`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// GET room by ID
export async function GetRoomById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(`${apiUrl}/rooms/${id}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// POST (Create) a new room
export async function CreateRoom(data: RoomInterface) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/rooms`, requestOptions)
    .then((res) => (res.status === 201 ? res.json() : false));

  return res;
}

// PATCH (Update) an existing room
export async function UpdateRoomById(p0: number, data: RoomInterface) {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  const res = await fetch(`${apiUrl}/rooms/${data.ID}`, requestOptions)
    .then((res) => (res.status === 200 ? res.json() : false));

  return res;
}

// DELETE a room by ID
export async function DeleteRoomById(id: number) {
    try {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      const res = await fetch(`${apiUrl}/rooms/${id}`, requestOptions);
      return res.status === 200 ? { status: 200 } : { status: res.status, error: true };
    } catch (e) {
      console.error("Error deleting room:", e);
      return { status: 500, error: true };
    }
  }
  