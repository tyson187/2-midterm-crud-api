export interface CreateTaskDto {
    title: string;
    description?: string;
    priority?: string;
    status?: string;
    dueDate?: Date | string | null;
    categoryId?: number | null;
}