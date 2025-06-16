import { v4 as uuidv4 } from "uuid";


const deviceIdKey = "deviceId";

function getDeviceId() {
  let deviceId = localStorage.getItem(deviceIdKey);

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(deviceIdKey, deviceId);
  }

  return deviceId;
}

export { getDeviceId };