const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const SendNotificationResponse = async (formData) => {
  try {
    const response = await fetch(`${backendUrl}/notificationresponse`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      body: JSON.stringify(formData),
      credentials: 'include',
    });
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('SendNotificationResponse error');
    console.log(error);
    return { server: 'fail', error: 'Error 500, Internal server error!' };
  }
};
