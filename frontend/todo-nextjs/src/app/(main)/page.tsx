import { cookies } from 'next/headers';
import TaskList from '@/components/TaskList';
import { Suspense } from 'react';

// Тип для задачи
export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: boolean;
    created_at: string;
    owner_id: number;
}

// Асинхронная функция для получения задач на сервере
async function getTasks(token: string): Promise<Task[]> {
    try {
        const res = await fetch('http://46.148.238.212:8000/tasks/', {
            headers: {
                Cookie: `access_token=${token}`,
            },
            cache: 'no-store', // Не кэшировать запросы задач
        });

        if (!res.ok) {
            console.error("Failed to fetch tasks, status:", res.status);
            return [];
        }
        const tasks = await res.json();
        // Сортировка по дате создания
        return tasks.sort((a: Task, b: Task) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}


export default async function HomePage() {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('access_token');

    // Получаем задачи на сервере
    const initialTasks = tokenCookie ? await getTasks(tokenCookie.value) : [];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <Suspense fallback={<p>Loading tasks...</p>}>
              {/* Передаем задачи в клиентский компонент */}
              <TaskList initialTasks={initialTasks} />
            </Suspense>
        </div>
    );
}