import api from "./axios";

export const getAllBlog = async (page = 1, limit = 10) => {
    const res = await api.get('/blog', {
        params: {
            page,
            limit
        }
    })
    return res.data
} 