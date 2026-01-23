import React from 'react';
import { ViewState } from '../../types';

const MyItemsScreen = ({ onChangeView }: { onChangeView: (view: ViewState) => void }) => (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden max-w-md mx-auto pb-24">
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-200 dark:border-[#3b4754]">
            <div onClick={() => onChangeView(ViewState.HOME)} className="text-gray-900 dark:text-white flex size-12 shrink-0 items-center"><span className="material-symbols-outlined cursor-pointer">arrow_back_ios</span></div>
            <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">Meus Itens e Ofertas</h2>
            <div className="flex w-12 items-center justify-end"><button className="flex items-center justify-center rounded-lg h-12 text-primary"><span className="material-symbols-outlined">add_circle</span></button></div>
        </div>
        <div className="p-4">
            <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#111418] p-5 shadow-sm">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">verified_user</span><p className="text-gray-900 dark:text-white text-base font-bold">Privacidade garantida</p></div>
                    <p className="text-gray-600 dark:text-[#9dabb9] text-sm">Seus contatos são os primeiros a ver. Nada é enviado automaticamente.</p>
                </div>
                <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary text-white text-sm font-medium">Saiba mais</button>
            </div>
        </div>
        <div className="pb-1">
            <div className="flex border-b border-gray-200 dark:border-[#3b4754] px-4 gap-8">
                <div className="flex flex-col items-center justify-center border-b-[3px] border-primary text-primary pb-[13px] pt-4 cursor-pointer"><p className="text-sm font-bold">Todos</p></div>
                <div className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-500 dark:text-[#9dabb9] pb-[13px] pt-4 cursor-pointer"><p className="text-sm font-bold">Ativos</p></div>
                <div className="flex flex-col items-center justify-center border-b-[3px] border-transparent text-gray-500 dark:text-[#9dabb9] pb-[13px] pt-4 cursor-pointer"><p className="text-sm font-bold">Vendidos</p></div>
            </div>
        </div>
        <div className="flex flex-col">
            <div className="flex gap-4 bg-white dark:bg-background-dark px-4 py-4 justify-between border-b border-gray-100 dark:border-[#1e2936]">
                <div className="flex items-start gap-4">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[80px] shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCDdUUetSyZI6IRoZXCRZt4DsBlaql5d6vj_NiMBlMja8zSXUQiHXoWsqgeMBTC7ig4UK7OqBQfPcLmbO0bwkd5eLjgyKwB3MT7jsempja73MZs1Sj6FMl47pl0OfH_hXQq4h5H6WuPw4K7on6reYn8ljwP2BsMxFQHvdjL1fMGuvLLqG9T28soQGGXfA6FumUcfs5KQ4Ym8iJ7cIERgkDo63TkG95I0P_bIjfqdT58ZTMpvrr-R732RBxH-UGgwTT5qIkCPHXk65A")' }}></div>
                    <div className="flex flex-1 flex-col justify-center"><p className="text-gray-900 dark:text-white text-base font-bold">iPhone 13 Pro Max</p><div className="flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-gray-400 text-[16px]">group</span><p className="text-gray-500 dark:text-[#9dabb9] text-xs">42 visualizações na rede</p></div><p className="text-primary text-base font-bold mt-1">R$ 4.500</p></div>
                </div>
                <div className="flex flex-col items-end justify-between py-1"><div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full"><div className="size-2 rounded-full bg-[#0bda5b]"></div><span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Ativo</span></div><span className="material-symbols-outlined text-gray-400 cursor-pointer">more_horiz</span></div>
            </div>
            <div className="flex gap-4 bg-white dark:bg-background-dark px-4 py-4 justify-between border-b border-gray-100 dark:border-[#1e2936]">
                <div className="flex items-start gap-4">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[80px] shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBb4ZUVD_obHNfU5Lx5zkmAWA_HXdJMI_tP_I43kKqEpLXGqwIi3Eqe2rEV26oFvJeNbPCpkCw6_tdLK4eKTccWh03hpgp0fnUnGB7B4y3cFJfHdp2gL4I4ucvsi6gE4lzc7SMn6uNAxXEDC_n0ESz7TaWefMOxuxyoLVYF0ZUp9sPiVBXaS_a723MlKK6eHwbsb6qQnIxo_q7Lwoo2jWDVlC1Qj0HbhmjO4ojMdzZVTL5FJOkUSJMPwLxRyap-piBzzLMqZiS5jP4")' }}></div>
                    <div className="flex flex-1 flex-col justify-center"><p className="text-gray-900 dark:text-white text-base font-bold">Monitor Gamer 27"</p><div className="flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-gray-400 text-[16px]">group</span><p className="text-gray-500 dark:text-[#9dabb9] text-xs">15 visualizações na rede</p></div><p className="text-primary text-base font-bold mt-1">R$ 1.200</p></div>
                </div>
                <div className="flex flex-col items-end justify-between py-1"><div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full"><div className="size-2 rounded-full bg-[#0bda5b]"></div><span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Ativo</span></div><span className="material-symbols-outlined text-gray-400 cursor-pointer">more_horiz</span></div>
            </div>
            <div className="flex gap-4 bg-white/50 dark:bg-background-dark/50 px-4 py-4 justify-between border-b border-gray-100 dark:border-[#1e2936] opacity-70">
                <div className="flex items-start gap-4">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-[80px] grayscale" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAB9GgRA3_mbLcts27UK3hoyyaVTW0SXk5K47kuvTeEU2jpX8bgEgtdQPj4zy2RSia93Cf5ZRBheqqpkuYq7J_anHnqCFAL3ta8bBm0yOn2P1QeGPwNwhqiXEImdDh9pXZ_6Ung4uFW4WNAvUwO-xz8CRZ6fVW-UObr9Fy26Lv2ppDKeOJe6aWCrg_4RLGSkiB3UOIfBXEgDanE3grMPimTtp_oaBlOWLZMmd_TQPmcYlybQT1MWmvbAs-FdeX13Q9mY4ZNlZx5K4k")' }}></div>
                    <div className="flex flex-1 flex-col justify-center"><p className="text-gray-900 dark:text-white text-base font-bold">Teclado Mecânico RGB</p><div className="flex items-center gap-1 mt-0.5"><span className="material-symbols-outlined text-gray-400 text-[16px]">group</span><p className="text-gray-500 dark:text-[#9dabb9] text-xs">89 visualizações na rede</p></div><p className="text-gray-500 dark:text-[#9dabb9] text-base font-bold mt-1">Vendido</p></div>
                </div>
                <div className="flex flex-col items-end justify-between py-1"><div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700"><div className="size-2 rounded-full bg-gray-400"></div><span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendido</span></div><span className="material-symbols-outlined text-gray-400 cursor-pointer">more_horiz</span></div>
            </div>
        </div>
        <div className="fixed bottom-24 right-6 z-50">
            <button onClick={() => onChangeView(ViewState.VISIBILITY)} className="bg-primary hover:bg-primary/90 text-white size-14 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95"><span className="material-symbols-outlined text-[32px]">add</span></button>
        </div>
    </div>
);

export default MyItemsScreen;
