import React, { useMemo } from 'react';
import { validateWords } from '../utils/validation';
import { solveGrid } from '../solver/gridSolver';
import { GridVisualization } from './GridVisualization';

interface SolutionDisplayProps {
  rows: number;
  cols: number;
  words: string[][];
}

export const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
  words,
}) => {
  // 入力検証
  const validation = useMemo(() => validateWords(words), [words]);

  // 解の計算（検証が成功した場合）
  const solutions = useMemo(() => {
    if (!validation.isValid) {
      return [];
    }
    return solveGrid(words);
  }, [validation.isValid, words]);

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>解</h2>

      {/* 検証エラーの表示 */}
      {!validation.isValid && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#c62828' }}>
            入力エラー
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {validation.errors.map((error, index) => (
              <li key={index} style={{ color: '#c62828' }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 検証が成功した場合 */}
      {validation.isValid && (
        <>
          {/* 解が存在しない場合 */}
          {solutions.length === 0 && (
            <div
              style={{
                padding: '15px',
                backgroundColor: '#fff3e0',
                border: '1px solid #ff9800',
                borderRadius: '4px',
              }}
            >
              <p style={{ margin: 0, color: '#e65100' }}>
                解が見つかりませんでした。別の単語を試してください。
              </p>
            </div>
          )}

          {/* 解が存在する場合 */}
          {solutions.length > 0 && (
            <div>
              <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                {solutions.length >= 10
                  ? '10個以上の解が存在します（最初の10個を表示）'
                  : `${solutions.length}個の解が見つかりました`}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                {solutions.map((solution, index) => (
                  <GridVisualization
                    key={index}
                    solution={solution}
                    solutionIndex={index + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
