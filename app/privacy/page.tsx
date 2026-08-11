export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-gray-500 mb-8">最終更新日：2026年5月29日</p>

      <section className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-2">1. はじめに</h2>
          <p>
            本プライバシーポリシーは、Osaka Camp Finder（以下「本アプリ」）が収集する情報と、
            その取り扱いについて説明します。本アプリを利用することで、本ポリシーに同意したものとみなします。
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-2">2. 収集する情報</h2>
          <p className="mb-2">本アプリは以下の情報を収集します。</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>訪問記録（キャンプ場名・訪問日・評価・メモ）：ユーザーが入力した場合のみ</li>
            <li>匿名ユーザーID：アプリ起動時に自動生成される識別子（個人を特定する情報は含まれません）</li>
            <li>お気に入り情報：端末ローカルに保存（サーバーに送信されません）</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-2">3. 収集しない情報</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>氏名・メールアドレスなどの個人情報</li>
            <li>位置情報（GPS）</li>
            <li>連絡先・写真ライブラリへのアクセス</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-2">4. 情報の利用目的</h2>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>訪問記録の保存・表示</li>
            <li>アプリ機能の提供・改善</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-2">5. 第三者提供</h2>
          <p className="mb-2">収集した情報は、以下のサービスを利用して処理・保存します。</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>
              <span className="font-medium">Supabase</span>
              （データベース・認証）：
              <a href="https://supabase.com/privacy" className="text-green-700 underline ml-1" target="_blank" rel="noopener noreferrer">
                プライバシーポリシー
              </a>
            </li>
          </ul>
          <p className="mt-2">上記以外の第三者に情報を販売・提供することはありません。</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-2">6. データの保存と削除</h2>
          <p>
            訪問記録はSupabaseのサーバーに保存されます。
            アプリを削除した場合、端末内のお気に入りデータは削除されますが、
            Supabase上の訪問記録は引き続き保存されます。
            データの削除を希望する場合は、下記の連絡先までお問い合わせください。
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-2">7. 子どものプライバシー</h2>
          <p>
            本アプリは13歳未満の方を対象としていません。
            13歳未満のユーザーから意図的に情報を収集することはありません。
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-2">8. ポリシーの変更</h2>
          <p>
            本ポリシーは予告なく変更される場合があります。
            変更後はこのページに掲載し、最終更新日を更新します。
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 text-base mb-2">9. お問い合わせ</h2>
          <p>
            本プライバシーポリシーに関するご質問は、以下のメールアドレスまでご連絡ください。
          </p>
          <p className="mt-1 font-medium text-gray-900">jojima516@gmail.com</p>
        </div>
      </section>
    </div>
  )
}
