import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { IMAGES } from '../constants/images';

const ContactsScreen = ({ onBack, onChat }: { onBack: () => void, onChat: () => void }) => {
    const [contacts, setContacts] = useState<any[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data } = await supabase.from('visible_users_for_user').select('*');
            if (data && user) {
                setContacts(data.filter(u => u.id !== user.id));
            }
        };
        fetchContacts();
    }, []);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
                <button onClick={onBack} className="text-slate-900 dark:text-white"><span className="material-symbols-outlined">arrow_back_ios</span></button>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Meus Contatos</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {contacts.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-slate-500">Nenhum contato visível ainda.</p>
                    </div>
                ) : contacts.map(contact => (
                    <div key={contact.id} className="flex items-center gap-4" onClick={onChat}>
                        <div className="size-12 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${contact.avatar_url || IMAGES.avatar1}")` }}></div>
                        <div className="flex-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <p className="font-bold text-slate-900 dark:text-white">{contact.name || 'Usuário'}</p>
                            <p className="text-xs text-slate-500">Confiável</p>
                        </div>
                        <button className="text-primary font-bold text-sm">Conversar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactsScreen;
