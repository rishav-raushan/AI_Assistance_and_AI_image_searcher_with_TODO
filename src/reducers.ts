// Authentication and Task Management Reducer
import { ADD_TASK, DELETE_TASK, SET_PRIORITY, SET_AI_RESPONSE, SET_IMAGES, SET_LOADING, LOGIN, LOGOUT } from "./actions";

interface Task {
  task: string;
  priority: string;
}

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface State {
  tasks: Task[];
  aiResponse: string | null;
  images: any[];
  loading: boolean;
  user: User;
}

const initialState: State = {
  tasks: [],
  aiResponse: null,
  images: [],
  loading: false,
  user: {
    username: "",
    isAuthenticated: false
  }
};

// Helper function to sort tasks by priority
const sortTasksByPriority = (tasks: Task[]) => {
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  return [...tasks].sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]);
};

const rootReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_TASK:
      const newTasks = [...state.tasks, action.payload];
      return { ...state, tasks: sortTasksByPriority(newTasks) };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((_, index) => index !== action.payload),
      };
    case SET_PRIORITY:
      const updatedTasks = state.tasks.map((task, index) =>
        index === action.payload.index
          ? { ...task, priority: action.payload.priority }
          : task
      );
      return {
        ...state,
        tasks: sortTasksByPriority(updatedTasks),
      };
    case SET_AI_RESPONSE:
      // Format AI response for better readability
      const formattedResponse = action.payload
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
        .join('\n');
      return { ...state, aiResponse: formattedResponse };
    case SET_IMAGES:
      return { ...state, images: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case LOGIN:
      return {
        ...state,
        user: {
          username: action.payload,
          isAuthenticated: true
        }
      };
    case LOGOUT:
      return {
        ...state,
        user: {
          username: "",
          isAuthenticated: false
        }
      };
    default:
      return state;
  }
};

export default rootReducer;