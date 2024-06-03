const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const GetGroupPostComments = async (formData) => {
  try {
    const response = await fetch(`${backendUrl}/grouppostcomments`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      body: formData,
      credentials: 'include',
    });
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('GetGroupPostComments error');
    console.log(error);
    return { server: 'fail', error: 'Error 500, Internal server error!' };
  }
};
