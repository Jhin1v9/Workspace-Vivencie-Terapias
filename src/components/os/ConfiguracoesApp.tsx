import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Palette, 
  User, 
  Type, 
  Download, 
  Upload, 
  Trash2,
  AlertTriangle,
  Check,
  Image,
  Maximize,
  Minimize,
  Grid3X3,
  LayoutGrid,
  Droplets,
  Bot,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  WifiOff,
  XCircle
} from 'lucide-react';
import { useConfigStore, usePacientesStore } from '@/stores';
import type { ConfiguracaoSistema } from '@/types';

type WallpaperMode = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
type IconBgStyle = 'glass' | 'solid' | 'gradient' | 'adaptive';
type AIProvider = ConfiguracaoSistema['ai_provider'];

const wallpapers: { id: ConfiguracaoSistema['wallpaper_atual']; nome: string; descricao: string }[] = [
  { id: 'akasha', nome: 'Akasha', descricao: 'Gradiente etéreo com partículas douradas' },
  { id: 'floresta', nome: 'Floresta Zen', descricao: 'Tons de verde com névoa suave' },
  { id: 'agua', nome: 'Waters', descricao: 'Ondas escuras com reflexos prateados' },
  { id: 'terra', nome: 'Terra', descricao: 'Tons de terracota e pedra' },
  { id: 'cosmos', nome: 'Cosmos', descricao: 'Estrelas distantes e nebulosas' },
  { id: 'clinico', nome: 'Clínico', descricao: 'Branco limpo para neutralidade' },
];

const wallpaperModes: { id: WallpaperMode; nome: string; icone: React.ElementType; descricao: string }[] = [
  { id: 'cover', nome: 'Cobrir', icone: Maximize, descricao: 'Preenche toda a tela, pode cortar partes' },
  { id: 'contain', nome: 'Contido', icone: Minimize, descricao: 'Mostra imagem completa, pode ter bordas' },
  { id: 'stretch', nome: 'Esticar', icone: Maximize, descricao: 'Estica para caber na tela' },
  { id: 'repeat', nome: 'Repetir', icone: Grid3X3, descricao: 'Repete a imagem em mosaico' },
  { id: 'center', nome: 'Centro', icone: Image, descricao: 'Centraliza sem redimensionar' },
];

const fontes = [
  { id: 'sans', nome: 'Moderno (Sans)', descricao: 'Fonte limpa e moderna' },
  { id: 'serif', nome: 'Clássico (Serif)', descricao: 'Fonte elegante com serifa' },
  { id: 'mono', nome: 'Técnico (Mono)', descricao: 'Fonte monoespaçada' },
];

