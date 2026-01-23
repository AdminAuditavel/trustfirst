import React from 'react';
import { ViewState } from '../../types';

const NotificationsScreen = ({ onChangeView }: { onChangeView: (view: ViewState) => void }) => (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-24">
        <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800 justify-between">
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">Avisos</h2>
            <div className="flex items-center justify-end">
                <button onClick={() => onChangeView(ViewState.SETTINGS)} className="flex items-center justify-center rounded-full size-10 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
                    <span className="material-symbols-outlined">settings</span>
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Hoje</p>

                <div className="flex gap-4 p-3 bg-white dark:bg-[#1c2127] rounded-xl mb-3 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-xl">favorite</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-900 dark:text-white text-sm"><span className="font-bold">Ricardo Mendes</span> curtiu seu item <span className="font-bold">Monitor Gamer 27"</span></p>
                        <p className="text-slate-500 text-xs mt-1">2 horas atrás</p>
                    </div>
                </div>

                <div className="flex gap-4 p-3 bg-white dark:bg-[#1c2127] rounded-xl mb-3 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-green-500 text-xl">price_check</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-900 dark:text-white text-sm">O preço de <span className="font-bold">Cadeira Herman Miller</span> caiu 10%</p>
                        <p className="text-slate-500 text-xs mt-1">5 horas atrás</p>
                    </div>
                </div>
            </div>

            <div className="px-4 py-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ontem</p>

                <div className="flex gap-4 p-3 bg-white dark:bg-[#1c2127] rounded-xl mb-3 shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-slate-500 dark:text-slate-300 text-xl">person_add</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-slate-900 dark:text-white text-sm"><span className="font-bold">Ana Silva</span> entrou no TrustCircle através da sua agenda.</p>
                        <p className="text-slate-500 text-xs mt-1">Ontem às 14:30</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default NotificationsScreen;
