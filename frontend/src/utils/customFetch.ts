import { SERVER_URL } from './variables';

// <사용 예시>
//
// useEffect(() => {
//   async function fetchData() {
//     try {
//       const json = await customFetch('GET', '/user/me');
//       // user 정보 zustand에 저장하기
//       setIsLogin(true);
//     } catch (e) {
//       setIsLogin(false);
//     } finally {
//       setIsLoaded(true);
//     }
//   }
//   fetchData();
// }, []);

// accessToken이 쿠키에 있다면 읽어서 Authorization 헤더에 넣어주는 일 자동화

function isJsonString(str: string) {
  try {
    var json = JSON.parse(str);
    return typeof json === 'object';
  } catch (e) {
    return false;
  }
}

export async function customFetch(method: string, path: string, body?: Object) {
  method = method.toUpperCase();
  if (path[0] !== '/') {
    path = `/${path}`;
  }
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };
  const cookies = Object.fromEntries(
    document.cookie.split(';').map((cookie) => cookie.trim().split('='))
  );
  if ('accessToken' in cookies) {
    const bearerToken: string = cookies['accessToken'];
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }

  let response;
  if (body === undefined) {
    response = await fetch(SERVER_URL + path, {
      method: method,
      headers: headers,
    });
  } else {
    response = await fetch(SERVER_URL + path, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    });
  }
  const text = await response.text();
  if (!isJsonString(text)) {
    if (!response.ok) {
      throw Error(`${response.status} ${text}`);
    }
    return text;
  }
  const json = JSON.parse(text);
  if (!response.ok) {
    throw Error(`${response.status} ${json.message}`);
  }
  return json;
}