export const ConfiguracoesApp: React.FC = () => {
  const { 
    terapeuta_nome, 
    setNomeTerapeuta,
    modo_reiki_ativo,
    toggleModoReiki,
    wallpaper_atual,
    setWallpaper,
    fonte_sistema,
    setFonteSistema,
    resetarDados,
    ai_provider,
    openai_api_key,
    openai_tested,
    openai_last_error,
    deepseek_api_key,
    deepseek_tested,
    deepseek_last_error,
    gemini_api_key,
    gemini_model,
    gemini_tested,
    gemini_last_error,
    setAIProvider,
    setOpenAIKey,
    setDeepSeekKey,
    setGeminiKey,
    setGeminiModel,
    testAIConnection,
    normalizeGeminiConfig,
    resetGeminiConfig
  } = useConfigStore();
  
  const { exportarDados, importarDados } = usePacientesStore();
  
  const [showReikiConfirm, setShowReikiConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [testingProvider, setTestingProvider] = useState<Exclude<AIProvider, 'none'> | null>(null);
  
  // Wallpaper personalizado
  const [wallpaperPersonalizado, setWallpaperPersonalizado] = useState<string | null>(null);
  const [wallpaperMode, setWallpaperMode] = useState<WallpaperMode>('cover');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estilo de fundo dos ícones
  const [iconBgStyle, setIconBgStyle] = useState<IconBgStyle>('adaptive');
  const iconStyles: { id: IconBgStyle; nome: string; descricao: string }[] = [
    { id: 'adaptive', nome: 'Adaptativo', descricao: 'Fundo escuro semi-transparente que funciona em qualquer wallpaper' },
    { id: 'glass', nome: 'Glassmorphism', descricao: 'Efeito de vidro fosco elegante' },
    { id: 'solid', nome: 'Sólido', descricao: 'Fundo escuro opaco para máximo contraste' },
    { id: 'gradient', nome: 'Gradiente', descricao: 'Degradê suave entre tons escuros' },
  ];

  // Carregar configurações do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('auris-wallpaper-custom');
    const mode = localStorage.getItem('auris-wallpaper-mode') as WallpaperMode;
    const savedIconStyle = localStorage.getItem('auris-icon-bg-style') as IconBgStyle;
    if (saved) setWallpaperPersonalizado(saved);
    if (mode) setWallpaperMode(mode);
    if (savedIconStyle) setIconBgStyle(savedIconStyle);
  }, []);

  useEffect(() => {
    normalizeGeminiConfig();
  }, [normalizeGeminiConfig]);

  // Aplicar fonte quando mudar
  useEffect(() => {
    const root = document.documentElement;
    if (fonte_sistema === 'serif') {
      root.style.setProperty('--font-family', 'Georgia, "Times New Roman", serif');
    } else if (fonte_sistema === 'mono') {
      root.style.setProperty('--font-family', '"Fira Code", "Consolas", monospace');
    } else {
      root.style.setProperty('--font-family', 'Inter, system-ui, sans-serif');
    }
  }, [fonte_sistema]);

  const handleExport = () => {
    const dados = exportarDados();
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auris-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        importarDados(json);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (error) {
        setImportError('Erro ao importar dados. Verifique o arquivo.');
        setTimeout(() => setImportError(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    resetarDados();
    setShowResetConfirm(false);
  };

  const handleTestAI = async (provider: Exclude<AIProvider, 'none'>) => {
    setTestingProvider(provider);
    await testAIConnection(provider);
    setTestingProvider(null);
  };

  // Wallpaper personalizado handlers - permite trocar mesmo com um já salvo
  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setWallpaperPersonalizado(imageUrl);
        localStorage.setItem('auris-wallpaper-custom', imageUrl);
        // Sempre define como custom quando fizer upload, independente do estado anterior
        setWallpaper('custom' as any);
      };
      reader.readAsDataURL(file);
    }
  };

  // Troca de wallpaper custom - permite selecionar novo mesmo com um já salvo
  const handleTrocarWallpaperCustom = () => {
    // Limpa o input para permitir selecionar o mesmo arquivo novamente se necessário
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    fileInputRef.current?.click();
  };

  const handleModeChange = (mode: WallpaperMode) => {
    setWallpaperMode(mode);
    localStorage.setItem('auris-wallpaper-mode', mode);
  };
  
  const handleIconStyleChange = (style: IconBgStyle) => {
    setIconBgStyle(style);
    localStorage.setItem('auris-icon-bg-style', style);
    // Disparar evento para atualizar o desktop
    window.dispatchEvent(new StorageEvent('storage', { key: 'auris-icon-bg-style' }));
  };

  const removerWallpaperPersonalizado = () => {
    setWallpaperPersonalizado(null);
    localStorage.removeItem('auris-wallpaper-custom');
    setWallpaper('akasha');
  };

  const getWallpaperStyle = () => {
    if (!wallpaperPersonalizado) return {};
    
    const baseStyle = {
      backgroundImage: `url(${wallpaperPersonalizado})`,
      backgroundPosition: 'center',
    };
    
    switch (wallpaperMode) {
      case 'cover':
        return { ...baseStyle, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' };
      case 'contain':
        return { ...baseStyle, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' };
      case 'stretch':
        return { ...baseStyle, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' };
      case 'repeat':
        return { ...baseStyle, backgroundSize: 'auto', backgroundRepeat: 'repeat' };
      case 'center':
        return { ...baseStyle, backgroundSize: 'auto', backgroundRepeat: 'no-repeat' };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-auris-sage" />
          <h2 className="text-2xl font-display text-white">Configurações</h2>
        </div>

        {/* Terapeuta */}
        <div className="card-glass">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-auris-indigo" />
            <h3 className="text-lg font-medium text-white">Terapeuta</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Nome do Terapeuta</label>
              <input
                type="text"
                value={terapeuta_nome}
                onChange={(e) => setNomeTerapeuta(e.target.value)}
                placeholder="Seu nome"
                className="input-glass w-full"
              />
            </div>
          </div>
        </div>

        {/* Wallpaper Section */}
        <div className="card-glass">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-auris-amber" />
            <h3 className="text-lg font-medium text-white">Ambiente Visual</h3>
          </div>
          
          {/* Wallpaper Personalizado */}
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleWallpaperUpload}
              className="hidden"
            />
            
            {/* Upload Area - sempre visível para permitir troca */}
            <motion.button
              onClick={handleTrocarWallpaperCustom}
              className={`w-full p-6 rounded-xl border-2 border-dashed transition-all flex flex-col items-center gap-2 ${
                wallpaperPersonalizado 
                  ? 'border-auris-sage/40 hover:border-auris-sage bg-auris-sage/5' 
                  : 'border-white/20 hover:border-auris-sage/50 hover:bg-auris-sage/5'
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Image className={`w-8 h-8 ${wallpaperPersonalizado ? 'text-auris-sage' : 'text-white/40'}`} />
              <p className="text-white/70">
                {wallpaperPersonalizado ? 'Clique para trocar wallpaper personalizado' : 'Clique para adicionar wallpaper personalizado'}
              </p>
              <p className="text-white/40 text-xs">JPG, PNG, WEBP (máx. 5MB)</p>
            </motion.button>
            
            {/* Preview do wallpaper atual */}
            {wallpaperPersonalizado && (
              <div className="space-y-3 mt-4">
                {/* Preview */}
                <div 
                  className="relative h-32 rounded-xl overflow-hidden border border-white/20"
                  style={getWallpaperStyle()}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-white text-sm font-medium flex items-center gap-2">
                      <Check className="w-4 h-4 text-auris-sage" />
                      Wallpaper Personalizado Ativo
                    </span>
                    <button
                      onClick={removerWallpaperPersonalizado}
                      className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white"
                      title="Remover wallpaper personalizado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Modos de exibição */}
                <div>
                  <p className="text-white/60 text-sm mb-2">Modo de exibição:</p>
                  <div className="flex flex-wrap gap-2">
                    {wallpaperModes.map((mode) => {
                      const Icone = mode.icone;
                      return (
                        <motion.button
                          key={mode.id}
                          onClick={() => handleModeChange(mode.id)}
                          className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-all ${
                            wallpaperMode === mode.id
                              ? 'bg-auris-sage/30 text-auris-sage border border-auris-sage/50'
                              : 'bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                          whileTap={{ scale: 0.95 }}
                          title={mode.descricao}
                        >
                          <Icone className="w-4 h-4" />
                          {mode.nome}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <p className="text-white/60 text-sm mb-3">Wallpapers predefinidos:</p>
            <div className="grid grid-cols-2 gap-3">
              {wallpapers.map((wp) => (
                <motion.button
                  key={wp.id}
                  className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                    wallpaper_atual === wp.id && !wallpaperPersonalizado
                      ? 'bg-auris-sage/20 border-auris-sage'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => {
                    setWallpaper(wp.id);
                    if (wallpaperPersonalizado) {
                      removerWallpaperPersonalizado();
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="font-medium text-white">{wp.nome}</p>
                  <p className="text-xs text-white/60">{wp.descricao}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Estilo dos Ícones do Desktop */}
        <div className="card-glass">
          <div className="flex items-center gap-3 mb-4">
            <LayoutGrid className="w-5 h-5 text-auris-teal" />
            <h3 className="text-lg font-medium text-white">Ícones do Desktop</h3>
          </div>
          
          <p className="text-white/60 text-sm mb-4">
            Escolha o estilo de fundo dos ícones para melhor visibilidade em qualquer wallpaper.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {iconStyles.map((style) => (
              <motion.button
                key={style.id}
                className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                  iconBgStyle === style.id
                    ? 'bg-auris-teal/20 border-auris-teal'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => handleIconStyleChange(style.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="font-medium text-white">{style.nome}</p>
                <p className="text-xs text-white/60">{style.descricao}</p>
              </motion.button>
            ))}
          </div>
          
          {/* Preview */}
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/60 text-sm mb-3">Preview:</p>
            <div className="flex items-center gap-4">
              <div 
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                  iconBgStyle === 'glass' 
                    ? 'bg-white/20 backdrop-blur-xl border border-white/30' 
                    : iconBgStyle === 'solid'
                    ? 'bg-slate-900 border border-white/20'
                    : iconBgStyle === 'gradient'
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-white/20'
                    : 'bg-slate-900/60 backdrop-blur-sm border border-white/20'
                }`}
              >
                <Droplets className="w-8 h-8 text-auris-sage" />
              </div>
              <div className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                iconBgStyle === 'adaptive' ? 'bg-slate-900/80 text-white' : 'bg-slate-900 text-white'
              }`}>
                Exemplo de Label
              </div>
            </div>
          </div>
        </div>

        {/* Fonte */}
        <div className="card-glass">
          <div className="flex items-center gap-3 mb-4">
            <Type className="w-5 h-5 text-auris-rose" />
            <h3 className="text-lg font-medium text-white">Tipografia</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {fontes.map((fonte) => (
              <motion.button
                key={fonte.id}
                className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                  fonte_sistema === fonte.id
                    ? 'bg-auris-sage/20 border-auris-sage'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => setFonteSistema(fonte.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ fontFamily: fonte.id === 'serif' ? 'Georgia, serif' : fonte.id === 'mono' ? 'monospace' : 'inherit' }}
              >
                <p className="font-medium text-white">{fonte.nome}</p>
                <p className="text-xs text-white/60">{fonte.descricao}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Módulo Complementar */}
        <div className="card-glass">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-auris-indigo" />
              <div>
                <h3 className="text-lg font-medium text-white">Módulo Complementar</h3>
                <p className="text-sm text-white/60">Ativar suporte a aplicação presencial</p>
                <p className="text-xs text-white/40">Adiciona opções de timer e registro durante sessões</p>
              </div>
            </div>
            
            <motion.button
              className={`w-14 h-8 rounded-full p-1 transition-colors ${
                modo_reiki_ativo ? 'bg-auris-sage' : 'bg-white/20'
              }`}
              onClick={() => modo_reiki_ativo ? toggleModoReiki() : setShowReikiConfirm(true)}
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-white shadow-lg"
                animate={{ x: modo_reiki_ativo ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>

        <div className="card-glass">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-auris-gold" />
            <div>
              <h3 className="text-lg font-medium text-white">Aura AI Multi-Provider</h3>
              <p className="text-sm text-white/60">Primeiro verifique a API, depois ative o provider</p>
            </div>
          </div>

          <div className="space-y-4">
            <AIProviderCard
              title="OpenAI"
              description="Atendimento com GPT"
              provider="openai"
              activeProvider={ai_provider}
              apiKey={openai_api_key}
              isTested={openai_tested}
              lastError={openai_last_error}
              isTesting={testingProvider === 'openai'}
              onKeyChange={setOpenAIKey}
              onTest={handleTestAI}
              onActivate={setAIProvider}
              icon={<OpenAILogo className="w-5 h-5" />}
              accentClass="text-emerald-300"
              placeholder="sk-..."
            />

            <AIProviderCard
              title="DeepSeek"
              description="Análise clínica com DeepSeek"
              provider="deepseek"
              activeProvider={ai_provider}
              apiKey={deepseek_api_key}
              isTested={deepseek_tested}
              lastError={deepseek_last_error}
              isTesting={testingProvider === 'deepseek'}
              onKeyChange={setDeepSeekKey}
              onTest={handleTestAI}
              onActivate={setAIProvider}
              icon={<Bot className="w-5 h-5" />}
              accentClass="text-sky-300"
              placeholder="sk-..."
            />

            <AIProviderCard
              title="Google Gemini"
              description="Gemini com chave editável do usuário"
              provider="gemini"
              activeProvider={ai_provider}
              apiKey={gemini_api_key}
              model={gemini_model}
              isTested={gemini_tested}
              lastError={gemini_last_error}
              isTesting={testingProvider === 'gemini'}
              onKeyChange={setGeminiKey}
              onModelChange={setGeminiModel}
              onTest={handleTestAI}
              onActivate={setAIProvider}
              onReset={resetGeminiConfig}
              icon={<GeminiLogo className="w-5 h-5" />}
              accentClass="text-violet-200"
              placeholder="AIzaSy..."
            />

            <motion.button
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                ai_provider === 'none'
                  ? 'bg-white/10 border-white/20'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => setAIProvider('none')}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                    <WifiOff className="w-5 h-5 text-white/70" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Modo Offline</p>
                    <p className="text-sm text-white/50">Mantém a Aura somente com respostas locais</p>
                  </div>
                </div>
                {ai_provider === 'none' && <CheckCircle2 className="w-5 h-5 text-auris-sage" />}
              </div>
            </motion.button>
          </div>
        </div>

        {/* Backup */}
        <div className="card-glass">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-5 h-5 text-auris-sage" />
            <h3 className="text-lg font-medium text-white">Backup de Dados</h3>
          </div>
          
          <div className="flex gap-4">
            <motion.button
              className="flex-1 btn-glass flex items-center justify-center gap-2"
              onClick={handleExport}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              Exportar Dados
            </motion.button>
            
            <label className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <motion.div
                className="w-full btn-glass flex items-center justify-center gap-2 cursor-pointer"
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-4 h-4" />
                Importar Dados
              </motion.div>
            </label>
          </div>
          
          {importSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-auris-sage/20 border border-auris-sage/50 rounded-xl flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-auris-sage" />
              <span className="text-sm text-auris-sage">Dados importados com sucesso!</span>
            </motion.div>
          )}
          
          {importError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-auris-rose/20 border border-auris-rose/50 rounded-xl flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-auris-rose" />
              <span className="text-sm text-auris-rose">{importError}</span>
            </motion.div>
          )}
        </div>

        {/* Reset */}
        <div className="card-glass border-auris-rose/30">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-5 h-5 text-auris-rose" />
            <h3 className="text-lg font-medium text-white">Zona de Perigo</h3>
          </div>
          
          <p className="text-white/60 text-sm mb-4">
            Esta ação irá apagar todos os dados do sistema. Não pode ser desfeita.
          </p>
          
          <motion.button
            className="w-full py-3 px-4 bg-auris-rose/20 hover:bg-auris-rose/30 border border-auris-rose/50 text-auris-rose rounded-xl transition-colors flex items-center justify-center gap-2"
            onClick={() => setShowResetConfirm(true)}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className="w-4 h-4" />
            Apagar Todos os Dados
          </motion.button>
        </div>
      </div>

      {/* Modal Confirmar Reiki */}
      {showReikiConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowReikiConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass max-w-md w-full rounded-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-auris-indigo" />
              <h3 className="text-xl font-medium text-white">Ativar Módulo Complementar</h3>
            </div>
            
            <p className="text-white/70 mb-6">
              Este módulo adiciona recursos para aplicação presencial, incluindo timers e registro de sessões. Deseja ativar?
            </p>
            
            <div className="flex gap-3">
              <motion.button
                className="flex-1 btn-glass"
                onClick={() => setShowReikiConfirm(false)}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                className="flex-1 btn-primary"
                onClick={() => {
                  toggleModoReiki();
                  setShowReikiConfirm(false);
                }}
                whileTap={{ scale: 0.98 }}
              >
                Ativar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Confirmar Reset */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass max-w-md w-full rounded-3xl p-6 border-auris-rose/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-auris-rose" />
              <h3 className="text-xl font-medium text-white">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-white/70 mb-6">
              Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3">
              <motion.button
                className="flex-1 btn-glass"
                onClick={() => setShowResetConfirm(false)}
                whileTap={{ scale: 0.98 }}
              >
                Cancelar
              </motion.button>
              <motion.button
                className="flex-1 py-3 px-4 bg-auris-rose hover:bg-auris-rose-dark text-white rounded-xl transition-colors"
                onClick={handleReset}
                whileTap={{ scale: 0.98 }}
              >
                Apagar Tudo
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

interface AIProviderCardProps {
  title: string;
  description: string;
  provider: Exclude<AIProvider, 'none'>;
  activeProvider: AIProvider;
  apiKey: string;
  model?: string;
  isTested: boolean;
  lastError?: string;
  isTesting: boolean;
  onKeyChange: (key: string) => void;
  onModelChange?: (model: string) => void;
  onTest: (provider: Exclude<AIProvider, 'none'>) => void;
  onActivate: (provider: AIProvider) => void;
  onReset?: () => void;
  icon: React.ReactNode;
  accentClass: string;
  placeholder: string;
}

const AIProviderCard: React.FC<AIProviderCardProps> = ({
  title,
  description,
  provider,
  activeProvider,
  apiKey,
  model,
  isTested,
  lastError,
  isTesting,
  onKeyChange,
  onModelChange,
  onTest,
  onActivate,
  onReset,
  icon,
  accentClass,
  placeholder,
}) => {
  const isActive = activeProvider === provider;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        isActive
          ? 'bg-white/10 border-auris-sage/40 shadow-[0_0_30px_rgba(16,185,129,0.12)]'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-white">{title}</p>
              <span className={`text-xs ${accentClass}`}>{isActive ? 'Ativo' : 'Disponível'}</span>
            </div>
            <p className="text-sm text-white/50">{description}</p>
          </div>
        </div>

        <div
          className={`text-xs px-2.5 py-1 rounded-full border ${
            isActive ? 'border-auris-sage/40 text-auris-sage bg-auris-sage/10' : 'border-white/10 text-white/50'
          }`}
        >
          {isActive ? 'Conectado' : 'Inativo'}
        </div>
      </div>

        <div className="mt-4 space-y-3">
        {model && (
          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/40">Modelo ativo</p>
                <p className="mt-1 font-mono text-sm text-white/80">{model}</p>
              </div>
              {onReset && (
                <motion.button
                  className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-white/10"
                  onClick={onReset}
                  whileTap={{ scale: 0.98 }}
                >
                  Resetar Gemini
                </motion.button>
              )}
            </div>
            {provider === 'gemini' && onModelChange && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <motion.button
                  className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
                    model === 'gemini-2.5-flash-lite'
                      ? 'bg-auris-sage/20 border-auris-sage/40 text-auris-sage'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                  onClick={() => onModelChange('gemini-2.5-flash-lite')}
                  whileTap={{ scale: 0.98 }}
                >
                  Flash Lite
                </motion.button>
                <motion.button
                  className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
                    model === 'gemini-2.5-flash'
                      ? 'bg-auris-sage/20 border-auris-sage/40 text-auris-sage'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                  onClick={() => onModelChange('gemini-2.5-flash')}
                  whileTap={{ scale: 0.98 }}
                >
                  Flash
                </motion.button>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm text-white/60 mb-2">Chave da API</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onKeyChange(e.target.value)}
            placeholder={placeholder}
            className="input-glass w-full"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          {isTesting ? (
            <span className="inline-flex items-center gap-2 text-amber-300">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verificando API...
            </span>
          ) : isTested ? (
            <span className="inline-flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              API verificada
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 text-white/50">
              <ShieldCheck className="w-4 h-4" />
              Verificação pendente
            </span>
          )}
        </div>

        {lastError && (
          <div className="rounded-xl border border-auris-rose/30 bg-auris-rose/10 px-3 py-2 text-sm text-auris-rose flex items-start gap-2">
            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <span className="block">{lastError}</span>
              {lastError.includes('vazamento') && (
                <span className="block text-auris-rose/80">
                  Depois de criar a nova chave, use `Resetar Gemini`, cole a credencial nova e verifique novamente.
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <motion.button
            className={`flex-1 py-3 px-4 rounded-xl border transition-colors ${
              apiKey
                ? 'bg-white/10 hover:bg-white/15 border-white/10 text-white'
                : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
            }`}
            onClick={() => onTest(provider)}
            whileTap={{ scale: 0.98 }}
            disabled={!apiKey || isTesting}
          >
            {isTested ? 'Verificar novamente' : 'Verificar API'}
          </motion.button>

          <motion.button
            className={`flex-1 py-3 px-4 rounded-xl border transition-colors ${
              isTested
                ? 'bg-auris-sage/20 hover:bg-auris-sage/30 border-auris-sage/40 text-auris-sage'
                : 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
            }`}
            onClick={() => onActivate(provider)}
            whileTap={{ scale: 0.98 }}
            disabled={!isTested}
          >
            {isActive ? 'Ativo' : 'Ativar'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const OpenAILogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 3.2a4.1 4.1 0 0 1 3.6 2.1l2.2 1.3a4.1 4.1 0 0 1 2.1 3.55 4.1 4.1 0 0 1-1.95 3.49v2.58A4.1 4.1 0 0 1 13.9 20l-1.9 1.1a4.1 4.1 0 0 1-4.1 0l-2.2-1.27a4.1 4.1 0 0 1-2.05-3.56 4.1 4.1 0 0 1 1.95-3.49V10.2A4.1 4.1 0 0 1 9.7 4l2.3-.8Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="m8.3 6.5 3.8 2.2v4.6l-3.9 2.3m7.5-8.8-3.8 2.2M15.7 17.5l-3.8-2.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GeminiLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 2.5c1.2 4.4 4 7.8 8.5 9.5-4.4 1.2-7.8 4-9.5 8.5-1.2-4.4-4-7.8-8.5-9.5 4.4-1.2 7.8-4 9.5-8.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M12 7.5v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M7.5 12h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
