/**
 * Drive API のクエリ文字列を生成する
 *
 * 1階層目の要素を and で結合、2階層目の要素を or で結合する
 *
 * @param query クエリ
 * @returns クエリ文字列
 */
export function queryToText(query: (string | string[])[]): string {
  return query
    .map((q) => (Array.isArray(q) ? `( ${q.join(' or ')} )` : q))
    .join(' and ')
}
