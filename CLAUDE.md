# TaskManagement — Claude向け開発ルール

## 開発ワークフロー（必須）

**以下のフローを必ず守ること。ショートカットは禁止。**

1. **Issue作成** — 作業を始める前に必ずGitHub Issueを作成する
   ```bash
   gh issue create --title "タイトル" --body "内容" --label enhancement
   ```
2. **ブランチ作成** — Issue番号を使ってブランチを切る
   ```bash
   git checkout -b feature/#<issue番号>-<短い説明>
   ```
3. **作業・コミット** — そのブランチ上で作業してコミットする
4. **PR作成** — 作業完了後にPRを作成してmainへマージする
   ```bash
   gh pr create --title "タイトル" --body "closes #<issue番号>"
   ```
5. **mainへの直接commitおよびpushは絶対に禁止**

---

## ブランチ命名規則

| 種別 | 形式 | 例 |
|------|------|----|
| 機能追加 | `feature/#<番号>-<説明>` | `feature/#12-add-card-update-api` |
| バグ修正 | `fix/#<番号>-<説明>` | `fix/#15-fix-card-position-bug` |
| ドキュメント | `docs/#<番号>-<説明>` | `docs/#8-update-readme` |

---

## コミットメッセージ規則

```
<種別>: <変更内容の要約> (#<issue番号>)
```

| 種別 | 用途 |
|------|------|
| `feat` | 新機能追加 |
| `fix` | バグ修正 |
| `docs` | ドキュメント更新 |
| `refactor` | リファクタリング |
| `test` | テスト追加・修正 |

例: `feat: カード更新APIを追加 (#12)`

---

## 技術スタック・起動方法

- **バックエンド**: Spring Boot 3.5.0 / Java 21 / Gradle
- **フロントエンド**: React 19 / TypeScript 6.0 / Vite 8
- **DB**: PostgreSQL 16（Docker、ポート **5433**）

```bash
# DB起動
docker compose up -d

# バックエンド起動（backendディレクトリで）
java -Xms64m -Xmx192m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC \
  -jar build/libs/backend-0.0.1-SNAPSHOT.jar

# フロントエンド起動（frontendディレクトリで）
npm run dev
```

| サーバー | URL |
|---------|-----|
| フロントエンド | http://localhost:5173 |
| バックエンドAPI | http://localhost:8080/api |

> `./gradlew bootRun` はメモリ不足でクラッシュするため使用禁止。JARの直接実行を使うこと。

---

## アーキテクチャ

フロントエンドとバックエンドは分離構成。開発時はVite（5173）が `/api/**` リクエストをSpring Boot（8080）にプロキシ転送する（`frontend/vite.config.ts` 参照）。

```
frontend/src/
├── types.ts              # APIレスポンスの型定義（TaskList, Card）
├── App.tsx               # APIフェッチ・state管理のルート
├── Board.tsx             # リスト列の横並び・DnDコンテキスト
├── ListColumn.tsx        # 1列（リスト名＋カード一覧）
├── CardItem.tsx          # カード1枚
├── AddCardModal.tsx      # カード追加モーダル
├── EditCardModal.tsx     # カード編集モーダル
└── DeleteConfirmModal.tsx # 削除確認モーダル

backend/src/main/java/com/taskmanagement/
├── config/         # CorsConfig（全APIにCORSを適用）
├── controller/     # CardController, TaskListController
├── entity/         # Card, TaskList
└── repository/     # JPA Repository
```

- データは `App.tsx` でフェッチし、Props でコンポーネントツリーに流す
- バックエンドはJSONのみ返すREST API（HTMLは返さない）
- 型インポートは `import type { ... }` を使うこと（`verbatimModuleSyntax: true` のため）
