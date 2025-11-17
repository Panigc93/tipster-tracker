/**
 * @fileoverview AddFollowModal component - Modal for creating/editing follows
 * @module features/follows/components/AddFollowModal
 */

import { useState, useEffect } from 'react';
import { Modal, Button, Input, Badge } from '@shared/components/ui';
import { PickResult, Bookmaker } from '@shared/types/enums';
import { useFollows } from '../../hooks';
import { formatDate } from '@shared/utils/date.utils';
import { getSportIcon } from '@features/picks/utils/sport-icons';
import type { AddFollowModalProps, FollowFormData } from './AddFollowModal.types';
import type { CreateFollowDTO, UpdateFollowDTO } from '@shared/types';

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

  // Initialize form with follow data in edit mode or pick data in create mode
  useEffect(() => {
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
    } else if (pick && !isEditMode) {
      // Pre-fill with pick data for convenience
      setFormData({
        userOdds: pick.odds.toString(),
        userStake: pick.stake.toString(),
        userBookmaker: pick.bookmaker,
        userBetType: pick.betType,
        userResult: 'Pendiente',
        userIsResolved: false,
        dateFollowed: new Date().toISOString().split('T')[0],
        timeFollowed: new Date().toTimeString().slice(0, 5),
        comments: '',
      });
    }
  }, [isEditMode, follow, pick]);

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
          isResolved: formData.userIsResolved,
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
          isResolved: formData.userIsResolved,
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pick Info (Read-only) - Only show in create mode */}
        {!isEditMode && pick && (
          <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Información de la Pick Original</h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">Tipster:</span>
                <span className="ml-2 text-slate-200">{tipsterName || 'Desconocido'}</span>
              </div>
              <div>
                <span className="text-slate-400">Fecha:</span>
                <span className="ml-2 text-slate-200">{formatDate(pick.date)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Partido:</span>
                <span className="ml-2 text-slate-200">{pick.match}</span>
              </div>
              <div>
                <span className="text-slate-400">Deporte:</span>
                <span className="ml-2 text-slate-200">
                  {getSportIcon(pick.sport)} {pick.sport}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Tipo:</span>
                <span className="ml-2 text-slate-200">{pick.pickType}</span>
              </div>
              <div>
                <span className="text-slate-400">Cuota:</span>
                <span className="ml-2 text-slate-200 font-medium">{pick.odds.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400">Stake:</span>
                <span className="ml-2 text-slate-200 font-medium">{pick.stake}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Apuesta:</span>
                <span className="ml-2 text-slate-200">{pick.betType}</span>
              </div>
              <div>
                <span className="text-slate-400">Bookmaker:</span>
                <span className="ml-2 text-slate-200">{pick.bookmaker}</span>
              </div>
              <div>
                <span className="text-slate-400">Resultado:</span>
                <Badge variant={pick.result === 'Ganada' ? 'success' : pick.result === 'Perdida' ? 'error' : 'info'} size="sm" className="ml-2">
                  {pick.result}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Divider */}
        {!isEditMode && pick && (
          <div className="border-t border-slate-600 my-4">
            <p className="text-sm text-slate-400 text-center -mt-3 bg-slate-800 w-fit mx-auto px-3">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tu Casa de Apuestas *
            </label>
            <select
              value={formData.userBookmaker}
              onChange={(e) => handleInputChange('userBookmaker', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              label="Tipo de Apuesta"
              type="text"
              value={formData.userBetType}
              onChange={(e) => handleInputChange('userBetType', e.target.value)}
              placeholder="ej: Local gana, Más de 2.5 goles"
              required
            />
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

          {/* User Result */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tu Resultado *
            </label>
            <select
              value={formData.userResult}
              onChange={(e) => handleInputChange('userResult', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {Object.values(PickResult).map((res) => (
                <option key={res} value={res}>
                  {res}
                </option>
              ))}
            </select>
          </div>

          {/* Is Resolved Checkbox */}
          <div className="flex items-center pt-8">
            <input
              type="checkbox"
              id="userIsResolved"
              checked={formData.userIsResolved}
              onChange={(e) => handleInputChange('userIsResolved', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
            />
            <label htmlFor="userIsResolved" className="ml-2 text-sm text-slate-300">
              Apuesta resuelta
            </label>
          </div>

          {/* Comments */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Comentarios
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              placeholder="Notas adicionales (opcional)"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Guardando...' : isEditMode ? 'Actualizar Follow' : 'Guardar Follow'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
