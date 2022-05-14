/**
 * Drive API のクエリ文字列を生成する
 *
 * 1階層目の要素を and で結合、2階層目の要素を or で結合する
 *
 * @param query クエリ
 * @returns クエリ文字列
 */
export function queryToText(query: (string | string[])[]): string {
  return (
    query
      // 2階層目から空の要素を削除
      .map((q) => (Array.isArray(q) ? q.filter((o) => o !== '') : q))
      // 1階層目から空の要素を削除
      .filter((q) => (Array.isArray(q) ? q.length > 0 : q !== ''))
      // 2階層目を or で結合
      .map((q) => (Array.isArray(q) ? `( ${q.join(' or ')} )` : q))
      // 1階層目と結合済みの2階層目を and で結合
      .join(' and ')
  )
}
