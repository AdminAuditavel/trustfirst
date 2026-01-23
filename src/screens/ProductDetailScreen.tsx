import React from 'react';
import { ViewState } from '../../types';

const ProductDetailScreen = ({ onChangeView, onBack }: { onChangeView: (view: ViewState) => void, onBack: () => void }) => (
    <div className="bg-background-light dark:bg-background-dark text-white font-display min-h-screen pb-32">
        <div className="relative w-full h-[45vh]">
            <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJS_VwK7jAC_-hDXJZ0nmX63iGADEfD7TO0sNeVIYYUqRP6qMs6hDg4Yec38qXU10F_L36LCW5HTWF2GWOlhzwX6apGjd88en_zC_l5WAVYXicsoTqMCSIN2RljWmeNgoikvUFweNgoikvUFweaiPJQB7N9qNbXddc_g7qwUsOVKLsio8NHOvmsFciGiCVKI4cTaOJeDaBpWSoIKxKFQdFWqcuYg4MR1aqI-DnPHCcVupANi9khNoD0plR3zEfCnLOlBUJCFMDhQGZ1-nLO4-PY")' }}></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-background-dark/95"></div>
            <div className="absolute top-4 left-4 z-10"><button onClick={onBack} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"><span className="material-symbols-outlined">arrow_back</span></button></div>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"><span className="material-symbols-outlined">share</span></button>
                <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"><span className="material-symbols-outlined">favorite_border</span></button>
            </div>
        </div>
        <div className="px-6 -mt-10 relative z-10">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-black leading-tight text-white line-clamp-2">Câmera Vintage 35mm</h1>
                <div className="bg-primary px-3 py-1 rounded-lg shadow-lg shadow-primary/20"><span className="text-lg font-bold">R$ 450</span></div>
            </div>
            <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <span className="material-symbols-outlined text-[16px]">location_on</span> São Paulo, SP
                </div>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <div className="text-slate-400 text-sm">Há 2 dias</div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#1c2127] rounded-xl mb-6 cursor-pointer hover:bg-[#252b33] transition-colors border border-white/5" onClick={() => onChangeView(ViewState.PUBLIC_STORE)}>
                <div className="relative">
                    <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALCol8yiHQm2nIOlDpNaMpjWYf-eV0WG7wbAWc4ntRY4-xrw9e7Dyka4KkWUFfRU4Q9AsYHkBQsaV6UfKOaJakgZBbadSucXT5haDCiDwXP0r_RrqLwynFhLae5PnHRpd30SHtXb7ufeoBcSAFYI4UJiGnOJ-PIatInIITKEgw7gSrTmRPqRN0OVMGNPU6KkIGV8iwkSF_c8lNREnIFck5sQQ2AU2n7aVP-kQgQg0V-gTnc57RIHSM_J8dlTq-AEKEOf_Ozkn6zk")' }}></div>
                    <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full size-5 flex items-center justify-center border-2 border-[#1c2127]"><span className="material-symbols-outlined text-[12px]">check</span></div>
                </div>
                <div className="flex-1">
                    <p className="text-base font-bold text-white">Juliana Santos</p>
                    <p className="text-xs text-primary font-bold flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">group</span> Amiga de Maria Silva</p>
                </div>
                <span className="material-symbols-outlined text-slate-500">chevron_right</span>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Sobre este item</h3>
                <p className="text-slate-300 leading-relaxed text-sm">Câmera analógica em perfeito estado de conservação. Lente 50mm f/1.8 limpa e sem fungos. Fotômetro funcionando 100%. Acompanha alça de couro original e capa protetora. Ideal para estudantes de fotografia ou colecionadores.</p>
                <div className="flex flex-wrap gap-2 mt-4">
                    <div className="px-3 py-1.5 bg-[#1c2127] rounded-lg text-xs font-bold text-slate-300 border border-white/5">Câmeras</div>
                    <div className="px-3 py-1.5 bg-[#1c2127] rounded-lg text-xs font-bold text-slate-300 border border-white/5">Vintage</div>
                    <div className="px-3 py-1.5 bg-[#1c2127] rounded-lg text-xs font-bold text-slate-300 border border-white/5">Fotografia</div>
                </div>
            </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full p-4 bg-background-dark/95 backdrop-blur-xl border-t border-white/10 pb-8 z-50">
            <div className="max-w-md mx-auto flex gap-4">
                <button onClick={() => onChangeView(ViewState.CHAT)} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">chat</span>
                    Tenho Interesse
                </button>
            </div>
        </div>
    </div>
);

export default ProductDetailScreen;
