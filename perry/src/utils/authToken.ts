import { v4 as uuidv4 } from 'uuid';

export let ADMIN_TOKEN = '';
export let REFRESH_TOKEN = '';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const clearAuth = () => {
  // Очищаем переменные
  ADMIN_TOKEN = '';
  REFRESH_TOKEN = '';
  
  // Очищаем localStorage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('deviceId');
};

export const initializeDeviceId = () => {
  const existingDeviceId = localStorage.getItem('deviceId');
  if (!existingDeviceId) {
    const newDeviceId = uuidv4();
    localStorage.setItem('deviceId', newDeviceId);
  }
};

export const updateTokens = (accessToken: string, refreshToken: string) => {
  ADMIN_TOKEN = accessToken;
  REFRESH_TOKEN = refreshToken;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const getStoredTokens = (): { accessToken: string; refreshToken: string } => {
  const accessToken = localStorage.getItem('accessToken') || '';
  const refreshToken = localStorage.getItem('refreshToken') || '';
  return { accessToken, refreshToken };
};

export const initializeTokens = () => {
  const { accessToken, refreshToken } = getStoredTokens();
  if (accessToken && refreshToken) {
    updateTokens(accessToken, refreshToken);
  }
};

export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    // Получаем deviceId из localStorage или создаем новый
    const deviceId = localStorage.getItem('deviceId');
    console.log('DeviceId:', deviceId);
    console.log('Current REFRESH_TOKEN:', REFRESH_TOKEN);
    
    if (!REFRESH_TOKEN || !deviceId) {
      console.log('Missing tokens:', { REFRESH_TOKEN: !!REFRESH_TOKEN, deviceId: !!deviceId });
      throw new Error('Отсутствует refresh token или device ID');
    }

    console.log('Sending refresh token request with:', {
      refreshToken: REFRESH_TOKEN,
      deviceId: deviceId,
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      }
    });

    const response = await fetch('https://amazonkiller-api.greenriver-0a1c5aba.westeurope.azurecontainerapps.io/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        refreshToken: REFRESH_TOKEN,
        deviceId: deviceId
      })
    });

    console.log('Refresh token response status:', response.status);
    const responseText = await response.text();
    console.log('Refresh token response text:', responseText);

    if (!response.ok) {
      throw new Error('Не удалось обновить токен');
    }

    const data: TokenResponse = JSON.parse(responseText);
    console.log('Successfully refreshed tokens');
    updateTokens(data.accessToken, data.refreshToken);
    return true;
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error);
    // Если токены невалидны, очищаем их
    if (error instanceof Error && error.message === 'Не удалось обновить токен') {
      console.log('Clearing invalid tokens');
      clearAuth();
    }
    return false;
  }
};

// Функция для проверки необходимости обновления токена
export const checkAndRefreshToken = async () => {
  try {
    const token = ADMIN_TOKEN;
    if (!token) return false;

    // Декодируем JWT токен
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    
    // Получаем время истечения токена (exp в секундах)
    const expirationTime = decodedPayload.exp * 1000; // Переводим в миллисекунды
    const currentTime = Date.now();
    
    // Если токен истекает через 5 минут или меньше, обновляем его
    if (expirationTime - currentTime <= 5 * 60 * 1000) {
      return await refreshAccessToken();
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return false;
  }
};

// Инициализируем автоматическое обновление токена
setInterval(checkAndRefreshToken, 60 * 1000); // Проверяем каждую минуту
