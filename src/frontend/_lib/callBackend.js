/**
 * Make an HTTP request to python server running on port 4200
 * @param {{ method: string; path: string; body?: Record<string, any> }} args
 * @returns {Promise<Record<string, any>>} - Response data
 */
export async function callBackend({ method = "GET", path, body = undefined }) {
  try {
    // prettier-ignore
    const url = `${location.protocol}//${location.host.replace('3000', '4200')}${path}`
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method,
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.success === false) {
      throw Error(data.error || "");
    }

    return data;
  } catch (e) {
    console.error(e);

    const $toast = document.getElementById("toast");
    $toast.classList.add("show");

    setTimeout(() => {
      $toast.classList.remove("show");
    }, 3500);

    return { error: e };
  }
}
