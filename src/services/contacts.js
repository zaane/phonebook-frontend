import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newContact => {
    const request = axios.post(baseUrl, newContact)
    return request.then(response => response.data)
}

const update = (id, newContact) => {
    const request = axios.put(`${baseUrl}/${id}`, newContact)
    return request.then(response => response.data)
}

const deleteContact = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response)
}

export default { getAll, create, update, deleteContact }