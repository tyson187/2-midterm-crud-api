import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { UserController } from '../controllers/userController';


export const taskRoutes = Router();


// Nested routes under users
taskRoutes.get('/users/:userId/tasks', TaskController.getUserTasks);
taskRoutes.post('/users/:userId/tasks', TaskController.createTask);
taskRoutes.get('/users/:userId/stats', UserController.getUserStats);


// Direct task routes
taskRoutes.delete('/tasks/:id', TaskController.softDeleteTask);
taskRoutes.delete('/tasks/:id/permanent', TaskController.deleteTask);
