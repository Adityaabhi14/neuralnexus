import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:5000/api' })

export const getQuestions = () => API.get('/questions')
export const getQuestion = (id) => API.get(`/questions/${id}`)
export const postQuestion = (data) => API.post('/questions', data)
export const postAnswer = (id, data) => API.post(`/questions/${id}/answers`, data)
