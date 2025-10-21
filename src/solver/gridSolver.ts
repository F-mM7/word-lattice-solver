/**
 * 単語格子ソルバー
 * バックトラッキングを使用して全ての解を探索
 */

/**
 * 4文字の単語が、周囲4つの格子点から構成できるかチェック
 * @param word - 4文字の単語
 * @param chars - 4つの文字配列（左上、右上、左下、右下の順）
 * @returns 構成可能ならtrue
 */
function canFormWord(word: string, chars: (string | null)[]): boolean {
  // nullがある場合は判定不可
  if (chars.some(c => c === null)) {
    return true; // まだ未確定なので可能性として残す
  }

  // 文字の出現回数をカウント
  const wordChars = word.split('');
  const availableChars = chars.filter((c): c is string => c !== null);

  // 出現回数をマップで管理
  const wordCharCount = new Map<string, number>();
  const availableCharCount = new Map<string, number>();

  for (const char of wordChars) {
    wordCharCount.set(char, (wordCharCount.get(char) || 0) + 1);
  }

  for (const char of availableChars) {
    availableCharCount.set(char, (availableCharCount.get(char) || 0) + 1);
  }

  // 両者が一致するかチェック
  if (wordCharCount.size !== availableCharCount.size) {
    return false;
  }

  for (const [char, count] of wordCharCount) {
    if (availableCharCount.get(char) !== count) {
      return false;
    }
  }

  return true;
}

/**
 * 単語格子の解を全て求める
 * @param words - rows × cols の単語配列（各単語は4文字）
 * @param maxSolutions - 最大解の数（デフォルト: 10）
 * @returns 解の配列（各解は(rows+1) × (cols+1)の格子点配置）
 */
export function solveGrid(words: string[][], maxSolutions: number = 10): string[][][] {
  const rows = words.length;
  const cols = words[0]?.length || 0;

  if (rows === 0 || cols === 0) {
    return [];
  }

  const gridRows = rows + 1;
  const gridCols = cols + 1;
  const solutions: string[][][] = [];
  const MAX_SOLUTIONS = maxSolutions;

  // 格子点の配列を初期化（null = 未確定）
  const grid: (string | null)[][] = Array(gridRows)
    .fill(null)
    .map(() => Array(gridCols).fill(null));

  // 各単語から使用される文字セットを事前に計算（空文字列は空配列に）
  const wordChars: string[][][] = words.map(row =>
    row.map(word => word ? word.split('') : [])
  );

  // 入力済みのセルの位置を記録
  const filledCells: [number, number][] = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (words[i][j] && words[i][j].trim() !== '') {
        filledCells.push([i, j]);
      }
    }
  }

  /**
   * セル(row, col)の周囲4つの格子点の座標を取得
   */
  function getCellCorners(row: number, col: number): [number, number][] {
    return [
      [row, col],         // 左上
      [row, col + 1],     // 右上
      [row + 1, col],     // 左下
      [row + 1, col + 1], // 右下
    ];
  }

  /**
   * 現在の格子状態で、指定セルが条件を満たすかチェック
   */
  function checkCell(row: number, col: number): boolean {
    const word = words[row][col];
    // 空のセルはチェック不要
    if (!word || word.trim() === '') {
      return true;
    }
    const corners = getCellCorners(row, col);
    const chars = corners.map(([r, c]) => grid[r][c]);
    return canFormWord(word, chars);
  }

  /**
   * 現在の格子点位置までで、全てのセルが条件を満たすかチェック
   */
  function isValid(gridRow: number, gridCol: number): boolean {
    // 格子点(gridRow, gridCol)に影響を受けるセルをチェック
    const cellsToCheck: [number, number][] = [];

    // 左上のセル
    if (gridRow > 0 && gridCol > 0) {
      cellsToCheck.push([gridRow - 1, gridCol - 1]);
    }
    // 右上のセル
    if (gridRow > 0 && gridCol < cols) {
      cellsToCheck.push([gridRow - 1, gridCol]);
    }
    // 左下のセル
    if (gridRow < rows && gridCol > 0) {
      cellsToCheck.push([gridRow, gridCol - 1]);
    }
    // 右下のセル
    if (gridRow < rows && gridCol < cols) {
      cellsToCheck.push([gridRow, gridCol]);
    }

    // 影響を受ける全てのセルが条件を満たすかチェック
    for (const [r, c] of cellsToCheck) {
      if (!checkCell(r, c)) {
        return false;
      }
    }

    return true;
  }

  /**
   * バックトラッキングで全ての解を探索
   */
  function backtrack(gridRow: number, gridCol: number): boolean {
    // 解の上限に達したら探索を打ち切り
    if (solutions.length >= MAX_SOLUTIONS) {
      return true; // 打ち切りフラグ
    }

    // 全ての格子点を埋めた場合
    if (gridRow === gridRows) {
      // 解として記録（ディープコピー）
      const solution = grid.map(row =>
        row.map(cell => cell as string)
      );
      solutions.push(solution);
      return solutions.length >= MAX_SOLUTIONS;
    }

    // 次の格子点の位置を計算
    let nextRow = gridRow;
    let nextCol = gridCol + 1;
    if (nextCol === gridCols) {
      nextCol = 0;
      nextRow++;
    }

    // 現在の格子点で使用可能な文字のセットを取得
    const possibleChars = getPossibleChars(gridRow, gridCol);

    // 各文字を試す
    for (const char of possibleChars) {
      grid[gridRow][gridCol] = char;

      // 制約を満たすかチェック
      if (isValid(gridRow, gridCol)) {
        const shouldStop = backtrack(nextRow, nextCol);
        if (shouldStop) {
          grid[gridRow][gridCol] = null;
          return true; // 探索を打ち切り
        }
      }

      // バックトラック
      grid[gridRow][gridCol] = null;
    }

    return false;
  }

  /**
   * 格子点(gridRow, gridCol)で使用可能な文字のセットを取得
   */
  function getPossibleChars(gridRow: number, gridCol: number): Set<string> {
    const chars = new Set<string>();

    // この格子点に隣接するセルから使用される可能性のある文字を収集
    const adjacentCells: [number, number][] = [];

    // 左上のセル
    if (gridRow > 0 && gridCol > 0) {
      adjacentCells.push([gridRow - 1, gridCol - 1]);
    }
    // 右上のセル
    if (gridRow > 0 && gridCol < cols) {
      adjacentCells.push([gridRow - 1, gridCol]);
    }
    // 左下のセル
    if (gridRow < rows && gridCol > 0) {
      adjacentCells.push([gridRow, gridCol - 1]);
    }
    // 右下のセル
    if (gridRow < rows && gridCol < cols) {
      adjacentCells.push([gridRow, gridCol]);
    }

    // 各セルの文字を収集（入力済みのセルのみ）
    for (const [r, c] of adjacentCells) {
      const word = words[r][c];
      if (word && word.trim() !== '') {
        for (const char of wordChars[r][c]) {
          chars.add(char);
        }
      }
    }

    // 隣接するセルに入力済みのものがない場合は、全てのひらがなを候補とする
    if (chars.size === 0) {
      // 入力済みの全セルから文字を収集
      for (const [r, c] of filledCells) {
        for (const char of wordChars[r][c]) {
          chars.add(char);
        }
      }
    }

    return chars;
  }

  // バックトラッキング開始
  backtrack(0, 0);

  return solutions;
}
