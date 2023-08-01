/**
 * Get browser cookie by name
 * @param {string} name
 * @returns {string | undefined} Browser cookie value with matching name
 */
export function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      return cookie.substring(name.length + 1);
    }
  }
}
