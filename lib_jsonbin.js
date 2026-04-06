const BASE_URL = "https://api.jsonbin.io/v3";

function getHeaders() {
  const masterKey = process.env.JSONBIN_MASTER_KEY || process.env.JSONBIN_API_KEY;

  return {
    "Content-Type": "application/json",
    "X-Master-Key": masterKey
  };
}

export async function readBin(binId) {
  const res = await fetch(`${BASE_URL}/b/${binId}?meta=false`, {
    method: "GET",
    headers: {
      ...getHeaders(),
      "X-Bin-Meta": "false"
    },
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`Failed to read JSONBin: ${res.status}`);
  }

  return res.json();
}

export async function updateBin(binId, data) {
  const res = await fetch(`${BASE_URL}/b/${binId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(`Failed to update JSONBin: ${res.status}`);
  }

  return res.json();
}
