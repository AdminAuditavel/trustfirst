import React from 'react';
import { IMAGES } from '../constants/images';

const ChatScreen = ({ onBack }: { onBack: () => void }) => (
    <div className="relative flex h-screen max-w-md mx-auto flex-col bg-background-light dark:bg-background-dark overflow-hidden border-x border-white/5">
        <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="flex items-center text-primary"><span className="material-symbols-outlined" style={{ fontSize: '28px' }}>chevron_left</span></button>
                    <div className="relative">
                        <div className="size-10 shrink-0 bg-center bg-no-repeat bg-cover rounded-full border border-white/10" style={{ backgroundImage: `url("${IMAGES.avatarJuliana}")` }}></div>
                        <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background-dark"></div>
                    </div>
                    <div className="flex flex-col"><h2 className="text-slate-900 dark:text-white text-base font-bold leading-none">Juliana Santos</h2><span className="text-slate-500 dark:text-[#9dabb9] text-xs font-normal mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-primary">verified_user</span>Amiga de Maria Silva</span></div>
                </div>
                <div className="flex items-center gap-4"><button className="text-slate-900 dark:text-white/70 hover:text-white"><span className="material-symbols-outlined">call</span></button><button className="text-slate-900 dark:text-white/70 hover:text-white"><span className="material-symbols-outlined">more_vert</span></button></div>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto chat-bg pb-24">
            <div className="sticky top-0 z-10 p-4 bg-gradient-to-b from-background-light dark:from-background-dark to-transparent">
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-[#1c2630] border border-slate-200 dark:border-white/10 shadow-lg">
                    <div className="flex flex-col gap-1 flex-1">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 w-fit mb-1"><span className="material-symbols-outlined text-[14px] text-primary">verified</span><span className="text-primary text-[10px] font-bold uppercase tracking-wider">Contexto de confiança ativo</span></div>
                        <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight">Câmera Vintage 35mm</p><p className="text-primary text-sm font-bold leading-tight">R$ 450,00</p>
                    </div>
                    <div className="w-20 h-20 bg-center bg-no-repeat bg-cover rounded-lg shrink-0" style={{ backgroundImage: `url("${IMAGES.itemCamera}")` }}></div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-2 py-2 px-4"><p className="text-slate-500 dark:text-[#9dabb9] text-xs font-normal text-center max-w-[280px]"><span className="material-symbols-outlined text-[14px] align-middle mr-1">link</span>Vocês estão conectados pela sua rede privada. Negocie com segurança.</p></div>
            <div className="flex flex-col gap-4 p-4 mt-2">
                <div className="flex items-end gap-2 max-w-[85%]">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 shrink-0 mb-1" style={{ backgroundImage: `url("${IMAGES.avatarJuliana}")` }}></div>
                    <div className="flex flex-col gap-1"><div className="text-base font-normal leading-relaxed rounded-2xl rounded-bl-none px-4 py-3 bg-white dark:bg-[#283039] text-slate-900 dark:text-white shadow-sm">Oi! Vi que você se interessou pela câmera. Ela está em ótimo estado, usei poucas vezes.</div><span className="text-slate-400 dark:text-[#9dabb9] text-[10px] ml-1">14:02</span></div>
                </div>
                <div className="flex items-end gap-2 max-w-[85%] self-end justify-end">
                    <div className="flex flex-col gap-1 items-end"><div className="text-base font-normal leading-relaxed rounded-2xl rounded-br-none px-4 py-3 bg-primary text-white shadow-md shadow-primary/10">Olá! Sim, achei linda. Como somos amigos da Maria, fico bem mais tranquilo. Você ainda tem o manual original dela?</div><div className="flex items-center gap-1 mr-1"><span className="text-slate-400 dark:text-[#9dabb9] text-[10px]">14:05</span><span className="material-symbols-outlined text-[14px] text-primary">done_all</span></div></div>
                </div>
                <div className="flex items-end gap-2 max-w-[85%]">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-8 shrink-0 mb-1" style={{ backgroundImage: `url("${IMAGES.avatarJuliana}")` }}></div>
                    <div className="flex flex-col gap-1"><div className="text-base font-normal leading-relaxed rounded-2xl rounded-bl-none px-4 py-3 bg-white dark:bg-[#283039] text-slate-900 dark:text-white shadow-sm">Tenho sim! Está na caixa original com a alça de couro. Se quiser, podemos marcar de você ver ela pessoalmente amanhã.</div><span className="text-slate-400 dark:text-[#9dabb9] text-[10px] ml-1">14:06</span></div>
                </div>
            </div>
        </main>
        <footer className="absolute bottom-0 left-0 w-full p-4 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 pb-8">
            <div className="flex items-center gap-3">
                <button className="flex items-center justify-center size-10 rounded-full bg-slate-200 dark:bg-white/5 text-slate-900 dark:text-white/70 hover:bg-slate-300 dark:hover:bg-white/10 active:scale-95 transition-all"><span className="material-symbols-outlined">add</span></button>
                <div className="relative flex-1"><input className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-none rounded-full px-5 py-3 text-slate-900 dark:text-white text-sm focus:ring-1 focus:ring-primary placeholder:text-slate-500 dark:placeholder:text-[#9dabb9]/50" placeholder="Mensagem..." type="text" /></div>
                <button className="flex items-center justify-center size-10 rounded-full bg-primary text-white shadow-lg shadow-primary/20 active:scale-90 transition-all"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span></button>
            </div>
        </footer>
    </div>
);

export default ChatScreen;
