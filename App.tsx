import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import { supabase } from './lib/supabase';

// --- Assets ---
const IMAGES = {
  bgWelcome: "https://lh3.googleusercontent.com/aida-public/AB6AXuD29tBymFMDfk3vDOLyFvpAM7dNiJH2mGzarYSwS_fe0EmeDBlq4z_VD0fQ4Xi-qHa6vO1uL7rr_HjqbguJDCIKQwZT13DDLxv8oiXFh70xIbGbbFbk8O9miG3bEb2GLL2gUUFlueMT_ImJDFinAPQu4k_LHSp39L1vdKXTDQPaAfmsVlfchdduBPF9ptU4UMDUFCQcaXo-YWoZODxI2ZjH0gSElAYkb2M-x1G57mkAWphYT-c5tA6Tu9u-xEy8dHOhTSIsaCSBhx0",
  avatar1: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVdFllcYvR_SQdhiLy6q6oJFyrQF6rEUOF1t-YNSD4sADJPl-Xgc1SE_0AOn6dHxGfLIHDzs19LXKFvPyCf2QLjTFEU9Pb8jpHKkgFXdw1LRNojzyi7dWZqgXHs9ZKX9dueXN6KJh1tC4b22ppQZXyZ_kS720EkJUVzW2P9oTjsbjWKQUo8RW-kbhcm0lKGW30UyhA3aBtCoJHWu0btWdjZI5Fa7dgpAkINIIFkBcIAciFz0ynwaw5gUWmyagrTsV2out7jYi5LwA",
  avatar2: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQOWvG1BV9Xfeuez1KO-XPt03CUQ7MixQKU_rCSPdcaoT7SZGzqn7tELh_Md_61lbOGzCZjFovD9cumAFGd5ecCEXzwYphy5vdzdltSHsIyRRnlPmdpf8fhz6HdGuVYYBSXI4iZSKxymVFFeOObPx6cp2xjTkzc-nsrkr1b3PtRnY-hGcj4h1pZu19RZLFNCgNEVrbewzVsKx2ltPnzEloRdc_oI7HJWFyu2HF94sAOR-hMm-5ASnIBrJ_dPOSUiS_ybULywGvUQs",
  avatarAlex: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcrWJvL_-d96_3qOGDjM6w2VE9dK-HPGQx_hPdzYCUjuCAiUk3OiEg3xqSmsMy6YVdzULmNfWixYYJxVmdDATiltzJYyFYFVr2Z57JsDOLGzu64Bb2uSB4bye2v_EDf9DlG4sOd5TeiTZQsk0u6qjXRRS_8Xo6XYzd7zdH85tAscp3jCuhtskkil0LxvQO8GLln6RJpHEhI-ueWbT9rTAU6ywdoRpRGGjYUjEkr23AdNE8bRx4P7WD1Qs8BRNTTTpm8Oklh5p_auI",
  avatarRicardo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmdWQSF9IWxnaMMf1Ejri5xgb7_Vu0N3SbfxY6hyi-fpx0AmKcHaEGXrf2TqtRLErRnURx5YOJWMjSzqH01GsKrW0l1ewiK4WYKc0FkKjO7wv57G74zFEu4YMRGuUHUTPtp3JdRLqd6hHpa1TM9vu7d6vf4O2CfMZZQkGX0SLBWmj87envRldukeanYvwCVCmcPAduy21pTmHJg5ptxq2dgMXnlG440-QdTvS7nYewoaQ0mSgk3r5DPMKQGsYvyKYzimfzvzJJMjA",
  itemCamera: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJS_VwK7jAC_-hDXJZ0nmX63iGADEfD7TO0sNeVIYYUqRP6qMs6hDg4Yec38qXU10F_L36LCW5HTWF2GWOlhzwX6apGjd88en_zC_l5WAVYXicsoTqMCSIN2RljWmeNgoikvUFweaiPJQB7N9qNbXddc_g7qwUsOVKLsio8NHOvmsFciGiCVKI4cTaOJeDaBpWSoIKxKFQdFWqcuYg4MR1aqI-DnPHCcVupANi9khNoD0plR3zEfCnLOlBUJCFMDhQGZ1-nLO4-PY",
  itemBike: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWK0ukRVSE4WwynB_H8hvH6zl9nlfXAuN1GDg0cd6PA_9V8GsZicINVsHl3RfOR-S0APCI-rLrwMcDc1nyRQ62dWT15J4jfiLtZEOIM2eW2Mrrynmvd8KX5ayjl-uNyo7bzv0K3HX2sfkxAR_JjTs53NqvO20KrRh-sx_BNFNYQD5lMBk6oNluCa_C9OuwaMObdiJzmP5ohTNBZ8p5WjE-nHM7xsd7xlLdI_Mq1dz4bXad7noqxZAk5B4rCsOePWEC-mq8Y1I7AgU",
  itemMap: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNAasSPvMvHMj3ovLWm5ScCM7TGX46gBpW6Vzx1nEbI4qcGe1ZYVeFXUY1zXPao1i7ewCMz7Pg9l136QFrW2j7KjQvt7SNTX_32ZbVVSsP5dOLsvkp5CO8unz4vGPfUat5stiVzkR7QyswCk2o1MGUkIhNyERKuG2Q6IrjWZzJeF8WbNYS7KFR38xcz6GCJXYXxNC3uDiJzgU4z6rENjgHulkgg_-f6hFCw04u_C-5TKzU20wducklup3uuvco0iY7ol-bzq3frjY",
  avatarJuliana: "https://lh3.googleusercontent.com/aida-public/AB6AXuALCol8yiHQm2nIOlDpNaMpjWYf-eVQ0WG7wbAWc4ntRY4-xrw9e7Dyka4KkWUFfRU4Q9AsYHkBQsaV6UfKOaJakgZBbadSucXT5haDCiDwXP0r_RrqLwynFhLae5PnHRpd30SHtXb7ufeoBcSAFYI4UJiGnOJ-PIatInIITKEgw7gSrTmRPqRN0OVMGNPU6KkIGV8iwkSF_c8lNREnIFck5sQQ2AU2n7aVP-kQgQg0V-gTnc57RIHSM_J8dlTq-AEKEOf_Ozkn6zk"
};

// --- Components ---

interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

const CompleteProfileScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); // New password state

  const [ufs, setUfs] = useState<IBGEUF[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => response.json())
      .then(data => setUfs(data));
  }, []);

  useEffect(() => {
    if (selectedUf) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => response.json())
        .then(data => setCities(data));
    } else {
      setCities([]);
    }
  }, [selectedUf]);

  const hashPhone = async (phone: string) => {
    const msgBuffer = new TextEncoder().encode(phone);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // 1. Update Password if provided
      if (password) {
        const { error: pwdError } = await supabase.auth.updateUser({ password: password });
        if (pwdError) throw pwdError;
      }

      const phoneValue = phone || user.phone || '';
      const phoneHash = await hashPhone(phoneValue.replace(/\D/g, ''));

      const updates = {
        id: user.id,
        email: user.email, // ENSURE email is saved to public profile
        name,
        location: `${selectedCity} - ${selectedUf}`,
        phone: phoneValue,
        phone_hash: phoneHash,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertError } = await supabase.from('users').upsert(updates);

      if (upsertError) throw upsertError;

      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Complete seu perfil</h2>
          <p className="mt-2 text-sm text-slate-500">Defina sua senha e seus dados para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
              placeholder="Ex: Maria Silva"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Senha de Acesso</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
              placeholder="Crie sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Mínimo de 6 caracteres.</p>
          </div>

          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
              <select
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                value={selectedUf}
                onChange={e => {
                  setSelectedUf(e.target.value);
                  setSelectedCity('');
                }}
              >
                <option value="">UF</option>
                {ufs.map(uf => (
                  <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cidade</label>
              <select
                required
                disabled={!selectedUf}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100 disabled:opacity-50"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
              >
                <option value="">Selecione a cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">WhatsApp / Telefone</label>
            <input
              type="tel"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Usado apenas para parear seus contatos. Não será exibido publicamente.</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Salvando...' : 'Concluir Cadastro'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Sair / Não é você?
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Components ---

const EditProfileScreen = ({ onBack, isInitialSetup = false }: { onBack: () => void, isInitialSetup?: boolean }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [ufs, setUfs] = useState<IBGEUF[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => response.json())
      .then(data => setUfs(data));

    // Load initial data
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Default to auth phone if available
        let currentPhone = user.phone || '';

        const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
        if (profile) {
          setName(profile.name || '');
          setAvatarUrl(profile.avatar_url || '');
          // Prioritize profile phone if set
          if (profile.phone) {
            currentPhone = profile.phone;
          }
          if (profile.location) {
            try {
              const parts = profile.location.split(' - ');
              if (parts.length === 2 && parts[1].length === 2) {
                setSelectedUf(parts[1]);
                // We can't easily auto-select city without proper async chain or complex logic
                // For now we set it, and if it matches the loaded city list (triggered by effect), it works
                setSelectedCity(parts[0]);
              }
            } catch (e) { }
          }
        }
        setPhone(currentPhone);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedUf) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => response.json())
        .then(data => setCities(data));
    } else {
      setCities([]);
    }
  }, [selectedUf]);

  const hashPhone = async (phone: string) => {
    const msgBuffer = new TextEncoder().encode(phone);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    setIsUploading(true);
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      setError('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      if (password) {
        const { error: pwdError } = await supabase.auth.updateUser({ password: password });
        if (pwdError) throw pwdError;
      }

      const phoneValue = phone || user.phone || '';
      const phoneHash = await hashPhone(phoneValue.replace(/\D/g, ''));

      const updates: any = {
        id: user.id,
        email: user.email,
        name,
        phone: phoneValue,
        phone_hash: phoneHash,
        updated_at: new Date().toISOString(),
        avatar_url: avatarUrl
      };

      if (selectedCity && selectedUf) {
        updates.location = `${selectedCity} - ${selectedUf}`;
      }

      const { error: upsertError } = await supabase.from('users').upsert(updates);

      if (upsertError) {
        // Handle unique constraints explicitly
        if (upsertError.code === '23505') { // unique_violation code
          if (upsertError.message?.includes('users_phone_key') || upsertError.details?.includes('phone')) {
            throw new Error('Este telefone já está cadastrado por outro usuário.');
          }
          if (upsertError.message?.includes('users_email_key') || upsertError.details?.includes('email')) {
            throw new Error('Este e-mail já está cadastrado por outro usuário.');
          }
        }
        throw upsertError;
      }

      if (!isInitialSetup) {
        setMsg('Perfil atualizado com sucesso!');
        setTimeout(() => {
          onBack();
        }, 1500);
      } else {
        onBack();
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {!isInitialSetup && (
          <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        )}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isInitialSetup ? 'Complete seu perfil' : 'Editar Perfil'}</h2>
          <p className="mt-2 text-sm text-slate-500">{isInitialSetup ? 'Defina sua senha e seus dados.' : 'Atualize suas informações.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="size-24 rounded-full bg-slate-200 dark:bg-slate-700 bg-cover bg-center border-4 border-white dark:border-background-dark shadow-lg" style={{ backgroundImage: `url("${avatarUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVdFllcYvR_SQdhiLy6q6oJFyrQF6rEUOF1t-YNSD4sADJPl-Xgc1SE_0AOn6dHxGfLIHDzs19LXKFvPyCf2QLjTFEU9Pb8jpHKkgFXdw1LRNojzyi7dWZqgXHs9ZKX9dueXN6KJh1tC4b22ppQZXyZ_kS720EkJUVzW2P9oTjsbjWKQUo8RW-kbhcm0lKGW30UyhA3aBtCoJHWu0btWdjZI5Fa7dgpAkINIIFkBcIAciFz0ynwaw5gUWmyagrTsV2out7jYi5LwA'}")` }}>
              </div>
              <label
                className={`absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 hover:bg-primary/90 shadow-md transform translate-x-1/4 translate-y-1/4 cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {isUploading ? <span className="material-symbols-outlined text-sm animate-spin">refresh</span> : <span className="material-symbols-outlined text-sm">edit</span>}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
              placeholder="Ex: Maria Silva"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{isInitialSetup ? 'Senha de Acesso' : 'Nova Senha (opcional)'}</label>
            <input
              type="password"
              required={isInitialSetup}
              minLength={6}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
              placeholder={isInitialSetup ? "Crie sua senha" : "Deixe em branco para manter"}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Mínimo de 6 caracteres.</p>
          </div>

          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Estado</label>
              <select
                required={isInitialSetup}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                value={selectedUf}
                onChange={e => {
                  setSelectedUf(e.target.value);
                  setSelectedCity('');
                }}
              >
                <option value="">UF</option>
                {ufs.map(uf => (
                  <option key={uf.id} value={uf.sigla}>{uf.sigla}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cidade</label>
              <select
                required={isInitialSetup}
                disabled={!selectedUf}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100 disabled:opacity-50"
                value={selectedCity}
                onChange={e => setSelectedCity(e.target.value)}
              >
                <option value="">Selecione a cidade</option>
                {cities.map(city => (
                  <option key={city.id} value={city.nome}>{city.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">WhatsApp / Telefone</label>
            <input
              type="tel"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">Usado apenas para parear seus contatos. Não será exibido publicamente.</p>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {msg && <p className="text-green-500 text-sm text-center">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Salvando...' : (isInitialSetup ? 'Concluir Cadastro' : 'Salvar Alterações')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            {isInitialSetup ? 'Sair / Não é você?' : 'Sair da Conta'}
          </button>
        </div>
      </div>
    </div>
  );
};

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

const PrivacyScreen = ({ onSync, onBack }: { onSync: () => void, onBack: () => void }) => (
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
    <div className="mt-auto pb-10 px-6 space-y-4">
      <button onClick={onSync} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
        Sincronizar contatos
      </button>
      <button onClick={onSync} className="w-full bg-transparent text-white/40 font-semibold py-2 px-6 rounded-xl hover:text-white/60 transition-colors">
        Agora não
      </button>
    </div>
  </div>
);

const HomeScreen = ({ onChangeView, onSelectUser, userAvatar }: { onChangeView: (view: ViewState) => void, onSelectUser: (id: string) => void, userAvatar: string | null }) => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase.from('visible_users_for_user').select('*');
      if (usersData) setProfiles(usersData);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <main className="max-w-md mx-auto pb-24 pt-4 min-h-screen bg-[#0d1117] text-white">
      <header className="fixed top-0 z-50 bg-[#0d1117]/80 backdrop-blur-md w-full max-w-md border-b border-[#30363d]/50">
        <div className="flex items-center p-4 justify-between">
          <div onClick={() => onChangeView(ViewState.PROFILE_PERSONAL)} className="flex size-10 shrink-0 items-center justify-center rounded-full overflow-hidden border border-slate-700 cursor-pointer p-0.5">
            <div className="bg-center bg-no-repeat aspect-square bg-cover w-full h-full rounded-full" style={{ backgroundImage: `url("${userAvatar || IMAGES.avatarAlex}")` }}></div>
          </div>
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center font-display">Discover People</h1>
          <div className="flex w-10 items-center justify-end">
            <button onClick={() => onChangeView(ViewState.SEARCH)} className="flex items-center justify-center rounded-full h-10 w-10 text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </header>

      <section className="pt-20">
        <div className="flex items-center justify-between px-4 pt-6 pb-4">
          <h2 className="text-xl font-bold leading-tight tracking-tight">Da sua rede</h2>
          <button className="text-[#58a6ff] text-sm font-semibold">Ver todos</button>
        </div>
        {loading ? (
          <div className="px-4 py-8 text-center text-slate-500">Carregando sua rede...</div>
        ) : (
          <div className="flex overflow-x-auto gap-4 px-4 py-1 snap-x no-scrollbar">
            {profiles.slice(0, 5).map((p, i) => (
              <div key={p.id || i} onClick={() => onSelectUser(p.id)} className="flex flex-col rounded-2xl min-w-[190px] snap-start bg-[#161b22] overflow-hidden border border-[#30363d] cursor-pointer transition-transform active:scale-95 group">
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url("${p.avatar_url || IMAGES.avatar1}")` }}></div>
                  <div className="absolute top-2 right-2 bg-[#2188ff] text-white px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">Ativo agora</div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-base font-bold truncate pr-2">{p.name || 'User'}</p>
                    <div className="flex items-center gap-1 bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d]">
                      <span className="material-symbols-outlined text-[12px] text-[#58a6ff]" style={{ fontVariationSettings: "'FILL' 1" }}>diversity_3</span>
                      <span className="text-[10px] font-bold">5</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-[11px] flex items-center gap-1 truncate">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> {p.location || 'Brasil'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 px-4">
        <div className="py-2 mb-4">
          <h2 className="text-xl font-bold leading-tight tracking-tight">Conexões em comum</h2>
          <p className="text-sm text-slate-500 mt-1">Gente que seus amigos conhecem</p>
        </div>
        <div className="space-y-4 pb-12 text-white">
          {profiles.map((p, i) => (
            <div key={p.id || i} className="flex items-center gap-4 py-2 border-b border-[#30363d]/50 last:border-none">
              <div className="relative shrink-0">
                <div className="size-16 rounded-full bg-cover bg-center border-2 border-[#30363d]" style={{ backgroundImage: `url("${p.avatar_url || IMAGES.avatar1}")` }}></div>
                <div className="absolute -bottom-0.5 -right-0.5 bg-[#0d1117] p-0.5 rounded-full border border-[#0d1117]">
                  <span className="material-symbols-outlined text-[#2188ff] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-bold truncate">{p.name || 'User'}</p>
                  <span className="bg-[#161b22] text-[#58a6ff] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border border-[#30363d] tracking-tighter whitespace-nowrap">3 OFERTAS</span>
                </div>
                <p className="text-slate-500 text-xs flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-[16px]">group</span> 12 contatos em comum
                </p>
                <p className="text-slate-600 text-[11px] font-medium">{p.location || 'Localização'}</p>
              </div>
              <button onClick={() => onSelectUser(p.id)} className="shrink-0 bg-[#1c2128] text-white px-4 py-1.5 rounded-xl text-xs font-bold border border-[#30363d] shadow-sm hover:bg-[#21262d] transition-colors">Ver perfil</button>
            </div>
          ))}
        </div>

        <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Puxar para carregar mais</span>
          <span className="material-symbols-outlined animate-bounce">expand_more</span>
        </div>
      </section>
    </main>
  );
};

