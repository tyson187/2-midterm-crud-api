import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Task } from '../entities/Task';
import bcrypt from 'bcrypt';

async function seed() {
    await AppDataSource.initialize();
    console.log('Database connected for seeding...');

    const userRepo = AppDataSource.getRepository(User);
    const taskRepo = AppDataSource.getRepository(Task);

    await taskRepo.delete({});
    await userRepo.delete({});

    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const usersToCreate = Array.from({ length: 5 }).map((_, i) =>
        userRepo.create({
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            password: hashedPassword,
            phoneNumber: `+1555000${i + 1}`,
        })
    );

    const savedUsers = await userRepo.save(usersToCreate);

    const tasksToCreate = Array.from({ length: 15 }).map((_, i) => {
        const user = savedUsers[i % savedUsers.length];
        return taskRepo.create({
            title: `Task #${i + 1} for ${user.email}`,
            status: i % 2 === 0 ? 'completed' : 'pending',
            priority: i % 3 === 0 ? 'high' : 'medium',
            userId: user.id,
            isDeleted: false,
        });
    });

    await taskRepo.save(tasksToCreate);
    console.log('Seeding complete! Inserted 5 users and 15 tasks.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
});
