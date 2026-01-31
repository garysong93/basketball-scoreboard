import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { generatePDFReport, generateExcelReport, generateCSVReport } from '../utils/reportGenerator';

interface ReportPanelProps {
  onClose: () => void;
}

export function ReportPanel({ onClose }: ReportPanelProps) {
  const gameState = useGameStore();
  const { language } = gameState;
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastExport, setLastExport] = useState<string | null>(null);

  const content = {
    en: {
      title: 'Export Game Report',
      subtitle: 'Download your game data in various formats',
      pdfTitle: 'PDF Report',
      pdfDesc: 'Professional formatted report with all game statistics',
      excelTitle: 'Excel Spreadsheet',
      excelDesc: 'Editable spreadsheet with multiple sheets for detailed analysis',
      csvTitle: 'CSV Data',
      csvDesc: 'Simple comma-separated values for importing into other tools',
      download: 'Download',
      generating: 'Generating...',
      success: 'Downloaded successfully!',
      gamePreview: 'Current Game Preview',
      vs: 'vs',
      period: 'Period',
      players: 'players',
      events: 'events recorded',
    },
    zh: {
      title: '导出比赛报告',
      subtitle: '以多种格式下载比赛数据',
      pdfTitle: 'PDF 报告',
      pdfDesc: '专业格式的报告，包含所有比赛统计',
      excelTitle: 'Excel 表格',
      excelDesc: '可编辑的多工作表电子表格，便于详细分析',
      csvTitle: 'CSV 数据',
      csvDesc: '简单的逗号分隔值格式，可导入其他工具',
      download: '下载',
      generating: '生成中...',
      success: '下载成功！',
      gamePreview: '当前比赛预览',
      vs: '对',
      period: '第',
      players: '名球员',
      events: '个事件已记录',
    },
  };

  const t = content[language];

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsGenerating(true);
    setLastExport(null);

    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 300));

      switch (format) {
        case 'pdf':
          generatePDFReport(gameState, language);
          break;
        case 'excel':
          generateExcelReport(gameState, language);
          break;
        case 'csv':
          generateCSVReport(gameState);
          break;
      }

      setLastExport(format);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalPlayers = gameState.home.players.length + gameState.away.players.length;
  const totalEvents = gameState.events.length;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-bg-primary)] w-full sm:max-w-lg h-[85vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col rounded-t-2xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle bar */}
        <div className="sm:hidden flex justify-center py-2">
          <div className="w-12 h-1.5 bg-[var(--color-text-secondary)]/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-3 sm:p-4 flex justify-between items-center bg-[var(--color-bg-secondary)]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
              📄 {t.title}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">{t.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-text-primary)] hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
          {/* Game Preview */}
          <div className="p-4 rounded-lg bg-[var(--color-bg-secondary)]">
            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              {t.gamePreview}
            </h3>
            <div className="flex items-center justify-center gap-4 text-lg font-bold text-[var(--color-text-primary)]">
              <span style={{ color: gameState.home.color }}>{gameState.home.name}</span>
              <span className="text-2xl">{gameState.home.score}</span>
              <span className="text-[var(--color-text-secondary)]">-</span>
              <span className="text-2xl">{gameState.away.score}</span>
              <span style={{ color: gameState.away.color }}>{gameState.away.name}</span>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-sm text-[var(--color-text-secondary)]">
              <span>{t.period} {gameState.period}</span>
              <span>•</span>
              <span>{totalPlayers} {t.players}</span>
              <span>•</span>
              <span>{totalEvents} {t.events}</span>
            </div>
          </div>

          {/* Success message */}
          {lastExport && (
            <div className="p-3 rounded-lg bg-[var(--color-success)]/20 text-[var(--color-success)] text-center text-sm animate-fade-in">
              ✅ {t.success}
            </div>
          )}

          {/* Export Options */}
          <div className="space-y-3">
            {/* PDF */}
            <div className="p-4 rounded-lg border border-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">📑</span>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{t.pdfTitle}</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{t.pdfDesc}</p>
                </div>
                <button
                  onClick={() => handleExport('pdf')}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {isGenerating ? t.generating : t.download}
                </button>
              </div>
            </div>

            {/* Excel */}
            <div className="p-4 rounded-lg border border-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">📊</span>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{t.excelTitle}</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{t.excelDesc}</p>
                </div>
                <button
                  onClick={() => handleExport('excel')}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {isGenerating ? t.generating : t.download}
                </button>
              </div>
            </div>

            {/* CSV */}
            <div className="p-4 rounded-lg border border-[var(--color-bg-secondary)] hover:border-[var(--color-accent)] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">📝</span>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">{t.csvTitle}</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{t.csvDesc}</p>
                </div>
                <button
                  onClick={() => handleExport('csv')}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {isGenerating ? t.generating : t.download}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
