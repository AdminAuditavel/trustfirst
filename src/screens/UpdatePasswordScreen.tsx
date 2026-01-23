import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const UpdatePasswordScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.updateUser({ password: password });
            if (error) throw error;
            onComplete();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6 justify-center">
            <div className="max-w-sm mx-auto w-full">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Nova Senha</h2>
                <p className="text-slate-500 mb-8">Digite sua nova senha abaixo.</p>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nova Senha</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Atualizando...' : 'Definir Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordScreen;
