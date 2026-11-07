import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Task } from '../entities/Task';
import { User } from '../entities/User';
import { Category } from '../entities/Category';
import { CreateTaskDto } from '../dto/CreateTaskDto';

const taskRepository = AppDataSource.getRepository(Task);
const userRepository = AppDataSource.getRepository(User);
const categoryRepository = AppDataSource.getRepository(Category);


export class TaskController {
    // GET /api/users/:userId/tasks - Get all tasks for a user
    static async getUserTasks(req: Request<{ userId: string }>, res: Response) {
        try {
            const userIdParam = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
            const userId = parseInt(userIdParam, 10);

            if (Number.isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_ID', message: 'User ID must be a number' }
                });
            }

            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'USER_NOT_FOUND', message: 'User not found' }
                });
            }

            const { status, priority, page = '1', limit = '2', sortBy = 'createdAt', order = 'DESC' } = req.query;
            const pageNum = parseInt(String(page), 10) || 1;
            const limitNum = parseInt(String(limit), 10) || 2;
            const skip = (pageNum - 1) * limitNum;

            const whereClause: any = { userId, isDeleted: false };
            if (status) whereClause.status = status as string;
            if (priority) whereClause.priority = priority as string;

            const validSortColumns = ['createdAt', 'title', 'status', 'priority'];
            const sortColumn = validSortColumns.includes(String(sortBy)) ? String(sortBy) : 'createdAt';
            const sortOrder = String(order).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

            const [tasks, total] = await taskRepository.findAndCount({
                where: whereClause,
                order: { [sortColumn]: sortOrder },
                skip,
                take: limitNum,
            });

            return res.json({
                success: true,
                data: tasks,
                meta: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                }
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch tasks' }
            });
        }
    }


    // POST /api/users/:userId/tasks - Create a task for a user
    static async createTask(req: Request<{ userId: string }, {}, CreateTaskDto>, res: Response) {
        try {
            const userIdParam = Array.isArray(req.params.userId)
                ? req.params.userId[0]
                : req.params.userId;

            const userId = parseInt(userIdParam, 10);
            const { title, status, priority, categoryId } = req.body;

            if (Number.isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_ID', message: 'User ID must be a number' }
                });
            }

            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'USER_NOT_FOUND', message: 'User not found' }
                });
            }

            if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_STATUS', message: 'Invalid status value' }
                });
            }

            if (priority && !['low', 'medium', 'high'].includes(priority)) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_PRIORITY', message: 'Invalid priority value' }
                });
            }

            if (categoryId !== undefined && categoryId !== null) {
                if (!Number.isInteger(categoryId) || categoryId <= 0) {
                    return res.status(400).json({
                        success: false,
                        error: { code: 'INVALID_CATEGORY_ID', message: 'Category ID must be a positive number' }
                    });
                }

                const category = await categoryRepository.findOne({ where: { id: categoryId } });
                if (!category) {
                    return res.status(404).json({
                        success: false,
                        error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found' }
                    });
                }
            }

            const taskData: Partial<Task> = {
                title,
                status: (status as any) || 'pending',
                priority: (priority as any) || 'medium',
                userId,
                categoryId: categoryId ?? null,
                isDeleted: false,
            };

            const task = taskRepository.create(taskData);
            const savedTask = await taskRepository.save(task);

            return res.status(201).json({
                success: true,
                message: 'Task created successfully',
                data: savedTask
            });
        } catch (error) {
            console.error('Error creating task:', error);
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Failed to create task' }
            });
        }
    }


    // Soft delete a task
    static async softDeleteTask(req: Request<{ id: string }>, res: Response) {
        try {
            const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id = parseInt(idParam, 10);

            if (Number.isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_ID', message: 'Task ID must be a number' }
                });
            }

            const task = await taskRepository.findOneBy({ id, isDeleted: false });
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'TASK_NOT_FOUND', message: 'Task not found.' }
                });
            }

            task.isDeleted = true;
            await taskRepository.save(task);

            return res.json({
                success: true,
                message: 'Task soft-deleted successfully.'
            });
        } catch (error) {
            console.error('Error soft deleting task:', error);
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Failed to soft delete task' }
            });
        }
    }


    // DELETE /api/tasks/:id - Delete a task
    static async deleteTask(req: Request, res: Response) {
        try {
            const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const id = parseInt(idParam, 10);

            if (Number.isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_ID', message: 'Task ID must be a number' }
                });
            }

            const task = await taskRepository.findOne({ where: { id } });
            if (!task) {
                return res.status(404).json({
                    success: false,
                    error: { code: 'TASK_NOT_FOUND', message: 'Task not found' }
                });
            }

            await taskRepository.remove(task);

            res.json({
                success: true,
                message: 'Task deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Failed to delete task' }
            });
        }
    }


    // GET /api/users/:userId/stats - Get user task statistics
    static async getUserStats(req: Request<{ userId: string }>, res: Response) {
        try {
            const userId = parseInt(req.params.userId, 10);

            if (Number.isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    error: { code: 'INVALID_ID', message: 'User ID must be a number.' }
                });
            }

            const totalTasks = await taskRepository.count({ where: { userId, isDeleted: false } });
            const completedTasks = await taskRepository.count({ where: { userId, status: 'completed', isDeleted: false } });
            const pendingTasks = await taskRepository.count({ where: { userId, status: 'pending', isDeleted: false } });

            return res.json({ totalTasks, completedTasks, pendingTasks });
        } catch (error) {
            console.error('Error fetching stats:', error);
            return res.status(500).json({
                success: false,
                error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch user stats' }
            });
        }
    }
}
