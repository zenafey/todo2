'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await axios.post(`${process.env.FASTAPI_URL}/token`, formData, {
                headers: {
                    "Cache-Control": "no-cache",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true,
            });

            router.push('/'); // Перенаправляем на главную
            router.refresh(); // Обновляем страницу, чтобы middleware подхватило cookie

        } catch (err: any) {
            if (err.response) {
                console.error('Данные ошибки:', err.response.data);
                setError(err.response.data.detail || 'Failed to login. Please check your credentials.');
            } else {
                 setError('Failed to login. An unknown error occurred.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        className="w-full px-4 py-2 border rounded-md"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="w-full px-4 py-2 border rounded-md"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">
                        Login
                    </button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </form>
                <p className="text-sm text-center">
                    Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
}