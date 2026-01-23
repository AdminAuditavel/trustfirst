import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AuthScreen = ({ onLogin, onCompleteProfile, onForgotPassword }: { onLogin: () => void, onCompleteProfile: () => void, onForgotPassword: () => void }) => {
    const [step, setStep] = useState<'check_email' | 'password' | 'magic_link'>('check_email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Helper: wrap promise with timeout to avoid indefinite waiting
    const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> => {
        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error('timeout'));
            }, ms);
            p.then(res => {
                clearTimeout(timer);
                resolve(res);
            }).catch(err => {
                clearTimeout(timer);
                reject(err);
            });
        });
    };

    const handleCheckEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        console.log('[Auth] handleCheckEmail start', { email });

        try {
            const rpcPromise = supabase.rpc('check_user_exists', { email_arg: email });

            // wrap with timeout (5s)
            // Use Promise.resolve to handle any thenable/builder issues with types
            const rpcResult: any = await withTimeout(Promise.resolve(rpcPromise), 5000);

            console.log('[Auth] rpcResult', rpcResult);

            const userExists = rpcResult?.data ?? rpcResult; // adjust depending on supabase client shape
            const rpcError = rpcResult?.error;

            if (rpcError) {
                console.error('[Auth] rpcError', rpcError);
                throw rpcError;
            }

            // NOTE: depending on how the Postgres function returns, userExists might be true/false,
            // or an object/array. Inspect rpcResult in console to confirm.
            const existsFlag = !!userExists;
            console.log('[Auth] existsFlag', existsFlag);

            if (existsFlag) {
                // User exists -> Show password screen
                setStep('password');
            } else {
                // Verified New User -> Send Magic Link (also wrapped with timeout)
                console.log('[Auth] sending magic link to', email);
                const otpResult: any = await withTimeout(
                    supabase.auth.signInWithOtp({
                        email,
                        options: {
                            emailRedirectTo: window.location.origin,
                            shouldCreateUser: true,
                        },
                    }),
                    5000
                );

                console.log('[Auth] otpResult', otpResult);

                if (otpResult?.error) throw otpResult.error;
                setStep('magic_link');
            }
        } catch (err: any) {
            console.error('Check email error:', err);

            const isRateLimit = err.message?.includes('rate limit') || err.message?.includes('429') || err.status === 429;
            const isTimeout = err.message === 'timeout' || err.message?.includes('Tempo limite');

            if (isRateLimit) {
                setMessage('Muitas tentativas. Aguarde 60 segundos antes de tentar novamente.');
            } else if (isTimeout || err) {
                // Fallback to Magic Link on RPC failure/Timeout or any other non-rate-limit error
                console.warn('RPC check failed or timed out, falling back to Magic Link:', err);
                setMessage('Verificação instável. Tentando envio de link mágico...');

                try {
                    const signInPromise = supabase.auth.signInWithOtp({
                        email,
                        options: {
                            emailRedirectTo: window.location.origin,
                            shouldCreateUser: true,
                        },
                    });

                    // Also timeout the fallback
                    const { error: otpError } = await withTimeout(signInPromise, 5000) as any;

                    if (otpError) throw otpError;

                    setStep('magic_link');
                } catch (otpErr: any) {
                    if (otpErr.message === 'timeout') {
                        setMessage('O servidor demorou para responder. Verifique sua conexão.');
                    } else {
                        setMessage(otpErr.message || 'Erro ao conectar. Verifique sua rede.');
                    }
                }
            }
        } finally {
            setLoading(false);
            console.log('[Auth] handleCheckEmail finished');
        }
    };

    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            onLogin();
        } catch (err: any) {
            setMessage('Senha incorreta ou erro no login.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 'magic_link') {
        return (
            <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6 justify-center items-center text-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6">
                    <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">mail</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifique seu E-mail</h2>
                <p className="text-slate-500 mb-8 max-w-xs">
                    Enviamos um link de validação para <strong>{email}</strong>.
                    <br /><br />
                    Clique no link para acessar e concluir seu cadastro.
                </p>
                <button onClick={() => setStep('check_email')} className="text-primary font-bold hover:underline">Voltar</button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6">
            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-primary mb-2 tracking-tighter">trustcircle</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        {step === 'password' ? 'Digite sua senha.' : 'Acesse sua conta para continuar.'}
                    </p>
                </div>

                {step === 'check_email' && (
                    <form onSubmit={handleCheckEmail} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
                            <input
                                type="email"
                                required
                                autoFocus
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        {message && <p className="text-red-500 text-sm text-center">{message}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? 'Verificando...' : 'Continuar'}
                        </button>
                    </form>
                )}

                {step === 'password' && (
                    <form onSubmit={handlePasswordLogin} className="space-y-6">
                        <div className="text-left">
                            <button
                                type="button"
                                onClick={() => setStep('check_email')}
                                className="text-xs text-primary mb-4 flex items-center gap-1 hover:underline"
                            >
                                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                                Não é {email}?
                            </button>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                                <button type="button" onClick={onForgotPassword} className="text-xs text-primary hover:underline">
                                    Esqueceu?
                                </button>
                            </div>
                            <input
                                type="password"
                                required
                                autoFocus
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                                placeholder="********"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        {message && (
                            <div className="p-3 rounded-lg text-sm bg-red-50 text-red-600">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthScreen;
