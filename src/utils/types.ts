export interface TypeUser {
  _id:string;
  name:string;
  email:string;
  password?:string;
  profileImageUrl?:string | null;
  role:"admin" | "user";
  pendingTasks?:number,
  inProgressTasks?:number,
  completedTasks?:number
  createdAt?:Date;
  updatedAt?:Date;
  token?:string;
};

export interface TypeDesk {
  _id:string;
  title:string;
  members:TypeUser[];
};

export interface TypeTodo {
  text:string;
  completed?:boolean;
};

export interface TypeAssigned {
  _id:string,
  email?:string;
  name?:string;
  profileImageUrl?:string;
};

export interface TypeTask {
  _id:string;
  title:string;
  description:string;
  priority:"Baja" | "Media" | "Alta";
  status?:"Pendiente" | "En curso" | "Finalizada";
  dueDate?:Date;
  assignedTo:TypeAssigned[];
  createdBy?:string;
  attachments:string[];
  todoChecklist:TypeTodo[];
  progress:number;
  createdAt?:Date;
  updatedAt?:Date;
  completedTodoCount?:number;
};

export interface TypeTaskDistribution {
  statistics:{
    totalTasks:number;
    pendingTasks:number;
    inProgressTasks:number;
    completedTasks:number;
    overdueTasks:number;
  },
  charts:{
    taskDistribution:Record<string, number>;
    taskPriorityLevels:Record<string, number>;
  };
  recentTasks:TypeTask[];
};