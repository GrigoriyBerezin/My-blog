import axios from "axios"

const instance = axios.create({
    baseURL: "http://localhost:8080/api",
})
// к каждому запросу добавляем headers.Authorization с нашим токеном
instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem("token")

    return config
})

export default instance
