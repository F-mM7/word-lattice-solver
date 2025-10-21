import React from 'react';

interface GridSizeInputProps {
  rows: number;
  cols: number;
  onRowsChange: (rows: number) => void;
  onColsChange: (cols: number) => void;
}

export const GridSizeInput: React.FC<GridSizeInputProps> = ({
  rows,
  cols,
  onRowsChange,
  onColsChange,
}) => {
  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 10) {
      onRowsChange(value);
    }
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 10) {
      onColsChange(value);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>格子サイズ</h2>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <label>
          行数:
          <input
            type="number"
            min="1"
            max="10"
            value={rows}
            onChange={handleRowsChange}
            style={{ marginLeft: '10px', width: '60px' }}
          />
        </label>
        <label>
          列数:
          <input
            type="number"
            min="1"
            max="10"
            value={cols}
            onChange={handleColsChange}
            style={{ marginLeft: '10px', width: '60px' }}
          />
        </label>
      </div>
    </div>
  );
};
