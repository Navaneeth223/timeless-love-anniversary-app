export function encodeConfig(config) {
  try {
    const json = JSON.stringify(config);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (error) {
    console.error("Failed to encode config", error);
    return "";
  }
}

export function decodeConfig(encoded) {
  try {
    if (!encoded) return null;
    const padded = encoded.padEnd(encoded.length + (4 - (encoded.length % 4)) % 4, "=");
    const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to decode config", error);
    return null;
  }
}
