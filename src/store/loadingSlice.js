import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        value: true,
    },
    reducers: {
        set: (state, action) => {
            state.value = action.payload
        },
    },
})

export const { set } = loadingSlice.actions
export default loadingSlice.reducer
