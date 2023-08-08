import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
const useUserStore = defineStore('user',
  () => {
    let userInfo: {userName: string, userPassword: string} = reactive({
      userName: '',
      userPassword: ''
    })
    const setUserInfo = (data: {userName: string, userPassword: string}) => {
      userInfo = data
    }
    return { userInfo, setUserInfo }
  },
  { persist: true }
)
export default useUserStore