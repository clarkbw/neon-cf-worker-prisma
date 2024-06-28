export function getBearer(request: Request): null | string {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || authHeader.substring(0, 6) !== "Bearer") {
    return null;
  }
  return authHeader.substring(6).trim();
}

export async function authenticate(request: Request, env: any, context: any) {
  const token = getBearer(request);
  console.log(`token = ${token}`);
  env.authenticated = token === env.AUTH_TOKEN;
}
