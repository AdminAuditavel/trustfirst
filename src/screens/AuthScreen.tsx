//src/screens/AuthScreen.tsx

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

const AuthScreen = ({ onLogin, onCompleteProfile, onForgotPassword }: { onLogin: (session?: any) => void, onCompleteProfile: () => void, onForgotPassword: () => void }) => {
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

    const callCheckUserExistsViaFetch = async (normalizedEmail: string) => {
        const projectUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
        const endpoint = `${projectUrl}/rest/v1/rpc/check_user_exists`;

        const resp = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': anonKey,
                'Authorization': `Bearer ${anonKey}`
            },
            body: JSON.stringify({ email_arg: normalizedEmail })
        });

        const text = await resp.text();

        // Try parse JSON (some responses may be raw true/false)
        try {
            const parsed = JSON.parse(text);
            return { httpStatus: resp.status, data: parsed, ok: resp.ok, raw: text };
        } catch (e) {
            return { httpStatus: resp.status, data: text === 'true' ? true : (text === 'false' ? false : text), ok: resp.ok, raw: text };
        }
    };

    const handleCheckEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Normalize email on the client to match DB normalization (trim + lower)
        const normalizedEmail = email.trim().toLowerCase();
        console.log('[Auth] handleCheckEmail start', { email: normalizedEmail });

        try {
            // Use REST/fetch to avoid intermittent SDK rpc timeouts in this environment
            console.log('[Auth] calling REST RPC via fetch');
            const fetchPromise = callCheckUserExistsViaFetch(normalizedEmail);

            // wrap with timeout (10s)
            const rpcResult: any = await withTimeout(fetchPromise, 10000);

            console.log('[Auth] fetch rpcResult', rpcResult);

            // rpcResult shape: { httpStatus, data, ok, raw } or fallback
            const rpcError = rpcResult?.error;
            const userExistsRaw = rpcResult?.data ?? rpcResult;

            if (rpcError) {
                console.error('[Auth] rpcError', rpcError);
                throw rpcError;
            }

            // Interpret userExistsRaw into boolean robustly
            let existsFlag = false;
            if (typeof userExistsRaw === 'boolean') {
                existsFlag = userExistsRaw;
            } else if (Array.isArray(userExistsRaw) && userExistsRaw.length > 0) {
                const first = userExistsRaw[0];
                if (typeof first === 'boolean') {
                    existsFlag = first;
                } else if (typeof first === 'object' && first !== null) {
                    const v = Object.values(first).find(val => typeof val === 'boolean' || typeof val === 'number' || typeof val === 'string');
                    existsFlag = !!v;
                } else {
                    existsFlag = !!first;
                }
            } else {
                existsFlag = !!userExistsRaw;
            }

            console.log('[Auth] existsFlag', existsFlag);

            if (existsFlag) {
                // User exists -> Show password screen
                setEmail(normalizedEmail);
                setStep('password');
            } else {
                // Verified New User -> Send Magic Link (also wrapped with timeout)
                console.log('[Auth] sending magic link to', normalizedEmail);

                setEmail(normalizedEmail);

                const otpPromise = supabase.auth.signInWithOtp({
                    email: normalizedEmail,
                    options: {
                        emailRedirectTo: window.location.origin,
                        shouldCreateUser: true,
                    },
                });

                const otpResult: any = await withTimeout(otpPromise, 10000);

                console.log('[Auth] otpResult', otpResult);

                const otpError = otpResult?.error ?? (otpResult?.data?.error);
                if (otpError) throw otpError;

                setStep('magic_link');
            }
        } catch (err: any) {
            console.error('Check email error:', err);

            const isRateLimit = err?.message?.includes('rate limit') || err?.message?.includes('429') || err?.status === 429;
            const isTimeout = err?.message === 'timeout' || err?.message?.includes('Tempo limite');

            if (isRateLimit) {
                setMessage('Muitas tentativas. Aguarde 60 segundos antes de tentar novamente.');
            } else if (isTimeout || err) {
                // Fallback to Magic Link on RPC failure/Timeout or any other non-rate-limit error
                console.warn('RPC check failed or timed out, falling back to Magic Link:', err);
                setMessage('Verificação instável. Tentando envio de link mágico...');

                try {
                    const normalizedEmail = email.trim().toLowerCase();
                    setEmail(normalizedEmail);

                    const signInPromise = supabase.auth.signInWithOtp({
                        email: normalizedEmail,
                        options: {
                            emailRedirectTo: window.location.origin,
                            shouldCreateUser: true,
                        },
                    });

                    // Also timeout the fallback
                    const otpResult: any = await withTimeout(signInPromise, 10000);

                    const otpError = otpResult?.error ?? (otpResult?.data?.error);
                    if (otpError) throw otpError;

                    setStep('magic_link');
                } catch (otpErr: any) {
                    if (otpErr?.message === 'timeout') {
                        setMessage('O servidor demorou para responder. Verifique sua conexão.');
                    } else {
                        setMessage(otpErr?.message || 'Erro ao conectar. Verifique sua rede.');
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

        const normalizedEmail = email.trim().toLowerCase();
        console.log('[Auth] handlePasswordLogin start', { email: normalizedEmail });

        try {
            // Try SDK signInWithPassword with timeout
            const signInPromise = supabase.auth.signInWithPassword({
                email: normalizedEmail,
                password
            } as any);

            let result: any;
            try {
                result = await withTimeout(signInPromise, 10000);
                console.log('[Auth] signInWithPassword result', result);
            } catch (sdkErr: any) {
                // If SDK timed out, try REST token fallback
                if (sdkErr?.message === 'timeout') {
                    console.warn('[Auth] signInWithPassword timed out, attempting REST token fallback');
                    // REST token fallback
                    const projectUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
                    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
                    const tokenUrl = `${projectUrl}/auth/v1/token?grant_type=password`;
                    const jsonBody = JSON.stringify({ email: normalizedEmail, password });

                    const rawResp = await withTimeout(
                        fetch(tokenUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'apikey': anonKey,
                                'Authorization': `Bearer ${anonKey}`
                            },
                            body: jsonBody
                        }),
                        10000
                    );

                    const rawJson = await rawResp.json();
                    console.log('[Auth] raw token response', rawResp.status, rawJson);

                    if (!rawResp.ok) {
                        const messageText = rawJson?.error_description || rawJson?.error || JSON.stringify(rawJson);
                        throw new Error(`Login failed: ${messageText}`);
                    }

                    // FIX: Construct session object manually
                    const sessionObj = {
                        access_token: rawJson.access_token,
                        refresh_token: rawJson.refresh_token,
                        expires_in: rawJson.expires_in,
                        expires_at: rawJson.expires_at,
                        token_type: rawJson.token_type,
                        user: rawJson.user
                    };

                    // FIX: Attempt setSession with timeout so we don't hang if SDK is stuck
                    try {
                        console.log('[Auth] attempting setSession with timeout');
                        const { data: setData, error: setErr } = await withTimeout(
                            supabase.auth.setSession({
                                access_token: rawJson.access_token,
                                refresh_token: rawJson.refresh_token
                            } as any),
                            5000 // 5s max wait
                        );
                        if (setErr) {
                            console.warn('[Auth] setSession error', setErr);
                        } else {
                            console.log('[Auth] setSession success', setData);
                        }
                    } catch (setEx) {
                        console.warn('[Auth] setSession timed out or threw, proceeding with manual session', setEx);
                    }

                    // FIX: Pass valid session object to parent app
                    onLogin(sessionObj);
                    return;
                } else {
                    // non-timeout SDK error: rethrow to outer catch
                    throw sdkErr;
                }
            }

            // If we reach here, SDK resolved before timeout
            const error = result?.error ?? result?.data?.error;
            const data = result?.data ?? result;

            if (error) {
                console.warn('[Auth] signInWithPassword error', error);
                throw error;
            }

            // When successful, supabase v2 often returns data.session and data.user
            const session = data?.session ?? null;
            const user = data?.user ?? null;

            if (session || user) {
                console.log('[Auth] password login successful', { user, session });
                onLogin(session); // FIX: pass session
                return;
            }

            // If SDK returned something unexpected, fallthrough to REST fallback
            console.warn('[Auth] signInWithPassword returned unexpected payload, falling back to REST token flow', result);

            // Fallback: call auth/v1/token endpoint directly (grant_type=password)
            try {
                const projectUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
                const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
                const tokenUrl = `${projectUrl}/auth/v1/token?grant_type=password`;
                const jsonBody = JSON.stringify({ email: normalizedEmail, password });

                const rawResp = await withTimeout(
                    fetch(tokenUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': anonKey,
                            'Authorization': `Bearer ${anonKey}`
                        },
                        body: jsonBody
                    }),
                    10000
                );

                const rawJson = await rawResp.json();
                console.log('[Auth] raw token response', rawResp.status, rawJson);

                if (!rawResp.ok) {
                    const messageText = rawJson?.error_description || rawJson?.error || JSON.stringify(rawJson);
                    throw new Error(`Login failed: ${messageText}`);
                }

                // FIX: Construct session object manually
                const sessionObj = {
                    access_token: rawJson.access_token,
                    refresh_token: rawJson.refresh_token,
                    expires_in: rawJson.expires_in,
                    expires_at: rawJson.expires_at,
                    token_type: rawJson.token_type,
                    user: rawJson.user
                };

                // FIX: Attempt setSession with timeout
                try {
                    const { data: setData, error: setErr } = await withTimeout(
                        supabase.auth.setSession({
                            access_token: rawJson.access_token,
                            refresh_token: rawJson.refresh_token
                        } as any),
                        5000
                    );
                    if (setErr) console.warn('[Auth] setSession error', setErr);
                    else console.log('[Auth] setSession success', setData);
                } catch (setEx) {
                    console.warn('[Auth] setSession threw', setEx);
                }

                onLogin(sessionObj); // FIX: pass sessionObj
                return;
            } catch (rawErr) {
                console.error('[Auth] raw fallback error', rawErr);
                throw rawErr;
            }
        } catch (err: any) {
            console.error('[Auth] Password login failed', err);

            const isTimeout = err?.message === 'timeout' || err?.message?.includes('Tempo limite');
            if (isTimeout) {
                setMessage('O servidor demorou para responder. Tente novamente.');
            } else {
                // Show a readable message for common auth errors
                const msg = err?.message || (err?.error || 'Erro no login.');
                if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('senha') || msg.toLowerCase().includes('password')) {
                    setMessage('Senha incorreta ou usuário inexistente.');
                } else if (msg.toLowerCase().includes('authorization') || msg.toLowerCase().includes('expired')) {
                    setMessage('Erro de autorização. Faça login novamente.');
                } else {
                    setMessage(typeof msg === 'string' ? msg : 'Erro ao conectar. Tente novamente.');
                }
            }
        } finally {
            setLoading(false);
            console.log('[Auth] handlePasswordLogin finished');
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
