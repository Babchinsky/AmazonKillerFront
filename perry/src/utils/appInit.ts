import { initializeTokens, initializeDeviceId } from "./auth/authToken";


function initializeApp() {
  initializeDeviceId();
  initializeTokens();
}

export { initializeApp };
