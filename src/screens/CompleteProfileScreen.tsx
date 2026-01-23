import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { hashPhone } from '../../lib/utils';
import { IBGEUF, IBGECity } from '../../types';

const CompleteProfileScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState(''); // New password state

    const [ufs, setUfs] = useState<IBGEUF[]>([]);
    const [cities, setCities] = useState<IBGECity[]>([]);
    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => response.json())
            .then(data => setUfs(data));
    }, []);

    useEffect(() => {
        if (selectedUf) {
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
                .then(response => response.json())
                .then(data => setCities(data));
        } else {
            setCities([]);
        }
    }, [selectedUf]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            // 1. Update Password if provided
            if (password) {
                const { error: pwdError } = await supabase.auth.updateUser({ password: password });
                if (pwdError) throw pwdError;
            }

            const phoneValue = phone || user.phone || '';

            const phoneHash = await hashPhone(phoneValue);

            const updates = {
                id: user.id,
                email: user.email, // ENSURE email is saved to public profile
                name,
                location: `${selectedCity} - ${selectedUf}`,
                phone: phoneValue,
                phone_hash: phoneHash,
                updated_at: new Date().toISOString(),
            };

            const { error: upsertError } = await supabase.from('users').upsert(updates);

            if (upsertError) throw upsertError;

            onComplete();
        } catch (err: any) {
            console.error("Erro ao salvar perfil:", err);
            // More detailed error for the user (in dev/debug)
            setError(err.message + (err.details ? ` (${err.details})` : ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6">
            <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete seu perfil</h2>
                    <p className="mt-2 text-sm text-slate-500">Defina sua senha e seus dados para continuar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Senha de Acesso</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                            placeholder="Crie sua senha"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 mt-1">Mínimo de 6 caracteres.</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
                            <select
                                required
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
                                required
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? 'Salvando...' : 'Concluir Cadastro'}
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
                        Sair / Não é você?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompleteProfileScreen;
