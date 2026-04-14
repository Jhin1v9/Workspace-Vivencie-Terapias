// Evento Modal - Formulário para criar/editar agendamentos

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Check, 
  Trash2,
  DollarSign,
  Play,
  CheckCircle,
  XCircle,
  Search,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { usePacientesStore } from '@/stores/usePacientesStore';
import { useFinancasStore } from '@/stores/useFinancasStore';
import { useDebounce } from '@/hooks/useDebounce';
import type { CalendarEvent, CalendarEventType, CalendarEventStatus } from '@/types/calendar';
import type { Paciente } from '@/types';

interface EventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  evento: CalendarEvent | null;
  dataInicial?: Date;
  horaInicial?: number;
}

const tiposEvento: { id: CalendarEventType; label: string; cor: string; duracao: number }[] = [
  { id: 'consulta', label: 'Consulta', cor: 'bg-auris-sage', duracao: 60 },
  { id: 'retorno', label: 'Retorno', cor: 'bg-blue-500', duracao: 30 },
  { id: 'revisao', label: 'Revisão', cor: 'bg-purple-500', duracao: 45 },
  { id: 'bloqueio', label: 'Bloqueio', cor: 'bg-slate-600', duracao: 60 },
];

const statusConfig: Record<CalendarEventStatus, { label: string; cor: string; icone: any }> = {
  agendado: { label: 'Agendado', cor: 'text-amber-400', icone: Calendar },
  confirmado: { label: 'Confirmado', cor: 'text-blue-400', icone: Check },
  em_andamento: { label: 'Em Andamento', cor: 'text-emerald-400', icone: Play },
  concluido: { label: 'Concluído', cor: 'text-slate-400', icone: CheckCircle },
  cancelado: { label: 'Cancelado', cor: 'text-red-400', icone: XCircle },
};

