import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ViewState } from '../../types';
import { IMAGES } from '../constants/images';

const PublicStoreScreen = ({ onChangeView, onBack, targetUserId }: { onChangeView: (view: ViewState) => void, onBack: () => void, targetUserId: string | null }) => {
    const [tab, setTab] = useState<'OFFERS' | 'SERVICES'>('OFFERS');
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // In real app we would fetch the user by targetUserId
        // For now we simulate or fetch the same user if null (which shouldn't happen in real flow)
        const fetchUser = async () => {
            if (!targetUserId) return;
            // This view isn't available for real profiles yet so we can skip logic or just mock
            // Mocking Juliana for demo if needed, or if it is a real user id, fetch it
            const { data, error } = await supabase.from('users').select('*').eq('id', targetUserId).maybeSingle();

            if (error) {
                console.error("[PublicStore] Error fetching user:", error);
            }

            if (data) {
                setUser(data);
            } else {
                console.log("[PublicStore] User not found (or new), using mock data.");
                setUser({
                    name: 'Juliana Santos',
                    location: 'São Paulo, SP',
                    avatar_url: IMAGES.avatarJuliana
                })
            }
        };
        fetchUser();
    }, [targetUserId]);

    return (
        <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-24">
            <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800 gap-4">
                <button onClick={onBack} className="text-slate-900 dark:text-white"><span className="material-symbols-outlined">arrow_back</span></button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Perfil Público</h2>
            </div>

            <div className="p-6 pb-2">
                <div className="flex gap-4">
                    <div className="size-20 rounded-full bg-cover bg-center border-2 border-slate-200 dark:border-slate-700" style={{ backgroundImage: `url("${user?.avatar_url || IMAGES.avatarJuliana}")` }}></div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name || 'Juliana Santos'}</h1>
                        <p className="text-slate-500 text-sm flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> {user?.location || 'São Paulo, SP'}</p>
                        <div className="flex items-center gap-1 mt-2 bg-green-100 dark:bg-green-900/30 w-fit px-2 py-0.5 rounded-lg border border-green-200 dark:border-green-900">
                            <span className="material-symbols-outlined text-green-700 dark:text-green-400 text-[16px]">verified</span>
                            <span className="text-green-700 dark:text-green-400 text-xs font-bold">Confiável (97)</span>
                        </div>
                    </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 leading-relaxed">
                    Designer de interiores apaixonada por garimpar peças únicas. Tudo aqui foi cuidado com muito carinho!
                </p>

                <div className="flex gap-2 mt-4">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-[14px]">group</span> Amiga de Maria Silva</div>
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-400"><span className="material-symbols-outlined text-[14px]">handshake</span> 5 negociações</div>
                </div>
            </div>

            <div className="border-b border-slate-200 dark:border-slate-800 px-6 flex gap-6 mt-4">
                <button onClick={() => setTab('OFFERS')} className={`pb-3 text-sm font-bold border-b-[3px] transition-colors ${tab === 'OFFERS' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Ofertas (12)</button>
                <button onClick={() => setTab('SERVICES')} className={`pb-3 text-sm font-bold border-b-[3px] transition-colors ${tab === 'SERVICES' ? 'border-primary text-primary' : 'border-transparent text-slate-400'}`}>Serviços (2)</button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
                {/* Mock Items */}
                <div onClick={() => onChangeView(ViewState.PRODUCT_DETAIL)} className="flex flex-col gap-2 cursor-pointer group">
                    <div className="relative aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${IMAGES.itemCamera}")` }}></div>
                        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">R$ 450</div>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Câmera Vintage</p>
                </div>
                <div className="flex flex-col gap-2 cursor-pointer group">
                    <div className="relative aspect-[4/5] bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuALCol8yiHQm2nIOlDpNaMpjWYf-eV0WG7wbAWc4ntRY4-xrw9e7Dyka4KkWUFfRU4Q9AsYHkBQsaV6UfKOaJakgZBbadSucXT5haDCiDwXP0r_RrqLwynFhLae5PnHRpd30SHtXb7ufeoBcSAFYI4UJiGnOJ-PIatInIITKEgw7gSrTmRPqRN0OVMGNPU6KkIGV8iwkSF_c8lNREnIFck5sQQ2AU2n7aVP-kQgQg0V-gTnc57RIHSM_J8dlTq-AEKEOf_Ozkn6zk")` }}></div>
                        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">R$ 1.200</div>
                    </div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Poltrona Eames</p>
                </div>
            </div>
        </div>
    );
};

export default PublicStoreScreen;
