import { GoogleGenerativeAI } from '@google/generative-ai';

// Action Types
export const ADD_TASK = "ADD_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const SET_PRIORITY = "SET_PRIORITY";
export const SET_AI_RESPONSE = "SET_AI_RESPONSE";
export const SET_IMAGES = "SET_IMAGES";
export const SET_LOADING = "SET_LOADING";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

// Action Creators
export const addTask = (task: { task: string; priority: string }) => ({ 
  type: ADD_TASK, 
  payload: task 
});

export const deleteTask = (index: number) => ({ 
  type: DELETE_TASK, 
  payload: index 
});

export const setPriority = (index: number, priority: string) => ({
  type: SET_PRIORITY,
  payload: { index, priority },
});

export const setAIResponse = (response: string) => ({ 
  type: SET_AI_RESPONSE, 
  payload: response 
});

export const setImages = (images: any[]) => ({ 
  type: SET_IMAGES, 
  payload: images 
});

export const setLoading = (loading: boolean) => ({
  type: SET_LOADING,
  payload: loading
});

export const login = (username: string) => ({
  type: LOGIN,
  payload: username
});

export const logout = () => ({
  type: LOGOUT
});

// Async Actions
export const fetchAIResponse = (prompt: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const genAI = new GoogleGenerativeAI('AIzaSyCwVKTmn2Swxl-ka6fup2nXlM6kL8PT0r4');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    dispatch(setAIResponse(text.replace(/\*/g, '•')));
  } catch (error) {
    console.error("Error fetching AI response:", error);
    dispatch(setAIResponse("Sorry, I couldn't process your request at the moment."));
  } finally {
    dispatch(setLoading(false));
  }
};

export const searchImages = (query: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=6`,
      {
        headers: {
          Authorization: 'Client-ID dORVlebRoCUa-qZCTit3Rb852xFAiR0FewqgNwaj-nA'
        }
      }
    );
    const data = await response.json();
    dispatch(setImages(data.results));
  } catch (error) {
    console.error("Error fetching images:", error);
  } finally {
    dispatch(setLoading(false));
  }
};