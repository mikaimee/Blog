import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000'}),
    tagTypes: ['User', 'Post', 'Comment'],
    endpoints: builder => ({})
})