export const EventoModal: React.FC<EventoModalProps> = ({
  isOpen,
  onClose,
  evento,
  dataInicial,
  horaInicial,
}) => {
  const { addEvent, updateEvent, deleteEvent, confirmarEvento, completarEvento, cancelarEvento } = useCalendarStore();
  const { pacientes } = usePacientesStore();
  const { adicionarTransacao, servicos } = useFinancasStore();
  
  // Estados do formulário
  const [pacienteBusca, setPacienteBusca] = useState('');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [mostrarBusca, setMostrarBusca] = useState(false);
  const [tipo, setTipo] = useState<CalendarEventType>('consulta');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('09:00');
  const [duracao, setDuracao] = useState(60);
  const [observacoes, setObservacoes] = useState('');
  const [status, setStatus] = useState<CalendarEventStatus>('agendado');
  const [registrarPagamento, setRegistrarPagamento] = useState(false);
  const [valorPagamento, setValorPagamento] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);
  const [lembreteAura, setLembreteAura] = useState(false);
  
  // Verificar se é edição ou criação
  const isEdicao = !!evento;
  const isConcluido = status === 'concluido';
  const isCancelado = status === 'cancelado';
  
  // Inicializar formulário
  useEffect(() => {
    if (evento) {
      // Modo edição - preencher com dados do evento
      const paciente = pacientes.find(p => p.id === evento.pacienteId);
      setPacienteSelecionado(paciente || null);
      setPacienteBusca(paciente?.dados_pessoais?.nome || evento.pacienteNome || '');
      setTipo(evento.type);
      const eventDate = new Date(evento.start);
      setData(eventDate.toISOString().split('T')[0]);
      setHora(eventDate.toTimeString().slice(0, 5));
      const start = new Date(evento.start);
      const end = new Date(evento.end);
      setDuracao(Math.round((end.getTime() - start.getTime()) / 60000));
      setObservacoes(evento.notes || '');
      setStatus(evento.status);
      setLembreteAura(evento.lembreteAura ?? false);
    } else {
      // Modo criação - usar valores padrão
      setPacienteSelecionado(null);
      setPacienteBusca('');
      setTipo('consulta');
      const hoje = dataInicial || new Date();
      setData(hoje.toISOString().split('T')[0]);
      const horaPadrao = horaInicial !== undefined ? `${horaInicial.toString().padStart(2, '0')}:00` : '09:00';
      setHora(horaPadrao);
      setDuracao(60);
      setObservacoes('');
      setStatus('agendado');
      setRegistrarPagamento(false);
      setValorPagamento('');
      setServicoId('');
      setLembreteAura(false);
    }
  }, [evento, dataInicial, horaInicial, pacientes, isOpen]);
  
  // Atualizar duração quando muda o tipo
  useEffect(() => {
    const tipoConfig = tiposEvento.find(t => t.id === tipo);
    if (tipoConfig && !isEdicao) {
      setDuracao(tipoConfig.duracao);
    }
  }, [tipo, isEdicao]);
  
  // Debounce na busca para melhor performance
  const debouncedPacienteBusca = useDebounce(pacienteBusca, 300);
  
  // Filtrar pacientes
  const pacientesFiltrados = useMemo(() => {
    if (!debouncedPacienteBusca) return [];
    return pacientes.filter(p => 
      p.dados_pessoais.nome.toLowerCase().includes(debouncedPacienteBusca.toLowerCase()) ||
      (p.dados_pessoais.telefone && p.dados_pessoais.telefone.includes(debouncedPacienteBusca))
    ).slice(0, 5);
  }, [debouncedPacienteBusca, pacientes]);
  
  // Selecionar paciente
  const handleSelectPaciente = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setPacienteBusca(paciente.dados_pessoais?.nome || '');
    setMostrarBusca(false);
    setErroValidacao(null);
  };
  
  // Salvar evento
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErroValidacao(null);
    
    if (!pacienteSelecionado && tipo !== 'bloqueio') {
      setErroValidacao('Por favor, selecione um paciente para continuar');
      return;
    }
    
    const [hours, minutes] = hora.split(':').map(Number);
    const startDate = new Date(data);
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + duracao * 60000);
    
    const tipoConfig = tiposEvento.find(t => t.id === tipo);
    
    const eventData = {
      title: tipo === 'bloqueio' ? 'Bloqueio' : `${tipoConfig?.label || 'Consulta'} - ${pacienteSelecionado?.dados_pessoais?.nome || 'Paciente'}`,
      type: tipo,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      pacienteId: pacienteSelecionado?.id,
      pacienteNome: pacienteSelecionado?.dados_pessoais?.nome,
      status,
      color: tipoConfig?.cor || 'bg-auris-sage',
      notes: observacoes,
      lembreteAura,
    };
    
    if (isEdicao && evento) {
      updateEvent(evento.id, eventData);
    } else {
      const novoEvento = addEvent(eventData);
      
      // Se marcou para registrar pagamento ao criar
      if (registrarPagamento && valorPagamento && novoEvento) {
        adicionarTransacao({
          tipo: 'receita',
          descricao: `Pagamento - ${eventData.title}`,
          valor: parseFloat(valorPagamento),
          data: new Date(),
          metodoPagamento: 'dinheiro',
          status: 'recebido',
          pacienteId: pacienteSelecionado?.id,
          servicoId: servicoId || undefined,
        });
      }
    }
    
    onClose();
  };
  

  
  // Ações de status
  const handleConfirmar = () => {
    if (evento) {
      confirmarEvento(evento.id);
      setStatus('confirmado');
    }
  };
  
  const handleIniciar = () => {
    if (evento) {
      updateEvent(evento.id, { status: 'em_andamento' });
      setStatus('em_andamento');
    }
  };
  
  const handleCompletar = () => {
    if (evento) {
      completarEvento(evento.id);
      setStatus('concluido');
    }
  };
  
  const handleCancelar = () => {
    if (evento) {
      cancelarEvento(evento.id);
      setStatus('cancelado');
    }
  };
  
  const handleExcluir = () => {
    if (evento && confirm('Tem certeza que deseja excluir este agendamento?')) {
      deleteEvent(evento.id);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  const StatusIcon = statusConfig[status].icone;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com Status */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {isEdicao ? 'Detalhes do Agendamento' : 'Novo Agendamento'}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              {isEdicao && (
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 ${statusConfig[status].cor}`}>
                    <StatusIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{statusConfig[status].label}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Formulário */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Alerta de erro de validação */}
              {erroValidacao && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-200 text-sm"
                >
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  {erroValidacao}
                </motion.div>
              )}
              
              {/* Busca de Paciente */}
              {tipo !== 'bloqueio' && (
                <div className="relative">
                  <label className="text-slate-400 text-sm mb-2 block flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Paciente
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pacienteBusca}
                      onChange={(e) => {
                        setPacienteBusca(e.target.value);
                        setMostrarBusca(true);
                        if (!e.target.value) setPacienteSelecionado(null);
                      }}
                      onFocus={() => setMostrarBusca(true)}
                      placeholder="Digite o nome ou telefone..."
                      className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-auris-sage/50"
                      disabled={isConcluido || isCancelado}
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  </div>
                  
                  {/* Dropdown de resultados */}
                  {mostrarBusca && pacientesFiltrados.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-xl"
                    >
                      {pacientesFiltrados.map((paciente) => (
                        <button
                          key={paciente.id}
                          type="button"
                          onClick={() => handleSelectPaciente(paciente)}
                          className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                        >
                          <p className="text-white font-medium">{paciente.dados_pessoais.nome}</p>
                          {paciente.dados_pessoais.telefone && (
                            <p className="text-slate-500 text-sm">{paciente.dados_pessoais.telefone}</p>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                  
                  {mostrarBusca && pacienteBusca && pacientesFiltrados.length === 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-white/10 rounded-xl p-4 text-center">
                      <p className="text-slate-500 text-sm">Nenhum paciente encontrado</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Tipo de Evento */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Tipo</label>
                <div className="grid grid-cols-4 gap-2">
                  {tiposEvento.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTipo(t.id)}
                      disabled={isConcluido || isCancelado}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        tipo === t.id
                          ? `${t.cor} text-white`
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      } disabled:opacity-50`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Data e Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-2 block flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data
                  </label>
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    disabled={isConcluido || isCancelado}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-auris-sage/50 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Horário
                  </label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    disabled={isConcluido || isCancelado}
                    className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-auris-sage/50 disabled:opacity-50"
                  />
                </div>
              </div>
              
              {/* Duração */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block">Duração</label>
                <div className="flex gap-2">
                  {[30, 45, 60, 90, 120].map((min) => (
                    <button
                      key={min}
                      type="button"
                      onClick={() => setDuracao(min)}
                      disabled={isConcluido || isCancelado}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        duracao === min
                          ? 'bg-auris-sage text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      } disabled:opacity-50`}
                    >
                      {min}min
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Observações */}
              <div>
                <label className="text-slate-400 text-sm mb-2 block flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Observações
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  disabled={isConcluido || isCancelado}
                  placeholder="Anotações sobre o agendamento..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-auris-sage/50 resize-none disabled:opacity-50"
                />
              </div>
              
              {/* Lembrete AURA */}
              <div className="p-3 bg-auris-sage/10 border border-auris-sage/20 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lembreteAura}
                    onChange={(e) => setLembreteAura(e.target.checked)}
                    disabled={isConcluido || isCancelado}
                    className="w-5 h-5 rounded border-auris-sage/50 text-auris-sage focus:ring-auris-sage/20 disabled:opacity-50"
                  />
                  <span className="text-auris-sage font-medium flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Lembrar via AURA
                  </span>
                </label>
              </div>
              
              {/* Registrar Pagamento (para novos agendamentos) */}
              {!isEdicao && pacienteSelecionado && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registrarPagamento}
                      onChange={(e) => setRegistrarPagamento(e.target.checked)}
                      className="w-5 h-5 rounded border-emerald-500/50 text-emerald-500 focus:ring-emerald-500/20"
                    />
                    <span className="text-emerald-400 font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Registrar pagamento ao salvar
                    </span>
                  </label>
                  
                  {registrarPagamento && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-3"
                    >
                      <select
                        value={servicoId}
                        onChange={(e) => {
                          setServicoId(e.target.value);
                          const servico = servicos.find(s => s.id === e.target.value);
                          if (servico) setValorPagamento(servico.valorPadrao.toString());
                        }}
                        className="w-full px-4 py-2 bg-slate-800 border border-emerald-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Selecione o serviço</option>
                        {servicos.filter(s => s.ativo).map((s) => (
                          <option key={s.id} value={s.id}>{s.nome} - R$ {s.valorPadrao.toFixed(2)}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={valorPagamento}
                        onChange={(e) => setValorPagamento(e.target.value)}
                        placeholder="Valor (R$)"
                        className="w-full px-4 py-2 bg-slate-800 border border-emerald-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </motion.div>
                  )}
                </div>
              )}
              
              {/* Botões de Ação */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {isEdicao ? (
                  <>
                    {/* Botões de Status */}
                    {status === 'agendado' && (
                      <Button
                        type="button"
                        onClick={handleConfirmar}
                        variant="outline"
                        className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Confirmar
                      </Button>
                    )}
                    
                    {status === 'confirmado' && (
                      <Button
                        type="button"
                        onClick={handleIniciar}
                        variant="outline"
                        className="flex-1 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </Button>
                    )}
                    
                    {status === 'em_andamento' && (
                      <Button
                        type="button"
                        onClick={handleCompletar}
                        variant="outline"
                        className="flex-1 border-slate-500/50 text-slate-400 hover:bg-slate-500/10"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completar
                      </Button>
                    )}
                    
                    {(status === 'agendado' || status === 'confirmado') && (
                      <Button
                        type="button"
                        onClick={handleCancelar}
                        variant="outline"
                        className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    )}
                    
                    {/* Registrar pagamento para evento existente */}
                    {status === 'concluido' && (
                      <Button
                        type="button"
                        onClick={() => setRegistrarPagamento(!registrarPagamento)}
                        variant="outline"
                        className="flex-1 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Registrar Pagamento
                      </Button>
                    )}
                    
                    <Button
                      type="button"
                      onClick={handleExcluir}
                      variant="outline"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      type="submit"
                      disabled={isConcluido || isCancelado}
                      className="flex-1 bg-auris-sage hover:bg-auris-sage/90 text-slate-900"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button
                    type="submit"
                    disabled={!pacienteSelecionado && tipo !== 'bloqueio'}
                    className="flex-1 bg-auris-sage hover:bg-auris-sage/90 text-slate-900"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Criar Agendamento
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventoModal;
