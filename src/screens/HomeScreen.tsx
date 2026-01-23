import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ViewState } from '../../types';
import { IMAGES } from '../constants/images';

const HomeScreen = ({ onChangeView, onSelectUser }: { onChangeView: (view: ViewState) => void, onSelectUser: (id: string) => void }) => {
    const [items, setItems] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);

            // 1. Fetch my visible network (Profiles)
            const { data: usersData } = await supabase.from('visible_users_for_user').select('*');
            if (usersData) setProfiles(usersData);

            // 2. Fetch visible items (Feed)
            const { data: itemsData } = await supabase.from('visible_items_for_user').select('*').order('created_at', { ascending: false });
            if (itemsData) setItems(itemsData);

            setLoading(false);
        };
        fetchData();
    }, []);

    const getOwner = (id: string) => profiles.find(p => p.id === id) || { id: null, name: 'Unknown', avatar_url: null, last_active_at: null };

    return (
        <main className="max-w-md mx-auto pb-24 pt-20">
            <header className="fixed top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 w-full max-w-md">
                <div className="flex items-center p-4 justify-between">
                    <div onClick={() => onChangeView(ViewState.PROFILE_PERSONAL)} className="flex size-10 shrink-0 items-center justify-center rounded-full overflow-hidden border-2 border-primary/20 cursor-pointer">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover w-full h-full" style={{ backgroundImage: `url("${IMAGES.avatarAlex}")` }}></div>
                    </div>
                    <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">Descobrir Pessoas</h1>
                    <div className="flex w-10 items-center justify-end">
                        <button onClick={() => onChangeView(ViewState.SEARCH)} className="flex items-center justify-center rounded-full h-10 w-10 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                    </div>
                </div>
            </header>

            <section>
                <div className="flex items-center justify-between px-4 pt-6 pb-2">
                    <h2 className="text-xl font-bold leading-tight tracking-tight">Da sua rede</h2>
                    <button className="text-primary text-sm font-semibold">Ver todos</button>
                </div>
                {loading ? (
                    <div className="px-4 py-8 text-center text-slate-500">Carregando sua rede...</div>
                ) : items.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <p className="text-slate-900 dark:text-white font-bold mb-2">Seu feed está vazio.</p>
                        <p className="text-slate-500 text-sm mb-4">Adicione contatos ou sincronize sua agenda para ver itens de pessoas confiáveis.</p>
                        <button onClick={() => onChangeView(ViewState.PRIVACY)} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">Sincronizar Contatos</button>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto gap-4 px-4 py-3 snap-x no-scrollbar">
                        {items.map((item) => {
                            const owner = getOwner(item.owner_id);
                            return (
                                <div key={item.id} onClick={() => { if (owner.id) onSelectUser(owner.id); }} className="flex flex-col gap-3 rounded-xl min-w-[160px] snap-start bg-white dark:bg-slate-900 p-3 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer transition-transform active:scale-95">
                                    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg group">
                                        <div className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${IMAGES.itemCamera}")` }}></div>
                                        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">R$ {item.price}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-base font-bold leading-normal truncate">{item.title}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="size-5 rounded-full bg-slate-200 bg-cover" style={{ backgroundImage: `url('${owner.avatar_url || IMAGES.avatar1}')` }}></div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">{owner.name}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            <section className="mt-4 mb-20">
                <div className="px-4 py-4">
                    <h2 className="text-xl font-bold leading-tight tracking-tight">Conexões em comum</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gente que seus amigos conhecem</p>
                </div>
                <div className="space-y-1">
                    {/* MOCK: Mariana Rios */}
                    <div
                        onClick={() => {
                            const p = profiles.find(u => u.name?.includes('Mariana'));
                            if (p) onSelectUser(p.id);
                        }}
                        className="flex gap-4 px-4 py-4 bg-white dark:bg-background-dark/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/50 cursor-pointer"
                    >
                        <div className="relative">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-slate-200 dark:border-slate-800 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6IMFbpl-hK-Fgn8HvyZtORf7UsTCRV-i79J2iTE7Gcy0foVZixF_NSYNrn45ELDFuCgc0Q99OZHQ34J3Guqp35mUrZDxuh64wTQp_hSab6rBVIO1o2JSivzhaWbUS5jAScw2zxSo-T6-zHkCukqH-v5MI0YCvaT_4Qr4waxzH8VunuHjkaQhudZnfKldaBfvCiVAyLr1JZRDxgCtGmAW84WEA4la851zt5Ry5AhQcadygXScC-d2Jlk6tUkPAMD4QAqGhVi-7qL4")' }}></div>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-background-dark"><span className="material-symbols-outlined text-[12px]">check_circle</span></div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center gap-0.5">
                            <div className="flex items-center gap-2">
                                <p className="text-base font-bold text-slate-900 dark:text-white">Mariana Rios</p>
                                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">3 OFERTAS</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">group</span>12 contatos em comum</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs">Belo Horizonte, MG</p>
                        </div>
                    </div>

                    {/* MOCK: Ricardo Mendes */}
                    <div
                        onClick={() => {
                            const p = profiles.find(u => u.name?.includes('Ricardo'));
                            if (p) onSelectUser(p.id);
                        }}
                        className="flex gap-4 px-4 py-4 bg-white dark:bg-background-dark/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/50 cursor-pointer"
                    >
                        <div className="relative">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-slate-200 dark:border-slate-800 shadow-sm" style={{ backgroundImage: `url("${IMAGES.avatarRicardo}")` }}></div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center gap-0.5">
                            <div className="flex items-center gap-2">
                                <p className="text-base font-bold text-slate-900 dark:text-white">Ricardo Mendes</p>
                                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold">7 OFERTAS</span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">group</span>8 contatos em comum</p>
                            <p className="text-slate-400 dark:text-slate-500 text-xs">Porto Alegre, RS</p>
                        </div>
                    </div>

                    {profiles.length > 0 ? (
                        profiles
                            .filter(p => p.id !== currentUserId) // Don't show myself
                            .map(profile => {
                                return (
                                    <div
                                        key={profile.id}
                                        onClick={() => onSelectUser(profile.id)}
                                        className="flex gap-4 px-4 py-4 bg-white dark:bg-background-dark/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/50 cursor-pointer"
                                    >
                                        <div className="relative">
                                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 border-2 border-slate-200 dark:border-slate-800 shadow-sm" style={{ backgroundImage: `url("${profile.avatar_url || IMAGES.avatar1}")` }}></div>
                                            {/* Only show checkmark if truly verified/trusted - mocking true for now as they are in network */}
                                            <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-background-dark"><span className="material-symbols-outlined text-[12px]">check_circle</span></div>
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center gap-0.5">
                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-bold text-slate-900 dark:text-white">{profile.name}</p>
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">group</span>Confiável</p>
                                            <p className="text-slate-400 dark:text-slate-500 text-xs">{profile.location || 'Brasil'}</p>
                                        </div>
                                    </div>
                                );
                            })
                    ) : (
                        <div className="px-4 py-4 text-center text-xs text-slate-400">
                            <p>Seus contatos do celular aparecerão aqui também.</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default HomeScreen;
