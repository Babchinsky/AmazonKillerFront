import { initializeTokens, initializeDeviceId } from './authToken';

export const initializeApp = () => {
  // Инициализация deviceId
  initializeDeviceId();
  
  // Инициализация токенов
  initializeTokens();
  
  // Здесь можно добавить другую инициализацию приложения
}; 