/**
 * @fileoverview AddPickModal component - Modal for creating/editing picks
 * @module features/picks/components/AddPickModal
 */

import { useState, useEffect } from 'react';
import { Modal, Button, Input } from '@shared/components/ui';
import { Sport, PickType, PickResult, Bookmaker } from '@shared/types/enums';
import { usePicks } from '../../hooks';
import type { AddPickModalProps } from './AddPickModal.types';
import type { CreatePickDTO, UpdatePickDTO } from '@shared/types';

/**
 * Combine date and time into ISO datetime string
 */
const combineDateTimeISO = (date: string, time: string): string => {
  return `${date}T${time}:00`;
};

/**
 * AddPickModal component
 * Modal form for creating or editing picks with full validation
 */
export function AddPickModal({
  isOpen,
  onClose,
  onSuccess,
  tipsters,
  pick,
  onUpdate,
}: AddPickModalProps) {
  const { createPick } = usePicks();
  const isEditMode = !!pick;

  // Form state
  const [tipsterId, setTipsterId] = useState('');
  const [match, setMatch] = useState('');
  const [sport, setSport] = useState('');
  const [pickType, setPickType] = useState('');
  const [betType, setBetType] = useState('');
  const [bookmaker, setBookmaker] = useState('');
  const [odds, setOdds] = useState('');
  const [stake, setStake] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState('Pendiente');
  const [comments, setComments] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with pick data in edit mode
  useEffect(() => {
    if (isEditMode && pick) {
      setTipsterId(pick.tipsterId);
      setMatch(pick.match);
      setSport(pick.sport);
      setPickType(pick.pickType);
      setBetType(pick.betType);
      setBookmaker(pick.bookmaker);
      setOdds(pick.odds.toString());
      setStake(pick.stake.toString());
      setDate(pick.date);
      setTime(pick.time);
      setResult(pick.result);
      setComments(pick.comments || '');
    } else {
      // Reset form for create mode
      resetForm();
    }
  }, [isEditMode, pick]);

  const resetForm = () => {
    setTipsterId('');
    setMatch('');
    setSport('');
    setPickType('');
    setBetType('');
    setBookmaker('');
    setOdds('');
    setStake('');
    setDate(new Date().toISOString().split('T')[0]); // Today's date
    setTime('');
    setResult('Pendiente');
    setComments('');
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!tipsterId) {
      setError('Selecciona un tipster');
      return false;
    }
    if (!match.trim()) {
      setError('Introduce el partido/evento');
      return false;
    }
    if (!sport) {
      setError('Selecciona un deporte');
      return false;
    }
    if (!pickType) {
      setError('Selecciona el tipo de pick');
      return false;
    }
    if (!betType.trim()) {
      setError('Introduce el tipo de apuesta');
      return false;
    }
    if (!bookmaker) {
      setError('Selecciona una casa de apuestas');
      return false;
    }
    
    const oddsNum = Number.parseFloat(odds);
    if (Number.isNaN(oddsNum) || oddsNum <= 1) {
      setError('La cuota debe ser mayor a 1.0');
      return false;
    }
    
    const stakeNum = Number.parseInt(stake, 10);
    if (Number.isNaN(stakeNum) || stakeNum < 1 || stakeNum > 10) {
      setError('El stake debe estar entre 1 y 10');
      return false;
    }
    
    if (!date) {
      setError('Selecciona una fecha');
      return false;
    }
    
    if (!time) {
      setError('Introduce la hora');
      return false;
    }

    setError(null);
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
      const dateTime = combineDateTimeISO(date, time);
      const isResolved = result !== 'Pendiente';

      if (isEditMode && pick && onUpdate) {
        // Edit mode
        const updateData: UpdatePickDTO = {
          tipsterId,
          match: match.trim(),
          sport,
          pickType,
          betType: betType.trim(),
          bookmaker,
          odds: Number.parseFloat(odds),
          stake: Number.parseInt(stake, 10),
          date,
          time,
          dateTime,
          result,
          isResolved,
          comments: comments.trim(),
        };

        await onUpdate(pick.id, updateData);
      } else {
        // Create mode
        const pickData: CreatePickDTO = {
          tipsterId,
          match: match.trim(),
          sport,
          pickType,
          betType: betType.trim(),
          bookmaker,
          odds: Number.parseFloat(odds),
          stake: Number.parseInt(stake, 10),
          date,
          time,
          dateTime,
          result,
          isResolved,
          comments: comments.trim(),
          status: 'No Seguido', // Default status
        };

        await createPick(pickData);
      }

      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la pick');
      console.error('Error saving pick:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Editar Pick' : 'Añadir Pick'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Tipster */}
        <div>
          <label htmlFor="tipster" className="block text-sm font-medium text-slate-300 mb-2">
            Tipster <span className="text-red-400">*</span>
          </label>
          <select
            id="tipster"
            value={tipsterId}
            onChange={(e) => setTipsterId(e.target.value)}
            className="w-full px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          >
            <option value="">Selecciona un tipster</option>
            {tipsters.map((tipster) => (
              <option key={tipster.id} value={tipster.id}>
                {tipster.name}
              </option>
            ))}
          </select>
        </div>

        {/* Match */}
        <div>
          <label htmlFor="match" className="block text-sm font-medium text-slate-300 mb-2">
            Partido/Evento <span className="text-red-400">*</span>
          </label>
          <Input
            id="match"
            type="text"
            value={match}
            onChange={(e) => setMatch(e.target.value)}
            placeholder="Ej: Real Madrid vs Barcelona"
            required
            disabled={loading}
          />
        </div>

        {/* Sport and Pick Type - Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sport" className="block text-sm font-medium text-slate-300 mb-2">
              Deporte <span className="text-red-400">*</span>
            </label>
            <select
              id="sport"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              <option value="">Selecciona deporte</option>
              {Object.values(Sport).map((sportValue) => (
                <option key={sportValue} value={sportValue}>
                  {sportValue}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pickType" className="block text-sm font-medium text-slate-300 mb-2">
              Tipo de Pick <span className="text-red-400">*</span>
            </label>
            <select
              id="pickType"
              value={pickType}
              onChange={(e) => setPickType(e.target.value)}
              className="w-full px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              <option value="">Selecciona tipo</option>
              {Object.values(PickType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bet Type */}
        <div>
          <label htmlFor="betType" className="block text-sm font-medium text-slate-300 mb-2">
            Tipo de Apuesta <span className="text-red-400">*</span>
          </label>
          <Input
            id="betType"
            type="text"
            value={betType}
            onChange={(e) => setBetType(e.target.value)}
            placeholder="Ej: Over 2.5, 1X2 Local, Ambos marcan"
            required
            disabled={loading}
          />
        </div>

        {/* Bookmaker, Odds and Stake - Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bookmaker" className="block text-sm font-medium text-slate-300 mb-2">
              Bookmaker <span className="text-red-400">*</span>
            </label>
            <select
              id="bookmaker"
              value={bookmaker}
              onChange={(e) => setBookmaker(e.target.value)}
              className="w-full px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              <option value="">Selecciona</option>
              {Object.values(Bookmaker).map((bookie) => (
                <option key={bookie} value={bookie}>
                  {bookie}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="odds" className="block text-sm font-medium text-slate-300 mb-2">
              Cuota <span className="text-red-400">*</span>
            </label>
            <Input
              id="odds"
              type="number"
              step="0.01"
              min="1.01"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              placeholder="1.85"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="stake" className="block text-sm font-medium text-slate-300 mb-2">
              Stake <span className="text-red-400">*</span>
            </label>
            <Input
              id="stake"
              type="number"
              min="1"
              max="10"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              placeholder="1-10"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Date and Time - Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-2">
              Fecha <span className="text-red-400">*</span>
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-slate-300 mb-2">
              Hora <span className="text-red-400">*</span>
            </label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Result */}
        <div>
          <label htmlFor="result" className="block text-sm font-medium text-slate-300 mb-2">
            Resultado <span className="text-red-400">*</span>
          </label>
          <select
            id="result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className="w-full px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          >
            {Object.values(PickResult).map((resultValue) => (
              <option key={resultValue} value={resultValue}>
                {resultValue}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-slate-500">
            Si el resultado no es "Pendiente", la pick se marcará como resuelta automáticamente
          </p>
        </div>

        {/* Comments */}
        <div>
          <label htmlFor="comments" className="block text-sm font-medium text-slate-300 mb-2">
            Comentarios (opcional)
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={3}
            className="w-full px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Añade notas o comentarios sobre esta pick..."
            disabled={loading}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {(() => {
              if (loading) return 'Guardando...';
              return isEditMode ? 'Actualizar Pick' : 'Añadir Pick';
            })()}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
