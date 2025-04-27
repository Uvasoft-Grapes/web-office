export const BASE_URL = "http://localhost:3000";

export const API_PATHS = {
  AUTH:{
    REGISTER:"/api/auth/register", // Name, Email, Password and Invitation Token required. Return Admin or Auth Token
    LOGIN:"/api/auth/login", // Email and Password required. Return Admin or Auth Token
    GET_PROFILE:"/api/auth/profile", // Auth Token required 
    UPLOAD_IMAGE:"/api/auth/upload-image" // Auth Token required. Change profile image
  },

  USERS:{
    GET_ALL_USERS:"/api/users", // Admin Token required
    GET_USER_BY_ID:(userId:string) => `/api/users/${userId}`, // Auth Token required
    UPDATE_USER:(userId:string) => `/api/users/${userId}`, // Auth Token required
    DELETE_USER:(userId:string) => `/api/users/${userId}`, // Admin Token required
    GET_TOKEN:(type:string)=>`/api/auth/invite-token/${type}`, // Admin Token required
    UPDATE_ROLE:(userId:string)=>`/api/users/${userId}/role`, // Admin Token required
  },

  AVATARS:[
    "/public/profile-img/1.webp",
    "/public/profile-img/2.webp",
    "/public/profile-img/3.webp",
    "/public/profile-img/4.webp",
    "/public/profile-img/5.webp",
    "/public/profile-img/6.webp",
    "/public/profile-img/7.webp",
    "/public/profile-img/8.webp",
    "/public/profile-img/9.webp",
    "/public/profile-img/10.webp",
    "/public/profile-img/11.webp",
    "/public/profile-img/12.webp",
    "/public/profile-img/13.webp",
  ],

  DESKS:{
    CREATE_DESK:"/api/desks", // Admin Token required
    GET_ALL_DESKS:"/api/desks", // Auth Token required
    GET_DESK:(deskId:string) => `/api/desks/${deskId}`, // Auth Token required
    UPDATE_DESK:(deskId:string) => `/api/desks/${deskId}`, // Admin Token required
    DELETE_DESK:(deskId:string) => `/api/desks/${deskId}`, // Admin Token required
  },

  DASHBOARD:{
    GET_TASKS_DATA:"/api/dashboard/tasks", // Admin Token required
  },

  TASKS:{
    GET_ALL_TASKS:"/api/tasks", // Auth Token required. Filter Admin (all) and User (assigned)
    GET_TASK_BY_ID:(taskId:string) => `/api/tasks/${taskId}`, // Auth Token required
    CREATE_TASK:"/api/tasks", // Admin Token required
    UPDATE_TASK:(taskId:string) => `/api/tasks/${taskId}`, // Auth Token required
    UPDATE_TODO_CHECKLIST:(taskId:string) => `/api/tasks/${taskId}/todo`, // Auth Token required
    DELETE_TASK:(taskId:string) => `/api/tasks/${taskId}`, // Admin Token required
  },
};