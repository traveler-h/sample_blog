import http from '@/service/http'

export const regist = (data: {userName: string, userPassword: string}) => {
  return http.post('/user/register', data)
}
export const login = (data: {userName: string, userPassword: string}) => {
  return http.get('/user/login', data)
}