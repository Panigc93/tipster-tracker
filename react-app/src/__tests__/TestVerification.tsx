/**
 * @fileoverview Componente de test para verificar que todos los imports y funcionalidades funcionan
 */

import { useEffect, useCallback } from 'react';
import type { Pick, Sport, Channel, PickResult } from '@shared/types';
import {
  ALL_SPORTS,
  ALL_CHANNELS,
  ALL_BOOKMAKERS,
  CHART_COLORS,
  getSportIcon,
  isValidSport,
  getChartColor,
  generateChartColors,
} from '@shared/constants';
import {
  formatDate,
  isValidDate,
  getCurrentDate,
  getCurrentTime,
  formatRelativeDate,
  calculatePickProfit,
  calculateYield,
  calculateWinrate,
  calculateTipsterStats,
  formatNumber,
  formatPercentage,
  formatCurrency,
  formatUnits,
  formatProfit,
  truncateText,
  capitalize,
  isValidEmail,
  isValidOdds,
  isValidStake,
  isNotEmpty,
  isInRange,
} from '@shared/utils';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export const TestVerification = () => {
  // eslint-disable-next-line max-lines-per-function
  const runTests = useCallback((): void => {
    const results: TestResult[] = [];

    // Test 1: Types
    try {
      const testSport: Sport = 'Fútbol';
      const testChannel: Channel = 'Telegram';
      const testResult: PickResult = 'Ganada';
      results.push({
        name: 'Test 1: Types',
        passed: testSport === 'Fútbol' && testChannel === 'Telegram' && testResult === 'Ganada',
        message: `Sport: ${testSport}, Channel: ${testChannel}, Result: ${testResult}`,
      });
    } catch (error) {
      results.push({
        name: 'Test 1: Types',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 2: Constants
    try {
      const sportsCount = ALL_SPORTS.length;
      const channelsCount = ALL_CHANNELS.length;
      const bookmakersCount = ALL_BOOKMAKERS.length;
      const icon = getSportIcon('Fútbol');
      const colors = CHART_COLORS.length;
      const validSport = isValidSport('Fútbol');

      results.push({
        name: 'Test 2: Constants',
        passed: sportsCount > 0 && channelsCount > 0 && bookmakersCount > 0 && validSport,
        message: `${sportsCount} deportes, ${channelsCount} canales, ${bookmakersCount} bookmakers, ${colors} colores, icono: ${icon}`,
      });
    } catch (error) {
      results.push({
        name: 'Test 2: Constants',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 3: Date Utils
    try {
      const today = getCurrentDate();
      const now = getCurrentTime();
      const formatted = formatDate('2025-01-15');
      const relative = formatRelativeDate('2025-11-16');
      const valid = isValidDate('2025-01-15');

      results.push({
        name: 'Test 3: Date Utils',
        passed: today.length > 0 && now.length > 0 && valid,
        message: `Hoy: ${today}, Ahora: ${now}, Formato: ${formatted}, Relativa: ${relative}`,
      });
    } catch (error) {
      results.push({
        name: 'Test 3: Date Utils',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 4: Calculation Utils
    try {
      const mockPick: Pick = {
        id: 'test-1',
        uid: 'test-user',
        tipsterId: 'test-tipster',
        sport: 'Fútbol',
        match: 'Real Madrid vs Barcelona',
        betType: '1X2 - Local',
        odds: 1.85,
        stake: 3,
        pickType: 'Pre',
        date: '2025-01-15',
        time: '20:00',
        dateTime: '2025-01-15T20:00:00Z',
        bookmaker: 'Bet365',
        result: 'Ganada',
        isResolved: true,
        comments: '',
      };

      const profit = calculatePickProfit(mockPick);
      const yieldValue = calculateYield(100, 500);
      const winrate = calculateWinrate(15, 20);

      // Usar tolerancia para números flotantes
      const profitOk = Math.abs(profit - 2.55) < 0.01;
      const yieldOk = Math.abs(yieldValue - 20) < 0.01;
      const winrateOk = Math.abs(winrate - 75) < 0.01;

      results.push({
        name: 'Test 4: Calculation Utils',
        passed: profitOk && yieldOk && winrateOk,
        message: `Profit: ${profit.toFixed(2)}u (expected: 2.55), Yield: ${yieldValue.toFixed(2)}% (expected: 20), Winrate: ${winrate.toFixed(2)}% (expected: 75)`,
      });
    } catch (error) {
      results.push({
        name: 'Test 4: Calculation Utils',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 5: Format Utils
    try {
      const num = formatNumber(1234.567, 2);
      const perc = formatPercentage(75.5);
      const curr = formatCurrency(1234.56);
      const units = formatUnits(5.5);
      const profitPos = formatProfit(50.5);
      const profitNeg = formatProfit(-20.75);
      const cap = capitalize('hola mundo');
      const trunc = truncateText('Texto muy largo para mostrar', 10);

      results.push({
        name: 'Test 5: Format Utils',
        passed: num.length > 0 && perc.includes('%') && cap === 'Hola mundo',
        message: `Número: ${num}, Porcentaje: ${perc}, Moneda: ${curr}, Unidades: ${units}, +Profit: ${profitPos}, -Profit: ${profitNeg}, Capitalize: ${cap}, Truncate: ${trunc}`,
      });
    } catch (error) {
      results.push({
        name: 'Test 5: Format Utils',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 6: Validation Utils
    try {
      const validEmail = isValidEmail('test@example.com');
      const invalidEmail = !isValidEmail('invalid');
      const validOdds = isValidOdds(1.85);
      const invalidOdds = !isValidOdds(0.5);
      const validStake = isValidStake(5);
      const invalidStake = !isValidStake(11);
      const notEmpty = isNotEmpty('hello');
      const empty = !isNotEmpty('   ');
      const inRange = isInRange(5, 1, 10);

      results.push({
        name: 'Test 6: Validation Utils',
        passed:
          validEmail &&
          invalidEmail &&
          validOdds &&
          invalidOdds &&
          validStake &&
          invalidStake &&
          notEmpty &&
          empty &&
          inRange,
        message: 'Todas las validaciones pasaron correctamente',
      });
    } catch (error) {
      results.push({
        name: 'Test 6: Validation Utils',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 7: Chart Colors
    try {
      const colors = generateChartColors(5);
      const color0 = getChartColor(0);
      const color15 = getChartColor(15);

      results.push({
        name: 'Test 7: Chart Colors',
        passed: colors.length === 5 && color0.length > 0 && color15.length > 0,
        message: `5 colores generados, Color 0: ${color0}, Color 15: ${color15}`,
      });
    } catch (error) {
      results.push({
        name: 'Test 7: Chart Colors',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Test 8: Statistics
    try {
      const mockPick: Pick = {
        id: 'test-1',
        uid: 'test-user',
        tipsterId: 'test-tipster',
        sport: 'Fútbol',
        match: 'Real Madrid vs Barcelona',
        betType: '1X2 - Local',
        odds: 1.85,
        stake: 3,
        pickType: 'Pre',
        date: '2025-01-15',
        time: '20:00',
        dateTime: '2025-01-15T20:00:00Z',
        bookmaker: 'Bet365',
        result: 'Ganada',
        isResolved: true,
        comments: '',
      };

      const stats = calculateTipsterStats([mockPick]);

      results.push({
        name: 'Test 8: Statistics',
        passed:
          stats.totalPicks === 1 &&
          stats.resolvedPicks === 1 &&
          stats.wonPicks === 1 &&
          stats.winrate === 100,
        message: `Total: ${stats.totalPicks}, Resolved: ${stats.resolvedPicks}, Won: ${stats.wonPicks}, Winrate: ${stats.winrate}%, Yield: ${stats.yield.toFixed(2)}%`,
      });
    } catch (error) {
      results.push({
        name: 'Test 8: Statistics',
        passed: false,
        message: `Error: ${error}`,
      });
    }

    // Print results
    console.log('🧪 Resultados de las pruebas:\n');
    for (const result of results) {
      const icon = result.passed ? '✅' : '❌';
      console.log(`${icon} ${result.name}: ${result.message}`);
    }

    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    console.log(`\n📊 Total: ${passedCount}/${totalCount} pruebas pasaron`);

    if (passedCount === totalCount) {
      console.log('🎉 ¡Todas las pruebas pasaron correctamente!');
      console.log('✅ Fase 1 está completamente funcional\n');
    } else {
      console.log('⚠️ Algunas pruebas fallaron');
    }
  }, []);

  useEffect(() => {
    runTests();
  }, [runTests]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🧪 Test de Verificación - Fase 1
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Instrucciones:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Abre la consola del navegador (F12)</li>
            <li>Observa los resultados de las pruebas</li>
            <li>
              Verifica que todos los tests pasen (✅) sin errores
            </li>
          </ol>
        </div>

        <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-300">
            ℹ️ Información
          </h3>
          <p className="text-gray-300 mb-3">
            Este componente verifica que todos los módulos de la Fase 1 estén funcionando
            correctamente:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Types (TypeScript)</li>
            <li>Constants (Sports, Channels, Bookmakers, Charts)</li>
            <li>Date Utils (Formateo y validación de fechas)</li>
            <li>Calculation Utils (Yield, Winrate, Statistics)</li>
            <li>Format Utils (Números, moneda, texto)</li>
            <li>Validation Utils (Email, odds, stakes)</li>
            <li>Chart Utils (Colores y configuración)</li>
            <li>Statistics (Cálculo completo de estadísticas)</li>
          </ul>
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>React App - Tipster Tracker</p>
          <p className="text-sm">Fase 1: Fundamentos y Abstracciones</p>
        </div>
      </div>
    </div>
  );
};
