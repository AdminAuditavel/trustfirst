import React from 'react';
import { ViewState } from '../../types';

const SettingsScreen = ({ onChangeView }: { onChangeView: (view: ViewState) => void }) => (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-24">
        <div className="sticky top-0 z-50 flex items-center gap-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800">
            <button onClick={() => onChangeView(ViewState.PROFILE_PERSONAL)} className="text-slate-900 dark:text-white">
                <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Configurações</h2>
        </div>

        <div className="p-4 space-y-6">
            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Conta</h3>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div onClick={() => onChangeView(ViewState.EDIT_PROFILE)} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-500">person</span>
                            <span className="text-slate-900 dark:text-white font-medium">Dados Pessoais</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                    </div>
                    <div onClick={() => onChangeView(ViewState.PRIVACY)} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-500">lock</span>
                            <span className="text-slate-900 dark:text-white font-medium">Privacidade e Sincronização</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-500">notifications</span>
                            <span className="text-slate-900 dark:text-white font-medium">Notificações</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                    </div>
                </div>
            </section>

            <section>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Suporte</h3>
                <div className="bg-white dark:bg-[#1c2127] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-500">help</span>
                            <span className="text-slate-900 dark:text-white font-medium">Central de Ajuda</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                    </div>
                    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-slate-500">info</span>
                            <span className="text-slate-900 dark:text-white font-medium">Sobre o TrustCircle</span>
                        </div>
                        <span className="material-symbols-outlined text-slate-400 text-sm">chevron_right</span>
                    </div>
                </div>
            </section>
        </div>
    </div>
);

export default SettingsScreen;
