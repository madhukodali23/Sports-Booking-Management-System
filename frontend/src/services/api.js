const BASE = 'http://localhost:5000/api';

export async function fetchJson(path) {
  const res = await fetch(BASE + path);
  const data = await res.json();
  return data;
}

export async function postJson(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  return json;
}
