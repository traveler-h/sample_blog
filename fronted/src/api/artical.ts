import { ArticalItem } from '@/interfaces/artical'
import http from '@/service/http'

export const getArticalList = (params: {pageNum: number, pageSize: number}) => {
  return http.get('/artical/getList', params)
}

export const getArtical = (params: {id: number}) => {
  return http.get('/artical/getArticalById', params)
}

export const createArtical = (params: ArticalItem) =>{
  return http.post('/artical/createArtical', params)
}

export const updateArtical = (params: ArticalItem) => {
  return http.put('/artical/updateArtical', params)
}

export const deleteArticalById = (id: number) => {
  return http.delete(`/artical/deleteArtical/${id}`)
}

