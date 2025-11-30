/**
 * @fileoverview AddFollowModal component - Modal for creating/editing follows
 * @module features/follows/components/AddFollowModal
 */

import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Modal, Button, Input, Badge } from '@/shared/components/ui';
import { PickResult, Bookmaker } from '@/shared/types/enums';
import { useFollows } from '../../hooks';
import { formatDate } from '@/shared/utils/date.utils';
import { getSportIcon } from '@features/picks/utils/sport-icons';
import type { AddFollowModalProps, FollowFormData } from './AddFollowModal.types';
import type { CreateFollowDTO, UpdateFollowDTO } from '@/shared/types';

/**
 * Combine date and time into ISO datetime string
 */
const combineDateTimeISO = (date: string, time: string): string => {
  return `${date}T${time}:00`;
};

/**
 * Calculate profit from a follow
 */
const calculateProfit = (odds: number, stake: number, result: string): number => {
  const normalizedResult = result.toLowerCase();
  
  if (normalizedResult === 'ganada') {
    return (odds - 1) * stake;
  } else if (normalizedResult === 'perdida') {
    return -stake;
  }
  return 0;
};

/**
 * AddFollowModal component
 * Modal form for creating or editing follows
 */
export function AddFollowModal({
  isOpen,
  onClose,
  onSuccess,
  pick,
  tipsterName,
  follow,
  onUpdate,
}: AddFollowModalProps) {
  const { createFollow } = useFollows();
  const isEditMode = !!follow;

  // Form state
  const [formData, setFormData] = useState<FollowFormData>({
    userOdds: '',
    userStake: '',
    userBookmaker: '',
    userBetType: '',
    userResult: 'Pendiente',
    userIsResolved: false,
    dateFollowed: new Date().toISOString().split('T')[0],
    timeFollowed: new Date().toTimeString().slice(0, 5),
    comments: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  // Initialize form with follow data in edit mode or pick data in create mode
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode && follow) {
      setFormData({
        userOdds: follow.userOdds.toString(),
        userStake: follow.userStake.toString(),
        userBookmaker: follow.userBookmaker,
        userBetType: follow.userBetType,
        userResult: follow.userResult,
        userIsResolved: follow.isResolved,
        dateFollowed: follow.dateFollowed,
        timeFollowed: follow.timeFollowed,
        comments: follow.comments || '',
      });
      // Show comments section if there are existing comments
      if (follow.comments) {
        setShowComments(true);
      }
    } else if (pick && !isEditMode) {
      // Pre-fill with pick data for convenience
      setFormData({
        userOdds: pick.odds.toString(),
        userStake: pick.stake.toString(),
        userBookmaker: pick.bookmaker,
        userBetType: pick.betType,
        userResult: pick.result,
        userIsResolved: false,
        dateFollowed: new Date().toISOString().split('T')[0],
        timeFollowed: new Date().toTimeString().slice(0, 5),
        comments: '',
      });
    }
  }, [isOpen, isEditMode, follow, pick]);

  const handleInputChange = (field: keyof FollowFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.userOdds || parseFloat(formData.userOdds) <= 1) {
      setError('La cuota debe ser mayor a 1.0');
      return false;
    }
    if (!formData.userStake || parseFloat(formData.userStake) < 1 || parseFloat(formData.userStake) > 10) {
      setError('El stake debe estar entre 1 y 10');
      return false;
    }
    if (!formData.userBookmaker.trim()) {
      setError('Selecciona una casa de apuestas');
      return false;
    }
    if (!formData.userBetType.trim()) {
      setError('Ingresa el tipo de apuesta');
      return false;
    }
    if (!formData.dateFollowed) {
      setError('Selecciona la fecha');
      return false;
    }
    if (!formData.timeFollowed) {
      setError('Ingresa la hora');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode && follow && onUpdate) {
        // Edit mode
        const userOdds = parseFloat(formData.userOdds);
        const userStake = parseFloat(formData.userStake);
        const profitFromFollow = calculateProfit(userOdds, userStake, formData.userResult);

        const updateData: UpdateFollowDTO = {
          userOdds,
          userStake,
          userBookmaker: formData.userBookmaker,
          userBetType: formData.userBetType,
          userResult: formData.userResult,
          isResolved: formData.userResult !== 'Pendiente', // Auto-calculate based on result
          dateFollowed: formData.dateFollowed,
          timeFollowed: formData.timeFollowed,
          dateTimeFollowed: combineDateTimeISO(formData.dateFollowed, formData.timeFollowed),
          profitFromFollow,
          comments: formData.comments,
        };

        await onUpdate(follow.id, updateData);
      } else if (pick) {
        // Create mode
        const userOdds = parseFloat(formData.userOdds);
        const userStake = parseFloat(formData.userStake);
        const profitFromFollow = calculateProfit(userOdds, userStake, formData.userResult);

        const followData: CreateFollowDTO = {
          tipsterId: pick.tipsterId,
          pickId: pick.id,
          userOdds,
          userStake,
          userBookmaker: formData.userBookmaker,
          userBetType: formData.userBetType,
          userResult: formData.userResult,
          isResolved: formData.userResult !== 'Pendiente', // Auto-calculate based on result
          dateFollowed: formData.dateFollowed,
          timeFollowed: formData.timeFollowed,
          dateTimeFollowed: combineDateTimeISO(formData.dateFollowed, formData.timeFollowed),
          profitFromFollow,
          comments: formData.comments,
        };

        await createFollow(followData);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el follow');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? 'Editar Follow' : 'Seguir Pick'} size="lg">
      <form onSubmit={handleSubmit}>
        {/* Pick Info (Read-only) - Only show in create mode */}
        {!isEditMode && pick && (
          <div className="bg-slate-700/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200">Pick Original de {tipsterName}</h3>
              <div className="flex items-center gap-2">
                <span className="ml-2 text-slate-200 text-sm">{formatDate(pick.date)}</span>
                <Badge variant={pick.result === 'Ganada' ? 'success' : pick.result === 'Perdida' ? 'error' : 'info'} size="md" className="ml-2">
                  {pick.result}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="col-span-2 flex flex-col border-b border-slate-600 pb-3">
                <span className="text-blue-500 text-lg font-semibold">{getSportIcon(pick.sport)} {pick.match}</span>
                <span className="ml-5 text-slate-200">{pick.betType}</span>
              </div>
              <div style={{ marginTop: '-1rem' }} className="col-span-2 flex items-center gap-2 justify-between">
                <span className=" text-slate-200 bg-slate-600 py-0 px-2 rounded-full">{pick.pickType}</span>
                <div className="flex items-center gap-2 col-span-2 bg-slate-600 py-0 px-2 rounded-full w-fit" >
                  <span className=" text-slate-200 font-medium">@{pick.odds.toFixed(2)}</span>
                  <span className=" text-slate-200 font-medium">{pick.stake}/10</span>
                </div>
                <span className=" text-slate-200 bg-slate-600 py-0 px-2 rounded-full">{pick.bookmaker}</span>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        {!isEditMode && pick && (
          <div className="border-t border-slate-600 mt-4 mb-2">
            <p className="text-sm text-slate-400 text-center -mt-2.5 bg-slate-800 w-fit mx-auto px-3">
              Ingresa tus datos
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* User Data Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* User Odds */}
          <div>
            <Input
              label="Tu Cuota"
              type="number"
              value={formData.userOdds}
              onChange={(e) => handleInputChange('userOdds', e.target.value)}
              placeholder="ej: 1.85"
              step="0.01"
              min="1.01"
              required
            />
          </div>

          {/* User Stake */}
          <div>
            <Input
              label="Tu Stake"
              type="number"
              value={formData.userStake}
              onChange={(e) => handleInputChange('userStake', e.target.value)}
              placeholder="1-10"
              min="1"
              max="10"
              step="0.5"
              required
            />
          </div>

          {/* User Bookmaker */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tu Casa de Apuestas *
            </label>
            <select
              value={formData.userBookmaker}
              onChange={(e) => handleInputChange('userBookmaker', e.target.value)}
              className="w-full h-[35px] px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar...</option>
              {Object.values(Bookmaker).map((bookie) => (
                <option key={bookie} value={bookie}>
                  {bookie}
                </option>
              ))}
            </select>
          </div>
          

          {/* User Bet Type */}
          <div className="md:col-span-2">
            <Input
              label="Apuesta"
              type="text"
              value={formData.userBetType}
              onChange={(e) => handleInputChange('userBetType', e.target.value)}
              placeholder="ej: Local gana, Más de 2.5 goles"
              required
            />
          </div>
                    {/* User Result */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tu Resultado *
            </label>
            <select
              value={formData.userResult}
              onChange={(e) => handleInputChange('userResult', e.target.value)}
              className="w-full h-[35px] px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              {Object.values(PickResult).map((res) => (
                <option key={res} value={res}>
                  {res}
                </option>
              ))}
            </select>
          </div>

          {/* Date Followed */}
          <div>
            <Input
              label="Fecha que Seguiste"
              type="date"
              value={formData.dateFollowed}
              onChange={(e) => handleInputChange('dateFollowed', e.target.value)}
              required
            />
          </div>

          {/* Time Followed */}
          <div>
            <Input
              label="Hora que Seguiste"
              type="time"
              value={formData.timeFollowed}
              onChange={(e) => handleInputChange('timeFollowed', e.target.value)}
              required
            />
          </div>

          {/* Comments - Collapsible */}
          <div className="md:col-span-2">
            {!showComments ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<MessageSquare className="h-4 w-4" />}
                onClick={() => setShowComments(true)}
                disabled={loading}
              >
                Añadir comentarios
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-300">
                    Comentarios (opcional)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowComments(false);
                      handleInputChange('comments', '');
                    }}
                    className="text-xs text-slate-400 hover:text-slate-300"
                    disabled={loading}
                  >
                    Quitar
                  </button>
                </div>
                <textarea
                  value={formData.comments}
                  onChange={(e) => handleInputChange('comments', e.target.value)}
                  placeholder="Notas adicionales..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                  disabled={loading}
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700 mt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={loading}>
            {loading ? 'Guardando...' : isEditMode ? 'Actualizar Follow' : 'Guardar Follow'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
