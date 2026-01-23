import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ViewState } from '../../types';
import { IMAGES } from '../constants/images';

const PrivateProfileScreen = ({ onChangeView, onBack }: { onChangeView: (view: ViewState) => void, onBack: () => void }) => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (user) {
                const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
                setUser(profile || user);
            }
        });

        // Check if professional profile exists (mock)
        // In real app, we'd query a 'professionals' table
    }, []);

    return (
        <div className="max-w-[480px] mx-auto min-h-screen flex flex-col relative pb-28">
            <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 relative group">
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <div className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">photo_camera</span> Alterar capa
                    </div>
                </div>
            </div>

            <div className="px-6 relative -mt-16 mb-4">
                <div className="flex justify-between items-end">
                    <div className="relative group">
                        <div className={`size-32 rounded-full border-4 border-background-light dark:border-background-dark bg-slate-200 dark:bg-slate-700 bg-cover bg-center shadow-lg`} style={{ backgroundImage: `url("${user?.avatar_url || IMAGES.avatar1}")` }}></div>
                        <div className="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-4 border-background-light dark:border-background-dark cursor-pointer shadow-sm hover:scale-105 transition-transform" onClick={() => onChangeView(ViewState.EDIT_PROFILE)}>
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                        </div>
                    </div>
                    <div className="mb-4 flex gap-2">
                        <button className="bg-slate-200 dark:bg-[#1c2127] text-slate-900 dark:text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-300 dark:hover:bg-[#252b33] transition-colors" onClick={() => onChangeView(ViewState.SETTINGS)}>Configurações</button>
                    </div>
                </div>

                <div className="mt-4">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{user?.name}</h1>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span> {user?.location || 'Localização não definida'}
                    </p>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/20">
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <p className="text-orange-700 dark:text-orange-400 font-bold text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">verified_user</span> Nível de Confiança
                            </p>
                            <p className="text-orange-900 dark:text-orange-200 text-2xl font-black mt-1">94</p>
                        </div>
                        <div className="bg-white dark:bg-orange-950 px-3 py-1 rounded-lg shadow-sm border border-orange-100 dark:border-orange-900/50">
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">Alto</span>
                        </div>
                    </div>
                    <div className="w-full bg-orange-200 dark:bg-orange-900/30 rounded-full h-2 mt-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                    <p className="text-orange-600/80 dark:text-orange-400/70 text-xs mt-3">Você é altamente confiável na sua rede (Top 5%).</p>
                </div>
            </div>

            <div className="px-6 mt-2 space-y-2">
                <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1c2127] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-[#252b33] transition-colors group" onClick={() => onChangeView(ViewState.PROFILE_PROFESSIONAL)}>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">work</span>
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Perfil Profissional</p>
                            <p className="text-xs text-slate-500">Gerenciar meus serviços</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1c2127] rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-[#252b33] transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <span className="material-symbols-outlined">share</span>
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Convidar Amigos</p>
                            <p className="text-xs text-slate-500">Ganhe pontos de confiança</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>
            </div>

            <div className="px-6 mt-8">
                <button
                    onClick={async () => {
                        await supabase.auth.signOut();
                        window.location.reload();
                    }}
                    className="w-full py-4 rounded-xl border border-red-200 dark:border-red-900/30 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">logout</span>
                    Sair da Conta
                </button>
            </div>
        </div>
    );
};

export default PrivateProfileScreen;
