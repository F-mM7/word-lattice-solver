import React from 'react';

interface GridVisualizationProps {
  solution: string[][];  // (rows+1) × (cols+1) の格子点配置
  solutionIndex: number; // 解の番号（表示用）
}

export const GridVisualization: React.FC<GridVisualizationProps> = ({
  solution,
  solutionIndex,
}) => {
  const cols = solution[0]?.length || 0;

  return (
    <div
      style={{
        display: 'inline-block',
        padding: '15px',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        margin: '10px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h3 style={{ marginTop: 0, color: '#4CAF50' }}>解 {solutionIndex}</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 40px)`,
          gap: '0',
        }}
      >
        {solution.map((row, i) =>
          row.map((char, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
                border: '1px solid #333',
                color: '#000',
              }}
            >
              {char}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
