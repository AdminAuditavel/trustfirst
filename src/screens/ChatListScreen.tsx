import React, { useState } from 'react';
import { ViewState } from '../../types';
import { IMAGES } from '../constants/images';

const ChatListScreen = ({ onChangeView, onBack }: { onChangeView: (view: ViewState) => void, onBack: () => void }) => (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-24">
        <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800 justify-between">
            <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">Mensagens</h2>
            <div className="flex items-center justify-end">
                <button onClick={() => onChangeView(ViewState.CONTACTS)} className="flex items-center justify-center rounded-full size-10 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white">
                    <span className="material-symbols-outlined">edit_square</span>
                </button>
            </div>
        </div>

        <div className="px-4 py-3">
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                <input type="text" placeholder="Buscar nas conversas..." className="w-full bg-slate-200 dark:bg-[#1c2127] border-none rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 text-sm font-medium" />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            <div onClick={() => onChangeView(ViewState.CHAT)} className="flex items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-[#1a242e] cursor-pointer transition-colors relative">
                <div className="relative">
                    <div className="size-14 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${IMAGES.avatarJuliana}")` }}></div>
                    <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-background-light dark:border-background-dark"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="text-slate-900 dark:text-white font-bold truncate">Juliana Santos</h3>
                        <span className="text-primary text-xs font-bold">14:06</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm truncate pr-4">Tenho sim! Está na caixa original com a alça de couro...</p>
                </div>
                <div className="size-3 rounded-full bg-primary shrink-0"></div>
            </div>

            <div onClick={() => onChangeView(ViewState.CHAT)} className="flex items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-[#1a242e] cursor-pointer transition-colors">
                <div className="relative">
                    <div className="size-14 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${IMAGES.avatarRicardo}")` }}></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="text-slate-900 dark:text-white font-bold truncate">Ricardo Mendes</h3>
                        <span className="text-slate-500 text-xs">Ontem</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-500 text-sm truncate">Combinado então. Te aviso quando chegar.</p>
                </div>
            </div>

            <div onClick={() => onChangeView(ViewState.CHAT)} className="flex items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-[#1a242e] cursor-pointer transition-colors">
                <div className="relative">
                    <div className="size-14 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${IMAGES.avatar1}")` }}></div>
                    <div className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-background-light dark:border-background-dark"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="text-slate-900 dark:text-white font-bold truncate">Lucas Almeida</h3>
                        <span className="text-slate-500 text-xs">Segunda</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-500 text-sm truncate">Ainda está disponível aquele monitor?</p>
                </div>
            </div>
        </div>
    </div>
);

export default ChatListScreen;
