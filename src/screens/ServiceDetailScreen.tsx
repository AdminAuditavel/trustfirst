import React from 'react';
import { ViewState } from '../../types';

const ServiceDetailScreen = ({ onChangeView, onBack }: { onChangeView: (view: ViewState) => void, onBack: () => void }) => (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32">
        <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
            <button onClick={onBack} className="text-slate-900 dark:text-white"><span className="material-symbols-outlined">arrow_back</span></button>
            <div className="flex-1">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Identidade Visual</h2>
                <p className="text-xs text-slate-500">por Ricardo Mendes</p>
            </div>
            <button className="text-slate-900 dark:text-white"><span className="material-symbols-outlined">share</span></button>
        </div>

        <div className="p-6">
            <div className="flex gap-2 mb-4">
                <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold">Design</div>
                <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold">Branding</div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Criação de Identidade Visual Completa</h1>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm mb-6">
                Desenvolvimento estratégico da marca, incluindo logotipo, paleta de cores, tipografia, padronagem e manual de aplicação. Entrego todos os arquivos em vetor e formatos para web/impressão.
            </p>

            <div className="bg-slate-50 dark:bg-[#1c2127] rounded-xl p-4 border border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">O que está incluso:</h3>
                <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-green-500 text-[18px]">check</span> Logotipo (Principal e Variações)</li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-green-500 text-[18px]">check</span> Definição de Cores e Tipografia</li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-green-500 text-[18px]">check</span> Brandbook (PDF)</li>
                    <li className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><span className="material-symbols-outlined text-green-500 text-[18px]">check</span> Cartão de Visitas Digital</li>
                </ul>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#1c2127] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                <div className="size-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">RM</div>
                <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white">Ricardo Mendes</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="material-symbols-outlined text-[14px] text-orange-500">star</span> 5.0 (12 avaliações)
                    </div>
                </div>
            </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-8 z-50">
            <div className="max-w-md mx-auto flex gap-4 items-center">
                <div className="flex-1">
                    <p className="text-xs text-slate-500">Valor estimado</p>
                    <p className="text-2xl font-black text-primary">R$ 2.500</p>
                </div>
                <button onClick={() => onChangeView(ViewState.CHAT)} className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]">
                    Contratar
                </button>
            </div>
        </div>
    </div>
);

export default ServiceDetailScreen;
