import type { Translations } from "./en";

export const ptBr: Translations = {
  app: {
    title: "Gerenciador de Escala Planning Center",
    subtitle: "Controle a sequência do evento em tempo real.",
  },
  live: {
    activity: "Atividade ao vivo",
    responsible: "Responsável",
    overallTimer: "Tempo total",
    unassigned: "Não atribuído",
  },
  controls: {
    start: "Iniciar",
    pause: "Pausar",
    conclude: "Concluir",
    viewPrevious: "Ver anterior",
    viewNext: "Ver próximo",
    backToLive: "Voltar ao vivo",
    reopenAsLive: "Reabrir como ao vivo",
    import: "Importar",
    importFile: "Importar arquivo de escala",
    editSchedule: "Editar escala",
    shareSchedule: "Compartilhar escala",
    linkCopied: "Link copiado!",
  },
  edit: {
    title: "Editar escala",
    addActivity: "Adicionar atividade",
    close: "Fechar edição de escala",
    activityName: "Nome da atividade",
    responsible: "Responsável",
    durationPlaceholder: "ss, mm:ss ou hh:mm:ss",
    durationValidation: "Use ss, mm:ss ou hh:mm:ss",
    moveUp: "Mover atividade para cima",
    moveDown: "Mover atividade para baixo",
    remove: "Remover atividade",
  },
  focus: {
    live: "AO VIVO",
    view: "VENDO",
    actual: "Real",
    noActivities: "Nenhuma atividade carregada.",
  },
  errors: {
    ocrFailed: "Falha ao processar OCR",
  },
};
