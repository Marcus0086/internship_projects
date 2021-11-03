import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MapProps } from '../types/userProps';

interface dataState {
    users: [] | never[] | MapProps[],
    userData: MapProps | undefined
}

const initialState: dataState = {
    users: [],
    userData: undefined
}

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        addData: (state, action: PayloadAction<[] | never[]>) => {
            const newUsers = action.payload;
            state.users = newUsers;
        },
        likeUser: (state, action: PayloadAction<number>) => {
            state.users.forEach((user: MapProps) => {
                if (user.id === action.payload) {
                    user.isLiked = true
                }
            })
        },
        dislikeUser: (state, action: PayloadAction<number>) => {
            state.users.forEach((user: MapProps) => {
                if (user.id === action.payload) {
                    user.isLiked = false
                }
            })
        },
        removeUser: (state, action: PayloadAction<number>) => {
            const removedUser = state.users.filter((val: MapProps) => val.id !== action.payload);
            state.users = removedUser;
        },
        updateUser: (state, action: PayloadAction<MapProps>) => {
            const updatedUsers = [...state.users.map((val: MapProps) => {
                if (val.id === action.payload.id) {
                    return { ...action.payload, isLiked: val.isLiked }
                }
                return val
            })];
            state.users = updatedUsers;
        },
        addUserData: (state, action: PayloadAction<MapProps>) => {
            state.userData = action.payload;
        }
    }
})

export const { addData, likeUser, dislikeUser,
    removeUser, updateUser, addUserData } = dataSlice.actions;
export default dataSlice.reducer;