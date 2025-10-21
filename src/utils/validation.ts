import { ValidationResult } from '../solver/types';

/**
 * 単語配列を検証
 */
export function validateWords(words: string[][]): ValidationResult {
  const errors: string[] = [];
  let hasAnyWord = false;

  // 各単語が4文字かチェック
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words[i].length; j++) {
      const word = words[i][j];
      if (word && word.trim() !== '') {
        hasAnyWord = true;
        if (word.length !== 4) {
          errors.push(`行${i + 1}列${j + 1}の単語は4文字である必要があります（現在: ${word.length}文字）`);
        }
      }
    }
  }

  // 単語が1つも入力されていない場合はエラー
  if (!hasAnyWord) {
    errors.push('少なくとも1つの単語を入力してください');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
