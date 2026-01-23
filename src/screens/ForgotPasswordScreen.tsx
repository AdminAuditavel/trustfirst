import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const ForgotPasswordScreen = ({ onBack, onSent }: { onBack: () => void, onSent: () => void }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });
            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6 justify-center items-center text-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6">
                    <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">E-mail Enviado!</h2>
                <p className="text-slate-500 mb-8 max-w-xs">Verifique sua caixa de entrada. Enviamos um link para você redefinir sua senha.</p>
                <button onClick={onBack} className="text-primary font-bold hover:underline">Voltar para o Login</button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6">
            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Recuperar Senha</h2>
                <p className="text-slate-500 mb-8">Digite seu e-mail para receber as instruções.</p>

                <form onSubmit={handleReset} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Enviando...' : 'Enviar Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;
