'use client';

import { useState, useMemo } from 'react';
import axios from 'axios';
import type { Task } from '@/app/(main)/page';

interface TaskListProps {
    initialTasks: Task[];
}

export default function TaskList({ initialTasks }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'completed', 'active'
    const [error, setError] = useState('');

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            const response = await axios.post<Task>('/api/tasks', { title, description });
            setTasks([response.data, ...tasks]);
            setTitle('');
            setDescription('');
        } catch (err) {
            setError('Failed to add task.');
        }
    };

    const handleToggleStatus = async (task: Task) => {
        try {
            const updatedTaskData = { status: !task.status };
            await axios.put(`/api/tasks/${task.id}`, updatedTaskData);
            setTasks(tasks.map(t => (t.id === task.id ? { ...t, status: !t.status } : t)));
        } catch (err) {
            setError('Failed to update task status.');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            await axios.delete(`/api/tasks/${taskId}`);
            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (err) {
            setError('Failed to delete task.');
        }
    };

    const filteredTasks = useMemo(() => {
        switch (filter) {
            case 'completed':
                return tasks.filter(task => task.status);
            case 'active':
                return tasks.filter(task => !task.status);
            default:
                return tasks;
        }
    }, [tasks, filter]);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">My Tasks</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input
                    type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="flex-grow p-2 border rounded" required
                />
                <input
                    type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
                    className="flex-grow p-2 border rounded"
                />
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Task</button>
            </form>

            <div className="flex gap-2 mb-4">
                <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>All</button>
                <button onClick={() => setFilter('active')} className={`px-3 py-1 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Active</button>
                <button onClick={() => setFilter('completed')} className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Completed</button>
            </div>

            <ul className="space-y-2">
                {filteredTasks.map(task => (
                    <li key={task.id} className={`flex items-center justify-between p-3 rounded transition-all ${task.status ? 'bg-gray-100' : 'bg-white'}`}>
                        <div onClick={() => handleToggleStatus(task)} className="cursor-pointer flex-grow">
                            <p className={`font-medium ${task.status ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                            {task.description && <p className={`text-sm ${task.status ? 'text-gray-400' : 'text-gray-600'}`}>{task.description}</p>}
                        </div>
                        <button onClick={() => handleDeleteTask(task.id)} className="ml-4 text-red-500 hover:text-red-700">✕</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}