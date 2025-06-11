export interface TypeUser {
  _id:string;
  name:string;
  email:string;
  password?:string;
  profileImageUrl?:string | null;
  role:"owner"|"admin"|"user"|"client";
  pendingTasks?:number,
  inProgressTasks?:number,
  completedTasks?:number
  createdAt?:Date;
  updatedAt?:Date;
  token?:string;
};

export interface TypeSession {
  _id:string,
  checkIn:Date,
  checkOut:Date|null,
  hours:number,
};

export interface TypeDesk {
  _id:string;
  title:string;
  members:TypeUser[];
};

export interface TypeFolder {
  _id:string;
  desk:string;
  title:string;
};

export interface TypeAssigned {
  _id:string,
  email?:string;
  name?:string;
  profileImageUrl?:string;
};

export interface TypeCategory {
  _id:string;
  desk:string;
  type:"transaction"|"movement"|"product";
  icon:number;
  label:string;
};

//! Tasks

export interface TypeTodo {
  text:string;
  completed?:boolean;
};

export interface TypeTask {
  _id:string;
  desk:string;
  folder:TypeFolder;
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

export interface TypeTasksDashboardData {
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

export interface TypeTaskStatusSummary {
  allTasks:number;
  pendingTasks:number;
  inProgressTasks:number;
  completedTasks:number;
}

//! Accounts

export interface TypeTransactionsStatusSummary {
  pending:number;
  completed:number;
  canceled:number;
};

export interface TypeAccount {
  _id:string;
  desk:string;
  folder:TypeFolder;
  assignedTo:TypeAssigned[];
  title:string;
  balance:number;
  transactions?:TypeTransaction[];
  statusSummary?:TypeTransactionsStatusSummary
};

export interface TypeTransaction {
  _id:string;
  account:string;
  type:"income"|"expense";
  category:TypeCategory;
  title:string;
  description:string,
  amount:number;
  date:Date;
  createdBy:TypeAssigned;
  status:"Pendiente"|"Finalizado"|"Cancelado";
};

export type TypeAccountsDashboardData = {
  generalInfo: {
    totalBalance:number;
    totalIncome:number;
    totalExpense:number;
    totalPending:number;
  };
  transactionsAnalysis: {
    recentTransactions:TypeTransaction[];
    categoryDistribution:{ label:string, count:number }[];
  };
  timeAnalysis: {
    monthlyTrends: Array<{ month: string; income: number; expense: number; transactions:number }>;
  };
  insights: {
    transactionsStatuses:{ total:number, pending:number, completed:number, canceled:number };
    topAccounts:{ income:Array<{ _id:string; total:number }>, expense:Array<{ _id:string; total:number }>, balance:Array<{ _id:string; total:number }> };
  };
};

//! Inventory

export interface TypeMovementsStatusSummary {
  pending:number;
  completed:number;
  canceled:number;
};

export interface TypeInventory {
  _id:string;
  desk:string;
  folder:TypeFolder;
  title:string;
  location?:string;
  assignedTo:TypeAssigned[];
  products?:TypeProduct[];
  movements?:TypeMovement[],
  statusSummary?:TypeMovementsStatusSummary,
};

export interface TypeProduct {
  _id:string;
  desk:string;
  folder:TypeFolder;
  title:string;
  description?:string;
  category:TypeCategory;
  price:number;
  stock:number;
  movements?:TypeMovement[];
};

export interface TypeMovementProduct {
  _id:string;
  title:string;
  description?:string;
  category:TypeCategory;
  price:number;
  stock:number;
};

export interface TypeMovement {
  _id:string;
  inventory:string;
  product:TypeMovementProduct;
  createdBy:TypeAssigned;
  type:"inflow"|"outflow";
  category:TypeCategory;
  title:string;
  description?:string;
  quantity:number;
  date:Date;
  status:"Pendiente"|"Finalizado"|"Cancelado";
};

//! Calendar

export interface TypeRecurrence {
  frequency:"daily" | "weekly" | "monthly" | "yearly";
  endFrequency:Date;
};

export interface TypeEvent {
  _id:string;
  desk:string;
  folder:TypeFolder;
  title:string;
  description?:string;
  startDate:Date;
  endDate:Date;
  createdBy:TypeAssigned;
  assignedTo:TypeAssigned[];
  recurrence?:TypeRecurrence;
  createdAt?:Date;
  updatedAt?:Date;
};

export interface TypeEventsDashboardData {
  totalEvents: number;
  eventsByHour:{ label:string; count:number; }[];
  eventsByFolder:{ label:string; count:number; }[];
  recurrence:{
    eventsToday:TypeEvent[];
    eventsByMonth:{ label:string; count:number; }[];
    recurrenceStats:{ label:string; count:number; }[];
  }
};

//! Reports

export interface TypeReport {
  _id:string;
  desk:string;
  folder:TypeFolder;
  createdBy:TypeAssigned;
  title:string;
  description?:string;
  date:Date;
  createdAt?:Date;
  updatedAt?:Date;
};


//! Goals

export interface TypeObjective {
  text:string;
  dueDate:Date;
  completed?:boolean;
};

export interface TypeGoal {
  _id:string;
  desk:string;
  folder:TypeFolder;
  title:string;
  description:string;
  priority:"Baja" | "Media" | "Alta";
  status?:"Pendiente" | "En curso" | "Finalizada";
  dueDate?:Date;
  assignedTo:TypeAssigned[];
  createdBy?:string;
  objectives:TypeObjective[];
  progress:number;
  createdAt?:Date;
  updatedAt?:Date;
};

export interface TypeGoalStatusSummary {
  all:number;
  pending:number;
  inProgress:number;
  completed:number;
}