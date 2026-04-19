import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from '../utils/constantes';
// Define los tipos para las respuestas y errores
interface ApiResponse<T> {
  data: T;
}

interface ApiError {
  message: string;
}

// Define el tipo genérico para las respuestas
type ApiResponseWrapper<T> = AxiosResponse<ApiResponse<T>>;

// Define la URL base de tu API


export async function get<T>(url: string): Promise<T> {
    const apiUrl = `${BASE_URL}${url}`;
    
    try {
      const response: ApiResponseWrapper<T> = await axios.get(apiUrl);
      return response.data.data;
    } catch (error) {
      throw new Error('Ha ocurrido un error al realizar la solicitud GET.');
    }
  }


  export async function post<T, R>(url: string, data: T): Promise<R> {
    const apiUrl = `${BASE_URL}${url}`;
  
    try {
      const response: ApiResponseWrapper<R> = await axios.post(apiUrl, data);
      return response.data.data;
    } catch (error) {
      throw new Error('Ha ocurrido un error al realizar la solicitud POST.');
    }
  } 