const MarketplaceScreen = ({ onChangeView, onSelectUser }: { onChangeView: (view: ViewState) => void, onSelectUser: (id: string) => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase.from('visible_users_for_user').select('*');
      if (usersData) setProfiles(usersData);
      const { data: itemsData } = await supabase.from('visible_items_for_user').select('*').order('created_at', { ascending: false });
      if (itemsData) setItems(itemsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getOwner = (id: string) => profiles.find(p => p.id === id) || { id: null, name: 'Unknown', avatar_url: null };

  return (
    <main className="max-w-md mx-auto pb-32 min-h-screen bg-[#0d1117] text-white">
      <header className="fixed top-0 z-50 bg-[#0d1117]/80 backdrop-blur-md w-full max-w-md border-b border-[#30363d]/50">
        <div className="flex items-center p-4 justify-between">
          <h1 className="text-xl font-bold">Marketplace</h1>
          <button className="text-slate-400"><span className="material-symbols-outlined">search</span></button>
        </div>
      </header>

      <div className="pt-20 px-4 grid grid-cols-2 gap-4 pb-12">
        {loading ? [...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-[#161b22] rounded-2xl animate-pulse"></div>) :
          items.map(item => {
            const owner = getOwner(item.owner_id);
            return (
              <div key={item.id} onClick={() => onChangeView(ViewState.PRODUCT_DETAIL)} className="flex flex-col gap-2 cursor-pointer group">
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#30363d] bg-[#161b22]">
                  <div className="absolute inset-0 bg-center bg-cover transition-transform group-hover:scale-105" style={{ backgroundImage: `url("${IMAGES.itemCamera}")` }}></div>
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full hover:bg-black/60 transition-colors">
                    <span className="material-symbols-outlined text-[18px] text-white">favorite</span>
                  </div>
                </div>
                <div className="px-1">
                  <p className="font-bold text-sm truncate">{item.title}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[#58a6ff] font-bold text-sm">R$ {item.price}</p>
                    <div className="flex items-center gap-1.5" onClick={(e) => { e.stopPropagation(); if (owner.id) onSelectUser(owner.id); }}>
                      <div className="size-4 rounded-full bg-cover bg-center border border-[#30363d]" style={{ backgroundImage: `url("${owner.avatar_url || IMAGES.avatar1}")` }}></div>
                      <p className="text-[10px] text-slate-500 truncate max-w-[60px]">{owner.name?.split(' ')[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
};

const SearchScreen = ({ onBack }: { onBack: () => void }) => (
  <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
    <div className="p-4 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
      <button onClick={onBack} className="text-slate-900 dark:text-white"><span className="material-symbols-outlined">arrow_back</span></button>
      <div className="flex-1 relative">
        <input autoFocus type="text" placeholder="Buscar pessoas ou itens..." className="w-full bg-slate-200 dark:bg-[#1c2127] border-none rounded-xl py-2.5 pl-4 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 text-sm font-medium" />
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Recentes</h3>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300">iPhone 13</span>
        <span className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300">Câmeras</span>
        <span className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg text-sm text-slate-700 dark:text-slate-300">Mariana Rios</span>
      </div>
    </div>
  </div>
);

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

const UserProfileScreen = ({ onChangeView, onBack, targetUserId }: { onChangeView: (view: ViewState) => void, onBack: () => void, targetUserId: string | null }) => {
  const [tab, setTab] = useState<'OFFERS' | 'SERVICES'>('OFFERS');
  const [user, setUser] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const idToFetch = targetUserId || currentUser?.id;

      if (!idToFetch) return;

      setIsOwnProfile(currentUser?.id === idToFetch);

      const { data } = await supabase.from('users').select('*').eq('id', idToFetch).single();
      if (data) setUser(data);
    };
    fetchData();
  }, [targetUserId]);

  return (
    <div className="max-w-[480px] mx-auto min-h-screen flex flex-col relative pb-24 bg-[#0d1117] text-white">
      <div className="sticky top-0 z-50 flex items-center bg-[#0d1117]/80 backdrop-blur-md p-4 pb-2 justify-between">
        <div onClick={onBack} className="text-white flex size-12 shrink-0 items-center cursor-pointer">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center font-display">Perfil</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex items-center justify-center rounded-lg h-12 text-white transition-opacity active:opacity-50"><span className="material-symbols-outlined">more_horiz</span></button>
        </div>
      </div>

      <div className="flex p-4 flex-col items-center">
        <div className="relative mb-4">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 border-4 border-[#30363d]/50" style={{ backgroundImage: `url("${user?.avatar_url || IMAGES.avatarAlex}")` }}></div>
          <div className="absolute bottom-2 right-2 bg-[#22c55e] size-5 rounded-full border-4 border-[#0d1117]"></div>
        </div>

        <div className="flex items-center gap-1.5 mb-1">
          <p className="text-white text-[24px] font-bold text-center font-display">{user?.name || 'Usuário'}</p>
          <span className="material-symbols-outlined text-[#2188ff] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        </div>

        <p className="text-slate-400 text-sm text-center mb-3">
          {user?.location || 'São Paulo, SP'} • <span className="text-[#22c55e]">Ativo agora</span>
        </p>

        <div className="bg-[#1c2128] border border-[#30363d] rounded-full px-4 py-1.5 flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[#2188ff] text-[18px]">verified_user</span>
          <span className="text-[#2188ff] text-sm font-bold tracking-tight">Trust Score: 98%</span>
        </div>

        {isOwnProfile && (
          <div className="mb-6 flex gap-3">
            <button onClick={() => onChangeView(ViewState.EDIT_PROFILE)} className="px-6 py-2.5 bg-[#2188ff] text-white rounded-full text-sm font-bold shadow-lg shadow-blue-500/20 hover:opacity-90 transition-all">Editar Perfil</button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#21262d] text-white rounded-full text-sm font-bold border border-[#30363d] hover:bg-[#30363d] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">logout</span> Sair
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-2">
        <div className="bg-[#161b22] dark:bg-[#161b22] border border-[#30363d] rounded-2xl p-4 flex flex-col items-center gap-4">
          <p className="text-slate-400 text-sm font-medium">12 conexões em comum</p>
          <div className="flex -space-x-3">
            <div className="size-10 rounded-full ring-4 ring-[#161b22] bg-cover bg-center border border-[#30363d]" style={{ backgroundImage: `url("${IMAGES.avatar1}")` }}></div>
            <div className="size-10 rounded-full ring-4 ring-[#161b22] bg-cover bg-center border border-[#30363d]" style={{ backgroundImage: `url("${IMAGES.avatar2}")` }}></div>
            <div className="size-10 rounded-full ring-4 ring-[#161b22] bg-[#2188ff] text-white flex items-center justify-center text-xs font-bold border border-[#30363d]">+9</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-xl font-bold font-display">Notas humanas</h3>
          <span className="text-[#58a6ff] text-sm font-semibold">Ver todas</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          <div className="min-w-[280px] bg-[#161b22] p-6 rounded-2xl border border-[#30363d] flex flex-col gap-4">
            <p className="text-white text-[15px] leading-relaxed italic">"O {user?.name?.split(' ')[0] || 'Alex'} é um vizinho incrível, sempre cuidadoso com os equipamentos."</p>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${IMAGES.avatarJuliana}")` }}></div>
              <p className="text-slate-400 text-xs font-medium">Mariana L.</p>
            </div>
          </div>
          <div className="min-w-[280px] bg-[#161b22] p-6 rounded-2xl border border-[#30363d] flex flex-col gap-4">
            <p className="text-white text-[15px] leading-relaxed italic">"Negociação super transparente. Recomendo muito!"</p>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${IMAGES.avatarRicardo}")` }}></div>
              <p className="text-slate-400 text-xs font-medium">Ricardo T.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex px-4 py-3 sticky top-[64px] bg-[#0d1117]/95 backdrop-blur-sm z-40 border-y border-[#30363d]/30">
        <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#161b22] p-1.5 border border-[#30363d]">
          <button onClick={() => setTab('OFFERS')} className={`flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-sm font-bold transition-all ${tab === 'OFFERS' ? 'bg-[#21262d] shadow-sm text-[#58a6ff]' : 'text-slate-500'}`}>Ofertas</button>
          <button onClick={() => setTab('SERVICES')} className={`flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-sm font-bold transition-all ${tab === 'SERVICES' ? 'bg-[#21262d] shadow-sm text-[#58a6ff]' : 'text-slate-500'}`}>Serviços</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 pb-32">
        <div onClick={() => onChangeView(ViewState.PRODUCT_DETAIL)} className="flex flex-col gap-3 pb-3 cursor-pointer group">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#30363d] bg-[#161b22]">
            <div className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${IMAGES.itemCamera}")` }}></div>
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-2 rounded-full shadow-lg">
              <span className="material-symbols-outlined text-[18px] text-white">favorite</span>
            </div>
          </div>
          <div className="px-1">
            <p className="text-white text-base font-bold truncate">Câmera Vintage</p>
            <p className="text-[#58a6ff] text-base font-bold">R$ 450</p>
          </div>
        </div>
        <div onClick={() => onChangeView(ViewState.PRODUCT_DETAIL)} className="flex flex-col gap-3 pb-3 group cursor-pointer">
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-[#30363d] bg-[#161b22]">
            <div className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url("${IMAGES.itemBike}")` }}></div>
            <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md p-2 rounded-full">
              <span className="material-symbols-outlined text-[18px] text-white">favorite</span>
            </div>
          </div>
          <div className="px-1">
            <p className="text-white text-base font-bold truncate">Bicicleta Urbana</p>
            <p className="text-[#58a6ff] text-base font-bold">R$ 1.200</p>
          </div>
        </div>
      </div>

      {!isOwnProfile && (
        <div className="fixed bottom-28 left-0 right-0 px-6 max-w-[480px] mx-auto z-40">
          <button onClick={() => onChangeView(ViewState.CHAT)} className="w-full bg-[#2188ff] hover:bg-[#2188ff]/90 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 transition-transform active:scale-95">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span> Falar com {user?.name?.split(' ')[0] || 'Vendedor'}
          </button>
        </div>
      )}
    </div>
  )
};

const ProfessionalProfileScreen = ({ onChangeView, onBack }: { onChangeView: (view: ViewState) => void, onBack: () => void }) => (
  <div className="max-w-[480px] mx-auto min-h-screen flex flex-col relative pb-28">
    <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between">
      <div onClick={onBack} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
        <span className="material-symbols-outlined">arrow_back_ios</span>
      </div>
      <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center">Perfil Profissional</h2>
      <div className="flex w-12 items-center justify-end"><span className="material-symbols-outlined text-slate-900 dark:text-white">share</span></div>
    </div>
    <div className="flex p-4 flex-col items-center">
      <div className="relative mb-4">
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-3xl min-h-32 w-32 shadow-xl ring-4 ring-primary/10" style={{ backgroundImage: `url("${IMAGES.avatarAlex}")` }}></div>
        <div className="absolute -bottom-2 -right-2 bg-green-500 size-8 rounded-full border-4 border-background-light dark:border-background-dark flex items-center justify-center"><div className="size-2.5 bg-white rounded-full animate-pulse"></div></div>
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-1.5 mb-1"><h1 className="text-slate-900 dark:text-white text-2xl font-bold">Alex Silva</h1><span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span></div>
        <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium mb-3">Consultor de Design & Estratégia Digital</p>
        <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
          <span className="material-symbols-outlined text-primary text-[14px] mr-1" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
          <p className="text-primary text-[11px] font-bold uppercase tracking-wider">Score: 98%</p>
        </div>
      </div>
    </div>

    <div className="px-4 py-6">
      <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-4">Serviços</h3>
      <div className="flex flex-col gap-4">
        <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-2"><h4 className="text-slate-900 dark:text-white font-bold">Consultoria de UX/UI</h4><span className="text-primary font-bold text-sm">A partir de R$ 350</span></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Análise completa da interface do seu produto digital focado em conversão.</p>
          <button onClick={() => onChangeView(ViewState.SERVICE_DETAIL)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-white text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Ver detalhes do serviço</button>
        </div>
        <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-2"><h4 className="text-slate-900 dark:text-white font-bold">Design de Branding</h4><span className="text-primary font-bold text-sm">Sob consulta</span></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Criação de identidade visual, logotipo e manual de marca.</p>
          <button onClick={() => onChangeView(ViewState.SERVICE_DETAIL)} className="w-full py-2.5 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-white text-xs font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Ver detalhes do serviço</button>
        </div>
      </div>
    </div>

    <div className="fixed bottom-24 left-0 right-0 px-6 max-w-[480px] mx-auto z-50">
      <button onClick={() => onChangeView(ViewState.PROFILE_PERSONAL)} className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 border border-slate-200 dark:border-slate-700">
        Voltar para Ofertas
      </button>
    </div>
  </div>
);

const ServiceDetailScreen = ({ onChangeView, onBack }: { onChangeView: (view: ViewState) => void, onBack: () => void }) => (
  <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32">
    <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 justify-between">
      <div onClick={onBack} className="flex items-center justify-center size-10 rounded-full bg-slate-200 dark:bg-white/10 cursor-pointer text-slate-900 dark:text-white">
        <span className="material-symbols-outlined">arrow_back_ios_new</span>
      </div>
      <div className="flex gap-2">
        <button className="flex size-10 items-center justify-center rounded-full bg-slate-200 dark:bg-white/10 cursor-pointer text-slate-900 dark:text-white"><span className="material-symbols-outlined">share</span></button>
      </div>
    </div>

    <div className="px-4 pt-4">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-primary text-3xl">design_services</span>
      </div>
      <h1 className="text-slate-900 dark:text-white text-3xl font-extrabold leading-tight mb-2">Consultoria de UX/UI</h1>
      <p className="text-primary text-2xl font-bold">R$ 350,00 <span className="text-sm text-slate-500 font-normal">/ hora</span></p>
    </div>

    <div className="mx-4 mt-6 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10"><span className="material-symbols-outlined text-primary text-[20px]">verified</span></div>
        <div><p className="text-slate-900 dark:text-white text-sm font-semibold">Profissional Verificado</p><p className="text-slate-500 dark:text-white/50 text-xs">Identidade confirmada pela plataforma</p></div>
      </div>
      <div className="h-[1px] bg-slate-100 dark:bg-white/[0.05] w-full"></div>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10"><span className="material-symbols-outlined text-primary text-[20px]">workspace_premium</span></div>
        <div><p className="text-slate-900 dark:text-white text-sm font-semibold">Alta Satisfação</p><p className="text-slate-500 dark:text-white/50 text-xs">100% de avaliações positivas</p></div>
      </div>
    </div>

    <div className="px-4 mt-8">
      <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-3">Sobre o serviço</h2>
      <p className="text-slate-600 dark:text-white/70 leading-relaxed text-base">
        Faço uma análise completa da interface do seu site ou aplicativo, identificando problemas de usabilidade que podem estar afetando suas vendas ou engajamento. Entrego um relatório detalhado com sugestões de melhorias práticas.
      </p>
    </div>

    <div className="px-4 mt-8">
      <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-3">O que está incluso</h2>
      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-green-500 text-xl mt-0.5">check</span>
          <p className="text-slate-600 dark:text-white/70 text-sm">Análise heurística de até 5 telas principais</p>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-green-500 text-xl mt-0.5">check</span>
          <p className="text-slate-600 dark:text-white/70 text-sm">Relatório em PDF com prints e anotações</p>
        </li>
        <li className="flex items-start gap-3">
          <span className="material-symbols-outlined text-green-500 text-xl mt-0.5">check</span>
          <p className="text-slate-600 dark:text-white/70 text-sm">Call de 30min para apresentação dos resultados</p>
        </li>
      </ul>
    </div>

    <div className="fixed bottom-0 left-0 right-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.05] p-4 pb-8 flex items-center gap-4">
      <button onClick={() => onChangeView(ViewState.CHAT)} className="flex-1 h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"><span className="material-symbols-outlined">forum</span>Conversar com Alex</button>
    </div>
  </div>
);

const ProductDetailScreen = ({ onChangeView, onBack }: { onChangeView: (view: ViewState) => void, onBack: () => void }) => (
  <div className="bg-background-light dark:bg-background-dark text-white font-display min-h-screen pb-32">
    <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 justify-between">
      <div onClick={onBack} className="flex items-center justify-center size-10 rounded-full bg-white/10 cursor-pointer text-slate-900 dark:text-white">
        <span className="material-symbols-outlined">arrow_back_ios_new</span>
      </div>
      <div className="flex gap-2">
        <button className="flex size-10 items-center justify-center rounded-full bg-white/10 cursor-pointer text-slate-900 dark:text-white"><span className="material-symbols-outlined">favorite</span></button>
        <button className="flex size-10 items-center justify-center rounded-full bg-white/10 cursor-pointer text-slate-900 dark:text-white"><span className="material-symbols-outlined">share</span></button>
      </div>
    </div>
    <div className="@container">
      <div className="@[480px]:px-4 @[480px]:py-3">
        <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-zinc-800 @[480px]:rounded-xl min-h-[400px] relative" style={{ backgroundImage: `linear-gradient(0deg, rgba(16, 25, 34, 0.8) 0%, rgba(16, 25, 34, 0) 40%), url("${IMAGES.itemBike}")` }}>
          <div className="flex justify-center gap-2 p-5">
            <div className="size-1.5 rounded-full bg-white"></div><div className="size-1.5 rounded-full bg-white/40"></div><div className="size-1.5 rounded-full bg-white/40"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="px-4 pt-6">
      <div className="flex gap-2 mb-3">
        <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/20 px-3"><p className="text-primary text-xs font-bold uppercase tracking-wider">Esportes</p></div>
        <div className="flex h-7 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-white/10 px-3"><p className="text-slate-500 dark:text-white/70 text-xs font-bold uppercase tracking-wider">Usado - Excelente</p></div>
      </div>
      <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-extrabold leading-tight">Bicicleta Mountain Bike Specialized 2023</h1>
      <p className="text-2xl font-bold mt-2 text-primary">R$ 4.850,00</p>
    </div>
    <div className="mx-4 mt-6 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10"><span className="material-symbols-outlined text-primary text-[20px]">group</span></div>
        <div><p className="text-slate-900 dark:text-white text-sm font-semibold">Compartilhado por alguém da sua rede</p><p className="text-slate-500 dark:text-white/50 text-xs">Vendedor verificado por contatos mútuos</p></div>
      </div>
      <div className="h-[1px] bg-slate-100 dark:bg-white/[0.05] w-full"></div>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10"><span className="material-symbols-outlined text-primary text-[20px]">chat_bubble</span></div>
        <div><p className="text-slate-900 dark:text-white text-sm font-semibold">Contato direto com o vendedor</p><p className="text-slate-500 dark:text-white/50 text-xs">Sem intermediários ou taxas de serviço</p></div>
      </div>
    </div>
    <div className="px-4 mt-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-full bg-cover bg-center border-2 border-primary/20" style={{ backgroundImage: `url('${IMAGES.avatarRicardo}')` }}></div>
        <div><p className="text-slate-900 dark:text-white font-bold text-base leading-tight">Ricardo Mendes</p><p className="text-slate-500 dark:text-white/50 text-xs mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px] text-green-500">verified</span> Na rede desde 2021</p></div>
      </div>
      <div className="text-primary text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-lg">Ver perfil</div>
    </div>
    <div className="px-4 mt-8">
      <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-3">Descrição</h2>
      <p className="text-slate-600 dark:text-white/70 leading-relaxed text-base">Mountain bike em estado de nova, pouco uso. Revisada recentemente em oficina autorizada. Quadro em alumínio leve, câmbio Shimano Deore 12v e suspensão RockShox.</p>
    </div>
    <div className="px-4 mt-8">
      <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-3">Localização</h2>
      <div className="h-40 w-full rounded-xl overflow-hidden relative group cursor-pointer">
        <div className="absolute inset-0 bg-cover bg-center grayscale opacity-60" style={{ backgroundImage: `url('${IMAGES.itemMap}')` }}></div>
        <div className="absolute inset-0 flex items-center justify-center bg-background-dark/20"><div className="bg-white px-4 py-2 rounded-lg text-background-dark font-bold text-sm shadow-xl flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">location_on</span>Pinheiros, São Paulo</div></div>
      </div>
    </div>
    <div className="fixed bottom-0 left-0 right-0 bg-background-light/80 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/[0.05] p-4 pb-8 flex items-center gap-4">
      <div className="flex flex-col"><span className="text-slate-500 dark:text-white/50 text-[10px] uppercase font-bold tracking-widest">Preço final</span><span className="text-slate-900 dark:text-white font-extrabold text-xl">R$ 4.850</span></div>
      <button onClick={() => onChangeView(ViewState.CHAT)} className="flex-1 h-14 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-primary/20"><span className="material-symbols-outlined">forum</span>Conversar com Ricardo</button>
    </div>
  </div>
);

const VisibilityScreen = ({ onConfirm, onBack }: { onConfirm: () => void, onBack: () => void }) => {
  const [shared, setShared] = useState(true);
  return (
    <div className="relative flex h-full min-h-screen w-full max-w-md flex-col bg-background-light dark:bg-background-dark border-x border-gray-800 mx-auto">
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <div onClick={onBack} className="text-gray-900 dark:text-white flex size-12 shrink-0 items-center cursor-pointer"><span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back_ios</span></div>
        <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-12">Visibilidade da Rede</h2>
      </header>
      <main className="flex-1 flex flex-col pt-4">
        <div className="px-4 mb-4">
          <div className="bg-primary/10 rounded-xl p-4 flex gap-3 items-start">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>lock</span>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-snug">Seu anúncio será visível apenas para seus contatos diretos e pessoas de confiança na sua rede.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-[72px] py-2 justify-between border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="text-white flex items-center justify-center rounded-lg bg-primary shrink-0 size-12"><span className="material-symbols-outlined" style={{ fontSize: '24px' }}>group</span></div>
            <div className="flex flex-col justify-center"><p className="text-gray-900 dark:text-white text-base font-semibold">Compartilhar com minha rede</p><p className="text-gray-500 dark:text-[#9dabb9] text-sm font-normal">Seus contatos confiáveis poderão ver seu anúncio</p></div>
          </div>
          <div className="shrink-0">
            <label className={`relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none p-0.5 transition-all ${shared ? 'bg-primary justify-end' : 'bg-gray-300 dark:bg-[#283039] justify-start'}`}>
              <div className="h-full w-[27px] rounded-full bg-white shadow-md"></div>
              <input type="checkbox" checked={shared} onChange={() => setShared(!shared)} className="invisible absolute" />
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-4 py-6">
          <label className="flex flex-col min-w-40 flex-1">
            <div className="flex justify-between items-center pb-2"><p className="text-gray-900 dark:text-white text-base font-medium">Nota opcional</p><span className="text-xs text-gray-500">Opcional</span></div>
            <textarea className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] min-h-32 placeholder:text-gray-400 dark:placeholder:text-[#9dabb9] p-[15px] text-base" placeholder="Ex: Negocie direto comigo ou peça um desconto!"></textarea>
          </label>
        </div>
        <div className="mt-auto pb-6">
          <div className="flex items-center justify-center gap-2 px-4 pb-3 pt-1 text-center"><span className="material-symbols-outlined text-gray-400" style={{ fontSize: '16px' }}>info</span><p className="text-gray-500 dark:text-gray-400 text-sm font-normal">Nada será enviado. Sua rede verá se quiser.</p></div>
          <div className="flex px-4 py-3">
            <button onClick={onConfirm} className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-base font-bold shadow-lg active:scale-[0.98] transition-transform">Confirmar</button>
          </div>
        </div>
      </main>
    </div>
  )
};

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

const NotificationsScreen = ({ onChangeView }: { onChangeView: (view: ViewState) => void }) => (
  <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-24">
    <div className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800 justify-between">
      <h2 className="text-slate-900 dark:text-white text-2xl font-bold leading-tight">Avisos</h2>
      <div className="flex items-center justify-end">
        <button onClick={() => onChangeView(ViewState.SETTINGS)} className="flex items-center justify-center rounded-full size-10 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition-colors">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-2">Hoje</p>

        <div className="flex gap-4 p-3 bg-white dark:bg-[#1c2127] rounded-xl mb-3 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">favorite</span>
          </div>
          <div className="flex-1">
            <p className="text-slate-900 dark:text-white text-sm"><span className="font-bold">Ricardo Mendes</span> curtiu seu item <span className="font-bold">Monitor Gamer 27"</span></p>
            <p className="text-slate-500 text-xs mt-1">2 horas atrás</p>
          </div>
        </div>

        <div className="flex gap-4 p-3 bg-white dark:bg-[#1c2127] rounded-xl mb-3 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="size-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-green-500 text-xl">price_check</span>
          </div>
          <div className="flex-1">
            <p className="text-slate-900 dark:text-white text-sm">O preço de <span className="font-bold">Cadeira Herman Miller</span> caiu 10%</p>
            <p className="text-slate-500 text-xs mt-1">5 horas atrás</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ontem</p>

        <div className="flex gap-4 p-3 bg-white dark:bg-[#1c2127] rounded-xl mb-3 shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-300 text-xl">person_add</span>
          </div>
          <div className="flex-1">
            <p className="text-slate-900 dark:text-white text-sm"><span className="font-bold">Ana Silva</span> entrou no TrustCircle através da sua agenda.</p>
            <p className="text-slate-500 text-xs mt-1">Ontem às 14:30</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SettingsScreen = ({ onChangeView }: { onChangeView: (view: ViewState) => void }) => (
  <div className="max-w-md mx-auto min-h-screen flex flex-col bg-background-light dark:bg-background-dark pb-24">
    <header className="sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center p-4 pb-4 justify-between">
        <div onClick={() => onChangeView(ViewState.NOTIFICATIONS)} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><span className="material-symbols-outlined">arrow_back_ios_new</span></div>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight flex-1 text-center pr-10">Configurações e Privacidade</h2>
      </div>
    </header>
    <main className="flex-1 overflow-y-auto">
      <section className="mt-2">
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider px-6 pt-6 pb-2">Rede de Confiança</h3>
        <div onClick={() => onChangeView(ViewState.CONTACTS)} className="flex items-center gap-4 bg-white dark:bg-[#1a242e] mx-4 rounded-xl px-4 min-h-[72px] py-2 justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-[#222d39] transition-colors mb-2">
          <div className="flex items-center gap-4">
            <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12"><span className="material-symbols-outlined">group</span></div>
            <div className="flex flex-col justify-center"><p className="text-slate-900 dark:text-white text-base font-semibold">Contatos sincronizados</p><p className="text-slate-500 dark:text-slate-400 text-sm font-normal">Sincronize para encontrar amigos para negociar</p></div>
          </div>
          <div className="shrink-0"><div className="text-slate-400 flex size-7 items-center justify-center"><span className="material-symbols-outlined">chevron_right</span></div></div>
        </div>
      </section>
      <section>
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider px-6 pt-4 pb-2">Preferências</h3>
        <div className="flex items-center gap-4 bg-white dark:bg-[#1a242e] mx-4 rounded-xl px-4 min-h-[72px] py-2 justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12"><span className="material-symbols-outlined">notifications</span></div>
            <div className="flex flex-col justify-center"><p className="text-slate-900 dark:text-white text-base font-semibold">Notificações</p><p className="text-slate-500 dark:text-slate-400 text-sm font-normal">Atualmente desativado</p></div>
          </div>
          <div className="shrink-0">
            <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-slate-200 dark:bg-slate-700 p-0.5 transition-colors has-[:checked]:bg-primary">
              <input className="sr-only peer" type="checkbox" />
              <div className="h-full w-[27px] rounded-full bg-white shadow-md transition-all peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>
      </section>
      <div className="p-8 text-center space-y-4">
        <div className="flex flex-col items-center justify-center gap-1 opacity-40">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="text-red-500 font-bold text-sm uppercase tracking-wider mb-4 hover:opacity-80 transition-opacity"
          >
            Sair da Conta
          </button>
          <p className="text-xs uppercase tracking-[0.2em] font-bold">Trust Marketplace</p>
          <p className="text-xs">Versão 1.0.42 (Produção)</p>
        </div>
      </div>
    </main>
  </div>
);

const BottomNav = ({ activeView, onChangeView, userAvatar }: { activeView: ViewState, onChangeView: (view: ViewState) => void, userAvatar: string | null }) => {
  // Only show nav on certain screens
  const showNav = [ViewState.HOME, ViewState.MARKETPLACE, ViewState.MY_ITEMS, ViewState.SETTINGS, ViewState.PROFILE_PERSONAL, ViewState.CHAT_LIST, ViewState.NOTIFICATIONS, ViewState.CONTACTS, ViewState.SEARCH].includes(activeView);
  if (!showNav) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#161b22]/95 backdrop-blur-xl border-t border-[#30363d] pb-8 pt-2 px-4 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center relative gap-0">
        <button onClick={() => onChangeView(ViewState.HOME)} className={`flex flex-col items-center gap-1 w-1/5 transition-colors ${activeView === ViewState.HOME ? 'text-[#58a6ff]' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: activeView === ViewState.HOME ? "'FILL' 1" : "'FILL' 0" }}>person_search</span>
          <span className="text-[10px] font-bold">Descobrir</span>
        </button>

        <button onClick={() => onChangeView(ViewState.MARKETPLACE)} className={`flex flex-col items-center gap-1 w-1/5 transition-colors ${activeView === ViewState.MARKETPLACE ? 'text-[#58a6ff]' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: activeView === ViewState.MARKETPLACE ? "'FILL' 1" : "'FILL' 0" }}>shopping_bag</span>
          <span className="text-[10px] font-bold">Marketplace</span>
        </button>

        {/* Prominent Add Button */}
        <div className="w-1/5 flex justify-center -mt-10">
          <button onClick={() => onChangeView(ViewState.VISIBILITY)} className="bg-[#2188ff] text-white size-14 rounded-full shadow-lg shadow-blue-500/20 flex items-center justify-center border-4 border-[#0d1117] transition-transform active:scale-95 z-20">
            <span className="material-symbols-outlined text-[32px]">add</span>
          </button>
        </div>

        <button onClick={() => onChangeView(ViewState.CHAT_LIST)} className={`flex flex-col items-center gap-1 w-1/5 transition-colors ${[ViewState.CHAT_LIST, ViewState.CHAT].includes(activeView) ? 'text-[#58a6ff]' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: [ViewState.CHAT_LIST, ViewState.CHAT].includes(activeView) ? "'FILL' 1" : "'FILL' 0" }}>chat_bubble</span>
          <span className="text-[10px] font-bold">Mensagens</span>
        </button>

        <button onClick={() => onChangeView(ViewState.NOTIFICATIONS)} className={`flex flex-col items-center gap-1 w-1/5 transition-colors ${activeView === ViewState.NOTIFICATIONS ? 'text-[#58a6ff]' : 'text-slate-500'}`}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', fontVariationSettings: activeView === ViewState.NOTIFICATIONS ? "'FILL' 1" : "'FILL' 0" }}>notifications</span>
          <span className="text-[10px] font-bold">Avisos</span>
        </button>
      </div>
    </nav>
  );
};

// --- Main App Component ---



// ... existing imports ...

const ForgotPasswordScreen = ({ onBack, onSent }: { onBack: () => void, onSent: () => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6 justify-center items-center text-center">
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6">
          <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">E-mail Enviado!</h2>
        <p className="text-slate-500 mb-8 max-w-xs">Verifique sua caixa de entrada. Enviamos um link para você redefinir sua senha.</p>
        <button onClick={onBack} className="text-primary font-bold hover:underline">Voltar para o Login</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <button onClick={onBack} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Recuperar Senha</h2>
        <p className="text-slate-500 mb-8">Digite seu e-mail para receber as instruções.</p>

        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Enviando...' : 'Enviar Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

const UpdatePasswordScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6 justify-center">
      <div className="max-w-sm mx-auto w-full">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Nova Senha</h2>
        <p className="text-slate-500 mb-8">Digite sua nova senha abaixo.</p>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nova Senha</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Atualizando...' : 'Definir Senha'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AuthScreen = ({ onLogin, onCompleteProfile, onForgotPassword }: { onLogin: () => void, onCompleteProfile: () => void, onForgotPassword: () => void }) => {
  const [step, setStep] = useState<'check_email' | 'password' | 'magic_link'>('check_email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Check if user exists in public profile using Secure RPC
      const { data: exists, error } = await supabase.rpc('check_user_exists', { email_arg: email });

      if (error) throw error;

      if (exists) {
        // User exists -> Show password screen
        setStep('password');
      } else {
        // New User (or not yet in public table) -> Send Magic Link
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (otpError) throw otpError;
        setStep('magic_link');
      }
    } catch (err: any) {
      console.error('Check email error:', err);
      const isRateLimit = err.message?.includes('rate limit') || err.message?.includes('429') || err.status === 429;
      if (isRateLimit) {
        setMessage('Muitas tentativas. Aguarde 60 segundos antes de tentar novamente.');
      } else {
        setMessage(err.message || 'Erro ao verificar e-mail');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      onLogin();
    } catch (err: any) {
      setMessage('Senha incorreta ou erro no login.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'magic_link') {
    return (
      <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6 justify-center items-center text-center">
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full mb-6">
          <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">mail</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verifique seu E-mail</h2>
        <p className="text-slate-500 mb-8 max-w-xs">
          Enviamos um link de validação para <strong>{email}</strong>.
          <br /><br />
          Clique no link para acessar e concluir seu cadastro.
        </p>
        <button onClick={() => setStep('check_email')} className="text-primary font-bold hover:underline">Voltar</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-primary mb-2 tracking-tighter">trustcircle</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {step === 'password' ? 'Digite sua senha.' : 'Acesse sua conta para continuar.'}
          </p>
        </div>

        {step === 'check_email' && (
          <form onSubmit={handleCheckEmail} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail</label>
              <input
                type="email"
                required
                autoFocus
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            {message && <p className="text-red-500 text-sm text-center">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-6">
            <div className="text-left">
              <button
                type="button"
                onClick={() => setStep('check_email')}
                className="text-xs text-primary mb-4 flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                Não é {email}?
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                <button type="button" onClick={onForgotPassword} className="text-xs text-primary hover:underline">
                  Esqueceu?
                </button>
              </div>
              <input
                type="password"
                required
                autoFocus
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white dark:bg-[#1c2127] dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary border-slate-100"
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {message && (
              <div className="p-3 rounded-lg text-sm bg-red-50 text-red-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? 'Entrar' : 'Entrar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};


// --- App ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME); // Start at HOME
  const [session, setSession] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const checkProfile = async (currentSession: any) => {
    if (!currentSession?.user) {
      setHasProfile(false);
      setIsLoadingProfile(false);
      return;
    }

    try {
      const { data } = await supabase.from('users').select('id, name, avatar_url').eq('id', currentSession.user.id).single();
      const exists = !!(data && data.name);
      setHasProfile(exists);
      if (data) {
        setUserAvatar(data.avatar_url);
      }
    } catch (error) {
      console.error("Profile check error:", error);
      setHasProfile(false);
    } finally {
      setIsLoadingProfile(false);
    }
  };


  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkProfile(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);

      if (event === 'PASSWORD_RECOVERY') {
        setView(ViewState.UPDATE_PASSWORD);
      } else if (session) {
        checkProfile(session);
        // Only redirect to Home if coming from Auth views
        setView(v => [ViewState.AUTH, ViewState.WELCOME, ViewState.FORGOT_PASSWORD].includes(v) ? ViewState.HOME : v);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleViewChange = (targetView: ViewState) => {
    const protectedRoutes = [
      ViewState.HOME, ViewState.MARKETPLACE, ViewState.PROFILE_PERSONAL, ViewState.PROFILE_PROFESSIONAL,
      ViewState.MY_ITEMS, ViewState.CHAT_LIST, ViewState.CHAT, ViewState.SETTINGS,
      ViewState.NOTIFICATIONS, ViewState.CONTACTS, ViewState.SEARCH, ViewState.EDIT_PROFILE,
      ViewState.VISIBILITY
    ];

    if (protectedRoutes.includes(targetView)) {
      if (!session) {
        setView(ViewState.AUTH);
        return;
      }
      if (!isLoadingProfile && !hasProfile) {
        setView(ViewState.COMPLETE_PROFILE);
        return;
      }
    }

    if (targetView === ViewState.PROFILE_PERSONAL) {
      setSelectedUserId(null);
    } else if ([ViewState.HOME, ViewState.MARKETPLACE, ViewState.MY_ITEMS, ViewState.CHAT_LIST, ViewState.NOTIFICATIONS, ViewState.SEARCH].includes(targetView)) {
      setSelectedUserId(null);
    }

    setView(targetView);
  };

  const renderView = () => {
    switch (view) {
      case ViewState.WELCOME:
        return <WelcomeScreen onStart={() => setView(ViewState.PRIVACY)} onLogin={() => setView(ViewState.AUTH)} />;
      case ViewState.AUTH:
        return <AuthScreen
          onLogin={() => {
            checkProfile(session).then(() => setView(ViewState.HOME));
          }}
          onCompleteProfile={() => setView(ViewState.COMPLETE_PROFILE)}
          onForgotPassword={() => setView(ViewState.FORGOT_PASSWORD)}
        />;
      case ViewState.FORGOT_PASSWORD:
        return <ForgotPasswordScreen onBack={() => setView(ViewState.AUTH)} onSent={() => { }} />;
      case ViewState.UPDATE_PASSWORD:
        return <UpdatePasswordScreen onComplete={() => setView(ViewState.HOME)} />;
      case ViewState.COMPLETE_PROFILE:
        return <EditProfileScreen isInitialSetup={true} onBack={() => {
          setHasProfile(true);
          setView(ViewState.HOME);
        }} />;
      case ViewState.PRIVACY:
        return <PrivacyScreen onSync={() => setView(ViewState.HOME)} onBack={() => setView(ViewState.WELCOME)} />;
      case ViewState.HOME:
        return <HomeScreen
          onChangeView={handleViewChange}
          onSelectUser={(id) => { setSelectedUserId(id); setView(ViewState.PROFILE_PERSONAL); }}
          userAvatar={userAvatar}
        />;
      case ViewState.MARKETPLACE:
        return <MarketplaceScreen
          onChangeView={handleViewChange}
          onSelectUser={(id) => { setSelectedUserId(id); setView(ViewState.PROFILE_PERSONAL); }}
        />;
      case ViewState.PROFILE_PERSONAL:
        return <UserProfileScreen
          onChangeView={handleViewChange}
          onBack={() => setView(ViewState.HOME)}
          targetUserId={selectedUserId}
        />;
      case ViewState.PROFILE_PROFESSIONAL:
        return <ProfessionalProfileScreen onChangeView={handleViewChange} onBack={() => setView(ViewState.PROFILE_PERSONAL)} />;
      case ViewState.SERVICE_DETAIL:
        return <ServiceDetailScreen onChangeView={handleViewChange} onBack={() => setView(ViewState.PROFILE_PROFESSIONAL)} />;
      case ViewState.PRODUCT_DETAIL:
        return <ProductDetailScreen onChangeView={handleViewChange} onBack={() => setView(ViewState.PROFILE_PERSONAL)} />;
      case ViewState.VISIBILITY:
        return <VisibilityScreen onConfirm={() => setView(ViewState.MY_ITEMS)} onBack={() => setView(ViewState.HOME)} />;
      case ViewState.CHAT:
        return <ChatScreen onBack={() => setView(ViewState.CHAT_LIST)} />;
      case ViewState.CHAT_LIST:
        return <ChatListScreen onChangeView={handleViewChange} onBack={() => setView(ViewState.HOME)} />;
      case ViewState.MY_ITEMS:
        return <MyItemsScreen onChangeView={handleViewChange} />;
      case ViewState.SETTINGS:
        return <SettingsScreen onChangeView={handleViewChange} />;
      case ViewState.NOTIFICATIONS:
        return <NotificationsScreen onChangeView={handleViewChange} />;
      case ViewState.SEARCH:
        return <SearchScreen onBack={() => setView(ViewState.HOME)} />;
      case ViewState.CONTACTS:
        return <ContactsScreen onBack={() => setView(ViewState.CHAT_LIST)} onChat={() => setView(ViewState.CHAT)} />;
      case ViewState.EDIT_PROFILE:
        return <EditProfileScreen onBack={() => {
          // Reload user data slightly
          checkProfile(session);
          setView(ViewState.PROFILE_PERSONAL);
        }} />;
      default:
        return <HomeScreen
          onChangeView={handleViewChange}
          onSelectUser={(id) => { setSelectedUserId(id); setView(ViewState.PROFILE_PERSONAL); }}
          userAvatar={userAvatar}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white transition-colors duration-300">
      {renderView()}
      <BottomNav activeView={view} onChangeView={handleViewChange} userAvatar={userAvatar} />
    </div>
  );
};

export default App;
