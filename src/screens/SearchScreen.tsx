import React from 'react';

const SearchScreen = ({ onBack }: { onBack: () => void }) => (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
            <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                <input autoFocus type="text" placeholder="Buscar produtos, serviços ou pessoas..." className="w-full bg-slate-100 dark:bg-[#1c2127] border-none rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 text-sm font-medium" />
            </div>
            <button onClick={onBack} className="text-slate-500 font-medium">Cancelar</button>
        </div>
        <div className="p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Buscas Recentes</h3>
            <div className="flex flex-wrap gap-2">
                <div className="bg-slate-100 dark:bg-[#1c2127] px-3 py-1.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 cursor-pointer">iPhone 13 <span className="material-symbols-outlined text-[14px] text-slate-400">close</span></div>
                <div className="bg-slate-100 dark:bg-[#1c2127] px-3 py-1.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 cursor-pointer">Câmera <span className="material-symbols-outlined text-[14px] text-slate-400">close</span></div>
                <div className="bg-slate-100 dark:bg-[#1c2127] px-3 py-1.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1 cursor-pointer">Ricardo Mendes <span className="material-symbols-outlined text-[14px] text-slate-400">close</span></div>
            </div>
        </div>
        <div className="p-4 pt-0">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sugestões para você</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="material-symbols-outlined">category</span></div>
                    <div><p className="text-slate-900 dark:text-white font-bold text-sm">Eletrônicos em alta</p><p className="text-slate-500 text-xs">Baseado no seu perfil</p></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500"><span className="material-symbols-outlined">group_add</span></div>
                    <div><p className="text-slate-900 dark:text-white font-bold text-sm">Pessoas que você talvez conheça</p><p className="text-slate-500 text-xs">Da sua agenda</p></div>
                </div>
            </div>
        </div>
    </div>
);

export default SearchScreen;
