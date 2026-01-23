import React from 'react';
import { ViewState } from '../../types';
import { IMAGES } from '../constants/images';

const ProfessionalProfileScreen = ({ onChangeView, onBack }: { onChangeView: (view: ViewState) => void, onBack: () => void }) => (
    <div className="max-w-[480px] mx-auto min-h-screen flex flex-col relative pb-28">
        <div className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
            <button onClick={onBack} className="text-slate-900 dark:text-white"><span className="material-symbols-outlined">arrow_back</span></button>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Meu Perfil Profissional</h2>
        </div>

        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="size-20 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <span className="material-symbols-outlined text-4xl">design_services</span>
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white">Designer Gráfico</h1>
                    <p className="text-slate-500 text-sm">Disponível para freelancers</p>
                </div>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">Branding</div>
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">UI Design</div>
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">Social Media</div>
                <div className="border border-slate-200 dark:border-slate-700 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined text-[14px]">add</span> Adicionar
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Meus Serviços</h3>
                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"><span className="material-symbols-outlined text-[16px]">add_circle</span> Novo Serviço</button>
            </div>

            <div className="space-y-4">
                {/* Mock Service Item */}
                <div onClick={() => onChangeView(ViewState.SERVICE_DETAIL)} className="bg-white dark:bg-[#1c2127] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Criação de Identidade Visual</h4>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Ativo</span>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-3">Desenvolvimento completo de marca, incluindo logotipo, paleta de cores, tipografia e manual de marca.</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-900 dark:text-white">R$ 2.500,00</p>
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">visibility</span> 142</span>
                            <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">chat</span> 3</span>
                        </div>
                    </div>
                </div>

                {/* Mock Service Item 2 */}
                <div className="bg-white dark:bg-[#1c2127] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-primary/50 transition-colors group opacity-60">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">Consultoria de Design</h4>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Pausado</span>
                    </div>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-3">Análise e direcionamento visual para marcas que precisam se reposicionar no mercado.</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-900 dark:text-white">R$ 400,00 <span className="text-slate-400 font-normal text-xs">/hora</span></p>
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">visibility</span> 45</span>
                            <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">chat</span> 0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default ProfessionalProfileScreen;
