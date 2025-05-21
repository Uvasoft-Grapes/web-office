export const BASE_URL = "http://localhost:3000";

export const API_PATHS = {
  AUTH:{
    REGISTER:"/api/auth/register", // Name, Email, Password and Invitation Token required. Return Admin or Auth Token
    LOGIN:"/api/auth/login", // Email and Password required. Return Admin or Auth Token
    LOGOUT:"/api/auth/logout", // Endpoint to delete the cookie on the server
    GET_PROFILE:"/api/auth/profile", // Auth Token required 
    GET_TOKEN:(type:string)=>`/api/auth/invite-token?role=${type}`, // Admin Token required
  },

  USERS:{
    GET_ALL_USERS:"/api/users", // Owner Token required
    GET_MEMBERS:"/api/users/members", // Admin Token required
    GET_USER_BY_ID:(userId:string) => `/api/users/${userId}`, // Auth Token required
    UPDATE_USER:(userId:string) => `/api/users/${userId}`, // Auth Token required
    DELETE_USER:(userId:string) => `/api/users/${userId}`, // Admin Token required
    UPDATE_ROLE:(userId:string)=>`/api/users/${userId}/role`, // Admin Token required
  },

  SESSIONS:{
    GET_USER_SESSIONS:"/api/sessions", // Admin Token required
    UPDATE_SESSION:(sessionId:string)=>`/api/sessions/${sessionId}`, // Admin Token required
    DELETE_SESSION:(sessionId:string)=>`/api/sessions/${sessionId}`, // Admin Token required
  },

  DESKS:{
    CREATE_DESK:"/api/desks", // Admin Token required
    GET_ALL_DESKS:"/api/desks", // Auth Token required
    GET_DESK:(deskId:string) => `/api/desks/${deskId}`, // Auth Token required
    UPDATE_DESK:(deskId:string) => `/api/desks/${deskId}`, // Admin Token required
    DELETE_DESK:(deskId:string) => `/api/desks/${deskId}`, // Admin Token required
    EXIT_DESK:"/api/desks/exit",
    GET_MEMBERS:"/api/desks/members",
  },

  FOLDERS:{
    CREATE_FOLDER:"/api/folders", // Admin Token required
    GET_ALL_FOLDERS:"/api/folders", // Auth Token required
    GET_FOLDER:(folderId:string) => `/api/folders/${folderId}`, // Auth Token required
    UPDATE_FOLDER:(folderId:string) => `/api/folders/${folderId}`, // Admin Token required
    DELETE_FOLDER:(folderId:string) => `/api/folders/${folderId}`, // Admin Token required
  },

  DASHBOARD:{
    GET_TASKS_DATA:"/api/dashboard/tasks", // Auth Token required
    GET_ACCOUNTS_DATA:"/api/dashboard/accounts", // Auth Token required
  },

  TASKS:{
    GET_ALL_TASKS:"/api/tasks", // Auth Token required. Filter Admin (all) and User (assigned)
    GET_TASK_BY_ID:(taskId:string) => `/api/tasks/${taskId}`, // Auth Token required
    CREATE_TASK:"/api/tasks", // Admin Token required
    UPDATE_TASK:(taskId:string) => `/api/tasks/${taskId}`, // Auth Token required
    UPDATE_TODO_CHECKLIST:(taskId:string) => `/api/tasks/${taskId}/todo`, // Auth Token required
    DELETE_TASK:(taskId:string) => `/api/tasks/${taskId}`, // Admin Token required
  },

  ACCOUNTS:{
    GET_ALL_ACCOUNTS:"/api/accounts", // Auth Token required. Filter Admin (all) and User (assigned)
    GET_ACCOUNT_BY_ID:(accountId:string) => `/api/accounts/${accountId}`, // Auth Token required
    CREATE_ACCOUNT:"/api/accounts", // Admin Token required
    UPDATE_ACCOUNT:(accountId:string) => `/api/accounts/${accountId}`, // Auth Token required
    DELETE_ACCOUNT:(accountId:string) => `/api/accounts/${accountId}`, // Admin Token required
    CREATE_TRANSACTION:`/api/accounts/transactions`, // Admin Token required
    UPDATE_TRANSACTION:(transactionId:string) => `/api/accounts/transactions/${transactionId}`, // Admin Token required
    DELETE_TRANSACTION:(transactionId:string) => `/api/accounts/transactions/${transactionId}`, // Admin Token required
  },
};