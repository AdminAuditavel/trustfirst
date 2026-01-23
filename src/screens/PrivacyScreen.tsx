import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { hashPhone } from '../../lib/utils';

const PrivacyScreen = ({ onSync, onBack }: { onSync: () => void, onBack: () => void }) => {
    const [loading, setLoading] = useState(false);

    const handleSync = async () => {
        setLoading(true);
        try {
            // 1. Check for Contact Picker API support (Mobile)
            const isSupported = 'contacts' in navigator && 'ContactsManager' in window;
            console.log('Contacts API Supported:', isSupported);

            if (isSupported) {
                try {
                    // @ts-ignore - The contacts API is not yet in all TS definitions
                    const contacts = await navigator.contacts.select(['tel'], { multiple: true });

                    if (!contacts || contacts.length === 0) {
                        setLoading(false);
                        return;
                    }

                    const phoneNumbers: string[] = [];

                    contacts.forEach((contact: any) => {
                        if (contact.tel && Array.isArray(contact.tel)) {
                            contact.tel.forEach((t: string) => phoneNumbers.push(t));
                        }
                    });

                    // Hash all numbers
                    const hashes = await Promise.all(phoneNumbers.map(p => hashPhone(p)));

                    // Call Backend
                    const { data: count, error } = await supabase.rpc('sync_contacts', { hashes });

                    if (error) throw error;

                    if (count > 0) {
                        alert(`Sincronização concluída! ${count} novo(s) contato(s) adicionado(s) à sua rede.`);
                    } else {
                        alert(`Sincronização concluída, mas nenhum dos ${contacts.length} contatos verificados está no app ainda (ou já foram adicionados).`);
                    }
                    onSync();

                } catch (ex) {
                    console.error(ex);
                    // Fallback or cancellation
                    if ((ex as any).name !== 'TypeError') { // TypeError usually means user cancelled or API check failed oddly
                        alert('Erro ao acessar contatos: ' + (ex as any).message);
                    } else {
                        setLoading(false); // Reset loading if cancelled
                    }
                }
            } else {
                // Desktop / Simulation Mode
                // On localhost/dev, we can simulate a sync for testing purposes
                const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

                if (isDev) {
                    const manualPhone = prompt("[DEV MODE] Digite um número de celular para simular (ex: 93991475601):");
                    if (manualPhone) {
                        try {
                            const hash = await hashPhone(manualPhone);
                            const { data: count, error } = await supabase.rpc('sync_contacts', { hashes: [hash] });

                            if (error) {
                                console.error(error);
                                alert('Erro na sincronização simulada: ' + error.message);
                            } else if (count > 0) {
                                alert(`Sucesso! Contato com final ${manualPhone.slice(-4)} foi adicionado.`);
                                onSync();
                            } else {
                                alert('Nenhum contato novo encontrado. Verifique se o número está registrado e não é o seu próprio.');
                            }
                        } catch (e: any) {
                            alert('Erro ao processar: ' + e.message);
                        }
                    } else {
                        setLoading(false); // Cancelled prompt
                    }
                } else {
                    console.log('Mobile support missing and not localhost');
                    alert('A funcionalidade de contatos não é suportada neste navegador. Tente usar no celular (Chrome/Safari).');
                }
            }

        } catch (ex: any) {
            console.error(ex);
            alert('Erro ao sincronizar: ' + ex.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden max-w-[430px] mx-auto border-x border-white/5">
            <div className="flex items-center bg-transparent p-4 pb-2 justify-between">
                <div onClick={onBack} className="text-white flex size-12 shrink-0 items-center justify-start cursor-pointer">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>arrow_back_ios</span>
                </div>
                <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Privacidade</h2>
            </div>
            <div className="flex justify-center pt-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
                    <div className="relative bg-primary/30 p-8 rounded-full border border-primary/40">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '80px' }}>group_work</span>
                    </div>
                </div>
            </div>
            <div className="px-6">
                <h1 className="text-white tracking-tight text-[32px] font-extrabold leading-tight text-center pb-2 pt-8">Seu Círculo de Confiança</h1>
                <p className="text-white/60 text-base font-normal leading-normal text-center px-4">Construa sua rede segura para negociar com quem você já conhece.</p>
            </div>
            <div className="mt-8 px-6 space-y-2">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
                        <span className="material-symbols-outlined text-primary text-[24px]">visibility</span>
                    </div>
                    <p className="text-white text-base font-medium leading-tight">Você vê ofertas de pessoas que conhece</p>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/20">
                        <span className="material-symbols-outlined text-primary text-[24px]">connect_without_contact</span>
                    </div>
                    <p className="text-white text-base font-medium leading-tight">Seus contatos veem suas ofertas</p>
                </div>
            </div>
            <div className="mt-auto pb-10 px-6 space-y-4 relative z-50 pointer-events-auto">
                <button
                    onClick={() => {
                        console.log('Button Clicked via onClick');
                        handleSync();
                    }}
                    onMouseDown={() => console.log('Button MouseDown')}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer relative z-50"
                >
                    {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : null}
                    {loading ? 'Sincronizando...' : 'Sincronizar contatos'}
                </button>
                <button onClick={onSync} className="w-full bg-transparent text-white/40 font-semibold py-2 px-6 rounded-xl hover:text-white/60 transition-colors">
                    Agora não
                </button>
            </div>
        </div>
    )
};

export default PrivacyScreen;
