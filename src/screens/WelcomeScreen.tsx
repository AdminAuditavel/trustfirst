import React from 'react';
import { IMAGES } from '../constants/images';

const WelcomeScreen = ({ onStart, onLogin }: { onStart: () => void, onLogin: () => void }) => (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="w-full h-full bg-center bg-no-repeat bg-cover flex flex-col justify-end" style={{ backgroundImage: `url("${IMAGES.bgWelcome}")` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#101922] via-[#101922]/60 to-transparent"></div>
            </div>
        </div>
        <div className="relative z-10 flex flex-col h-full justify-end px-6 pb-12">
            <div className="flex w-full flex-row items-center justify-center gap-2 mb-8">
                <div className="h-1.5 w-8 rounded-full bg-primary"></div>
                <div className="h-1.5 w-2 rounded-full bg-white/20"></div>
                <div className="h-1.5 w-2 rounded-full bg-white/20"></div>
            </div>
            <div className="mb-4">
                <h1 className="text-white tracking-tight text-[36px] font-extrabold leading-[1.1] text-center">Venda primeiro para quem já confia em você.</h1>
            </div>
            <div className="mb-2">
                <p className="text-white/90 text-lg font-medium leading-normal text-center">Sem grupos. Sem spam. Sem anúncios públicos.</p>
            </div>
            <div className="mb-10">
                <p className="text-white/60 text-sm font-normal leading-relaxed text-center max-w-[280px] mx-auto">Aqui, você compartilha. Seus contatos veem se quiserem.</p>
            </div>
            <div className="w-full flex flex-col gap-4">
                <button onClick={onStart} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-wide ios-shadow active:scale-[0.98] transition-transform">
                    <span className="truncate">Começar</span>
                </button>
                <button onClick={onLogin} className="flex w-full cursor-pointer items-center justify-center overflow-hidden h-10 px-5 text-white/70 text-sm font-medium hover:text-white transition-colors">
                    <span className="truncate">Já tenho uma conta</span>
                </button>
            </div>
        </div>
    </div>
);

export default WelcomeScreen;
