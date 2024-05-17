import crypto from 'crypto';

const SERVICE_URL = 'https://api.searchad.naver.com';

export function nsaSign(
  uri: string,
  method: string = 'GET',
  api_secret: string
) {
  const timestamp = Date.now();
  const hmac = crypto.createHmac('sha256', api_secret);
  hmac.update(`${timestamp}.${method}.${uri}`);
  return hmac.digest('base64');
}

export async function nsaRequest(
  uri: string,
  params: Record<string, any>,
  method: string,
  api_key: string,
  api_secret: string,
  customer_id: number,
  body?: Record<string, any>
) {
  const timestamp = Date.now();
  const urlSearchParams = new URLSearchParams(params).toString();
  const sign = nsaSign(uri, method, api_secret);
  const headers = {
    'X-Timestamp': `${timestamp}`,
    'X-API-KEY': api_key,
    'X-Customer': `${customer_id}`,
    'X-Signature': sign,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const result = await fetch(
    `${SERVICE_URL}${uri}?${urlSearchParams}`,
    options
  );
  if (!result.ok) {
    throw new Error(`[${result.status}]: ${result.statusText}`);
  }
  return result.json();
}
