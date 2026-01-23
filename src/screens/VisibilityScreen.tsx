import React, { useState } from 'react';

const VisibilityScreen = ({ onConfirm, onBack }: { onConfirm: () => void, onBack: () => void }) => {
    const [shared, setShared] = useState(true);

    return (
        <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>

            <div className="bg-[#1c2127] p-8 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full relative z-10">
                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-primary text-4xl">visibility</span>
                </div>

                <h2 className="text-white text-2xl font-bold mb-3">Quem pode ver isso?</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                    No TrustCircle, a privacidade vem em primeiro lugar. Você escolhe se sua oferta é para todos ou só para quem você confia.
                </p>

                <div className="space-y-3 mb-8">
                    <div
                        onClick={() => setShared(true)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 text-left ${shared ? 'border-primary bg-primary/10' : 'border-white/10 hover:bg-white/5'}`}
                    >
                        <div className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 ${shared ? 'border-primary' : 'border-slate-500'}`}>
                            {shared && <div className="size-3 rounded-full bg-primary"></div>}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Minha Rede (Recomendado)</p>
                            <p className="text-slate-400 text-xs">Visível para seus contatos e amigos deles.</p>
                        </div>
                    </div>

                    <div
                        onClick={() => setShared(false)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 text-left ${!shared ? 'border-primary bg-primary/10' : 'border-white/10 hover:bg-white/5'}`}
                    >
                        <div className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 ${!shared ? 'border-primary' : 'border-slate-500'}`}>
                            {!shared && <div className="size-3 rounded-full bg-primary"></div>}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">Apenas Link Direto</p>
                            <p className="text-slate-400 text-xs">Ninguém vê, a menos que você mande o link.</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onBack} className="flex-1 py-3 text-slate-400 font-bold hover:text-white transition-colors">Cancelar</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">Publicar</button>
                </div>
            </div>
        </div>
    );
};

export default VisibilityScreen;
