import { TIMEOUT_SEC } from './config.js';

function timeout(s) {
  return new Promise((_, reject) => {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

// function that fetch data from the given URL and return it
export async function getJSON(url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // makes the promise rejected state
  }
}
