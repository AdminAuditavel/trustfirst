import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { hashPhone } from '../../lib/utils';
import { IBGEUF, IBGECity } from '../../types';

const EditProfileScreen = ({ onBack, isInitialSetup = false }: { onBack: () => void, isInitialSetup?: boolean }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');

    const [ufs, setUfs] = useState<IBGEUF[]>([]);
    const [cities, setCities] = useState<IBGECity[]>([]);
    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Helper: keep a timeout wrapper only for non-critical long ops (uploads)
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

    useEffect(() => {
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => response.json())
            .then(data => setUfs(data))
            .catch(err => console.warn('IBGE states fetch failed', err));

        // Load initial data
        const loadData = async () => {
            try {
                const { data: { user }, error: userErr } = await supabase.auth.getUser();
                if (userErr) {
                    console.error('getUser error', userErr);
                    return;
                }
                if (user) {
                    let currentPhone = user.phone || '';

                    // maybeSingle avoids PostgREST 406 when no row exists
                    const { data: profile, error: profileErr } = await supabase.from('users').select('*').eq('id', user.id).maybeSingle();
                    if (profileErr) {
                        console.warn('profile load error', profileErr);
                    }
                    if (profile) {
                        setName(profile.name || '');
                        setAvatarUrl(profile.avatar_url || '');
                        if (profile.phone) currentPhone = profile.phone;
                        if (profile.location) {
                            try {
                                const parts = profile.location.split(' - ');
                                if (parts.length === 2 && parts[1].length === 2) {
                                    setSelectedUf(parts[1]);
                                    setSelectedCity(parts[0]);
                                }
                            } catch (e) { /* ignore */ }
                        }
                    }
                    setPhone(currentPhone);
                }
            } catch (e) {
                console.error('loadData unexpected error', e);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (selectedUf) {
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
                .then(response => response.json())
                .then(data => setCities(data))
                .catch(err => {
                    console.warn('Failed to load cities for', selectedUf, err);
                    setCities([]);
                });
        } else {
            setCities([]);
        }
    }, [selectedUf]);

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        setIsUploading(true);
        const file = event.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        try {
            const { data: { user }, error: userErr } = await supabase.auth.getUser();
            if (userErr) throw userErr;
            if (!user) throw new Error("Usuário não autenticado");

            const filePath = `${user.id}/${fileName}`;

            console.log('[Avatar] uploading to storage', { filePath, fileName, userId: user.id });
            const uploadPromise = supabase.storage.from('avatars').upload(filePath, file);

            // keep longer timeout for uploads
            const uploadResult: any = await withTimeout(uploadPromise, 20000).catch(err => { throw err; });

            if (uploadResult?.error) {
                console.error('storage.upload error', uploadResult.error);
                throw uploadResult.error;
            }

            const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(publicUrlData.publicUrl);
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            const more = (error?.status || error?.statusCode) ? ` (status: ${error.status || error.statusCode})` : '';
            setError('Erro ao enviar imagem. Tente novamente.' + more);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMsg('');

        let currentAccessToken = '';
        try {
            console.log('[Profile] starting submit');

            // 1. Force session check/refresh before critical ops
            const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
            if (sessionErr) {
                console.warn('[Profile] session check error', sessionErr);
                // Try to refresh just in case
                const { data: refreshed } = await supabase.auth.refreshSession();
                if (refreshed.session) currentAccessToken = refreshed.session.access_token;
            } else if (session) {
                console.log('[Profile] session active', session.user.id);
                currentAccessToken = session.access_token;
            }

            // getUser without aggressive timeout so we can see server response
            const { data: { user }, error: getUserErr } = await supabase.auth.getUser();
            if (getUserErr) {
                console.error('[Profile] getUserErr', getUserErr);
                throw getUserErr;
            }
            if (!user) throw new Error('Usuário não autenticado');

            if (password) {
                console.log('[Profile] updating password for user', user.id);
                // Wrap in strict timeout using Promise.race to guarantee unlock
                const updatePwdPromise = supabase.auth.updateUser({ password: password });

                // Create a timeout promise that rejects
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('timeout_pwd')), 3000)
                );

                try {
                    const { error: pwdError } = await Promise.race([updatePwdPromise, timeoutPromise]) as any;

                    console.log('[Profile] updateUser result, pwdError:', pwdError);
                    if (pwdError) {
                        console.error('[Profile] updateUser failed', pwdError);
                        throw pwdError;
                    }
                } catch (pwdErr: any) {
                    let handled = false;
                    if (pwdErr.message === 'timeout_pwd') {
                        console.warn('[Profile] Password update timed out via SDK, trying raw fetch fallback...');
                        try {
                            if (currentAccessToken) {
                                console.log('[Profile] Session token retrieved for fallback');
                                const rawUrl = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/user`;

                                // Add timeout to fetch
                                const controller = new AbortController();
                                const timeoutId = setTimeout(() => controller.abort(), 10000);

                                console.log('[Profile] Sending raw PUT request to', rawUrl);
                                const rawResp = await fetch(rawUrl, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                                        'Authorization': `Bearer ${currentAccessToken}`
                                    },
                                    body: JSON.stringify({ password: password }),
                                    signal: controller.signal
                                });
                                clearTimeout(timeoutId);

                                console.log('[Profile] Raw fetch status:', rawResp.status);
                                if (rawResp.ok) {
                                    console.log('[Profile] Raw fetch success');
                                    handled = true;
                                } else {
                                    const text = await rawResp.text();
                                    console.error('[Profile] Raw fetch failed:', text);

                                    // Handle specific "Same Password" error as success/warning
                                    if (rawResp.status === 422 && text.includes('same_password')) {
                                        console.warn('[Profile] Password is same as old one, ignoring.');
                                        handled = true;
                                    }
                                    // Treat 401/403 as critical auth errors
                                    else if (rawResp.status === 401 || rawResp.status === 403) {
                                        throw new Error(`Erro de autorização (${rawResp.status}). Sua sessão pode ter expirado.`);
                                    }
                                    else {
                                        throw new Error(`Erro no fallback: ${rawResp.status} ${text}`);
                                    }
                                }
                            } else {
                                console.warn('[Profile] No session found for fallback');
                            }
                        } catch (fallbackErr: any) {
                            console.error('[Profile] Fallback also failed/aborted', fallbackErr);
                            if (fallbackErr.name === 'AbortError') {
                                console.error('[Profile] Fallback fetch timed out');
                            }
                        }
                    }

                    if (!handled) {
                        if (pwdErr.message === 'timeout_pwd') {
                            console.error('[Profile] Password update timed out');
                            if (isInitialSetup) {
                                throw new Error('O servidor demorou para responder ao atualizar a senha. Verifique se seu relógio está correto (Clock Skew) e tente novamente.');
                            } else {
                                throw new Error('Tempo esgotado ao atualizar senha.');
                            }
                        }
                        throw pwdErr;
                    }
                }
            }

            const phoneValue = phone || user.phone || '';
            const phoneHash = await hashPhone(phoneValue);

            const updates: any = {
                id: user.id,
                email: user.email,
                name,
                phone: phoneValue,
                phone_hash: phoneHash,
                updated_at: new Date().toISOString(),
                avatar_url: avatarUrl
            };

            if (selectedCity && selectedUf) updates.location = `${selectedCity} - ${selectedUf}`;

            console.log('[Profile] upserting user', { updates });

            // upsert - log response fully to catch 406 or other errors
            let upsertError = null;
            let upsertData = null;

            try {
                // Wrap in timeout
                const upsertResp: any = await withTimeout(
                    Promise.resolve(supabase.from('users').upsert(updates).select()),
                    3000 // Reduced to 3s to fail faster to fallback
                );
                if (upsertResp?.error) throw upsertResp.error;
                upsertData = upsertResp.data;

            } catch (err: any) {
                console.warn('[Profile] SDK upsert failed/timed out, trying raw fetch fallback...', err);

                if (currentAccessToken) {
                    try {
                        const rawUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/users`;
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 10000);

                        console.log('[Profile] Sending raw POST (upsert) to', rawUrl);
                        const rawResp = await fetch(rawUrl, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                                'Authorization': `Bearer ${currentAccessToken}`,
                                'Prefer': 'resolution=merge-duplicates,return=representation'
                            },
                            body: JSON.stringify(updates),
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);

                        if (rawResp.ok) {
                            console.log('[Profile] Raw upsert success');
                            const data = await rawResp.json();
                            upsertData = data;
                        } else {
                            const text = await rawResp.text();
                            console.error('[Profile] Raw upsert failed:', text);
                            // Treat 401/403 as critical auth errors
                            if (rawResp.status === 401 || rawResp.status === 403) {
                                throw new Error(`Erro de autorização (${rawResp.status}). Sua sessão pode ter expirado.`);
                            }
                            throw new Error(`Erro no fallback de dados: ${rawResp.status} ${text}`);
                        }
                    } catch (fallbackErr: any) {
                        console.error('[Profile] Raw fallback exception', fallbackErr);
                        if (fallbackErr.message && fallbackErr.message.includes('Erro de autorização')) {
                            throw fallbackErr;
                        }
                        upsertError = err; // Throw original error if fallback fails
                    }
                } else {
                    upsertError = err;
                }
            }

            if (upsertError) {
                const upErr: any = upsertError;
                console.error('[Profile] upsert error', upErr);

                if (upErr.status === 406 || upErr?.code === '406') {
                    setError('Erro de comunicação com o servidor (406). Verifique CORS/API e a URL/ANON_KEY do Supabase.');
                    throw upErr;
                }

                if (upErr.code === '23505') {
                    if (upErr.message?.includes('users_phone_key') || upErr.details?.includes('phone')) {
                        throw new Error('Este telefone já está cadastrado por outro usuário.');
                    }
                    if (upErr.message?.includes('users_email_key') || upErr.details?.includes('email')) {
                        throw new Error('Este e-mail já está cadastrado por outro usuário.');
                    }
                }
                throw upErr;
            }

            // success
            if (!isInitialSetup) {
                setMsg('Perfil atualizado com sucesso!');
                setTimeout(() => onBack(), 1500);
            } else {
                onBack();
            }

        } catch (err: any) {
            console.error('[Profile] submit error (final)', err);
            // distinguish timeout vs server errors
            if (err?.message === 'timeout' || err?.message === 'timeout_pwd') {
                setError('O servidor demorou para responder. Tente novamente em alguns segundos.');
            } else if (err?.status === 406) {
                setError('Erro 406: Requisição não aceita pelo servidor. Verifique a URL e CORS do Supabase.');
            } else {
                setError(err.message || 'Erro ao atualizar perfil.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6">
            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                {!isInitialSetup && (
                    <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                )}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isInitialSetup ? 'Complete seu perfil' : 'Editar Perfil'}</h2>
                    <p className="mt-2 text-sm text-slate-500">{isInitialSetup ? 'Defina sua senha e seus dados.' : 'Atualize suas informações.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="size-24 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border-4 border-white dark:border-background-dark shadow-lg" style={{ backgroundImage: `url("${avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVdFllcYvR_SQdhiLy6q6oJFyrQF6rEUOF1t-YNSD4sADJPl-Xgc1SE_0AOn6dHxGfLIHDzs19LXKFvPyCf2QLjTFEU9Pb8jpHKkgFXdw1LRNojzyi7dWZqgXHs9ZKX9dueXN6KJh1tC4b22ppQZXyZ_kS720EkJUVzW2P9oTjsbjWKQUo8RW-kbhcm0lKGW30UyhA3aBtCoJHWu0btWdjZI5Fa7dgpAkINIIFkBcIAciFz0ynwaw5gUWmyagrTsV2out7jYi5LwA'}")` }}>
                            </div>
                            <label
                                className={`absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-primary/90 shadow-md transform translate-x-1/4 translate-y-1/4 cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                {isUploading ? <span className="material-symbols-outlined text-sm animate-spin">refresh</span> : <span className="material-symbols-outlined text-sm">edit</span>}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                            placeholder="Ex: Maria Silva"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isInitialSetup ? 'Senha de Acesso' : 'Nova Senha (opcional)'}</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required={isInitialSetup}
                                minLength={6}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                                placeholder={isInitialSetup ? "Crie sua senha" : "Deixe em branco para manter"}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-300"
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Mínimo de 6 caracteres.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                            <select
                                required={isInitialSetup}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                                value={selectedUf}
                                onChange={e => {
                                    setSelectedUf(e.target.value);
                                    setSelectedCity('');
                                }}
                            >
                                <option value="">UF</option>
                                {ufs.map(uf => (
                                    <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cidade</label>
                            <select
                                required={isInitialSetup}
                                disabled={!selectedUf}
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100 disabled:opacity-50"
                                value={selectedCity}
                                onChange={e => setSelectedCity(e.target.value)}
                            >
                                <option value="">Selecione a cidade</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.nome}>{city.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">WhatsApp / Telefone</label>
                        <input
                            type="tel"
                            required
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                            placeholder="(11) 99999-9999"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mt-1">Usado apenas para parear seus contatos. Não será exibido publicamente.</p>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    {msg && <p className="text-green-500 text-sm text-center">{msg}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Salvando...' : (isInitialSetup ? 'Concluir Cadastro' : 'Salvar Alterações')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.reload();
                        }}
                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                        {isInitialSetup ? 'Sair / Não é você?' : 'Sair da Conta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileScreen;
