import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../../utils/axios"

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    status: null,
}

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async ({ username, password }) => {
        try {
            const { data } = await axios.post("/auth/register", {
                username,
                password,
            })
            if (data.token) {
                window.localStorage.setItem("token", data.token)
            }
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async ({ username, password }) => {
        try {
            const { data } = await axios.post("/auth/login", {
                username,
                password,
            })
            if (data.token) {
                window.localStorage.setItem("token", data.token)
            }
            return data
        } catch (error) {
            console.log(error)
        }
    }
)

export const getMe = createAsyncThunk("auth/loginUser", async () => {
    try {
        const { data } = await axios.get("/auth/me")
        return data
    } catch (error) {
        console.log(error)
    }
})

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isLoading = false
            state.status = null
        },
    },
    extraReducers: {
        // Register user
        // запрос отправляется
        [registerUser.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        // запрос выполнился
        [registerUser.fulfilled]: (state, action) => {
            state.isLoading = false
            state.status = action.payload.message
            state.user = action.payload.user
            state.token = action.payload.token
        },
        // возникла ошибка
        [registerUser.rejected]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },
        // Login user
        // запрос отправляется
        [loginUser.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        // запрос выполнился
        [loginUser.fulfilled]: (state, action) => {
            state.isLoading = false
            state.status = action.payload.message
            state.user = action.payload.user
            state.token = action.payload.token
        },
        // возникла ошибка
        [loginUser.rejected]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },
        // Get Me проверка авторизации
        // запрос отправляется
        [getMe.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        // запрос выполнился
        [getMe.fulfilled]: (state, action) => {
            state.isLoading = false
            state.status = null
            state.user = action.payload?.user
            state.token = action.payload?.token
        },
        // возникла ошибка
        [getMe.rejected]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },
    },
})

export const checkIsAuth = (state) => Boolean(state.auth.token)

export const { logout } = authSlice.actions
export default authSlice.reducer
