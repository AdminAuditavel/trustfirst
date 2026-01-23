import React from 'react';
import { ViewState } from '../../types';
import { IMAGES } from '../constants/images';

const BottomNav = ({ activeView, onChangeView, userAvatar }: { activeView: ViewState, onChangeView: (view: ViewState) => void, userAvatar: string | null }) => {
    // Only show nav on certain screens
    const showNav = [ViewState.HOME, ViewState.MY_ITEMS, ViewState.SETTINGS, ViewState.PROFILE_PERSONAL, ViewState.CHAT_LIST, ViewState.NOTIFICATIONS, ViewState.CONTACTS, ViewState.SEARCH].includes(activeView);
    if (!showNav) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-6 pt-2 px-2 z-50">
            <div className="max-w-md mx-auto flex justify-between items-center">
                <button onClick={() => onChangeView(ViewState.HOME)} className={`flex flex-col items-center gap-1 w-1/5 transition-colors ${activeView === ViewState.HOME ? 'text-primary' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === ViewState.HOME ? "'FILL' 1" : "'FILL' 0" }}>home</span>
                    <span className="text-[10px] font-bold">Início</span>
                </button>

                <button onClick={() => onChangeView(ViewState.SEARCH)} className={`flex flex-col items-center gap-1 w-1/5 transition-colors ${activeView === ViewState.SEARCH ? 'text-primary' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === ViewState.SEARCH ? "'FILL' 1" : "'FILL' 0" }}>search</span>
                    <span className="text-[10px] font-bold">Explorar</span>
                </button>

                <button onClick={() => onChangeView(ViewState.MY_ITEMS)} className={`flex flex-col items-center gap-1 w-1/5 transition-colors ${activeView === ViewState.MY_ITEMS ? 'text-primary' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: activeView === ViewState.MY_ITEMS ? "'FILL' 1" : "'FILL' 0" }}>inventory_2</span>
                    <span className="text-[10px] font-bold">Meus Itens</span>
                </button>

                <button onClick={() => onChangeView(ViewState.CHAT_LIST)} className={`flex flex-col items-center gap-1 w-1/5 transition-colors ${[ViewState.CHAT_LIST, ViewState.CHAT].includes(activeView) ? 'text-primary' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: [ViewState.CHAT_LIST, ViewState.CHAT].includes(activeView) ? "'FILL' 1" : "'FILL' 0" }}>chat_bubble</span>
                    <span className="text-[10px] font-bold">Conversas</span>
                </button>

                <button onClick={() => onChangeView(ViewState.PROFILE_PERSONAL)} className={`flex flex-col items-center gap-1 w-1/5 transition-colors ${[ViewState.PROFILE_PERSONAL, ViewState.SETTINGS].includes(activeView) ? 'text-primary' : 'text-slate-400'}`}>
                    <div className={`size-6 rounded-full bg-cover bg-center border-2 ${[ViewState.PROFILE_PERSONAL, ViewState.SETTINGS].includes(activeView) ? 'border-primary' : 'border-transparent'}`} style={{ backgroundImage: `url("${userAvatar || IMAGES.avatar1}")` }}></div>
                    <span className="text-[10px] font-bold">Perfil</span>
                </button>
            </div>
        </nav>
    );
}

export default BottomNav;
