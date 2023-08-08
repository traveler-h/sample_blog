import http from '@/service/http'
export const getAllCategoryList = () => {
  return http.get('/category/getAllCategoryList')
}
export const getCategoryById = (id: number) => {
  return http.get(`/category/getCategoryById/${id}`)
}
export const createCategory = (params: any) => {
  return http.post('/category/createCategory', params)
}
export const updateCategory = (params: any) => {
  return http.put('/category/updateCategory', params)
}
export const deleteCategory = (id: number) => {
  return http.delete(`/category/deleteCategory/${id}`)
}

