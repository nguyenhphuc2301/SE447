const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

//Lấy danh sách phòng 
export async function fetchDorms(params) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params || {})) {
    if (value == null || value === "") continue;
    if (Array.isArray(value)) {
      if (value.length > 0) searchParams.append(key, value.join(","));
    } else {
      searchParams.append(key, value);
    }
  }

  const res = await fetch(`${API}/dorms?${searchParams.toString()}`);
  if (!res.ok) throw new Error(" Lỗi API /dorms");
  return res.json();
}


export async function fetchDormDetail(id) {
  const res = await fetch(`${API}/dorms/${id}`);
  if (!res.ok) throw new Error(" Lỗi API /dorms/:id");
  return res.json();
}


// Lấy chi tiết phòng theo id
export async function getDormById(id) {
  const res = await fetch(`${API}/dorms/${id}`);
  if (!res.ok) throw new Error("Không lấy được phòng");
  return await res.json();
}
