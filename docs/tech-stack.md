# 技術スタック

[← ドキュメント一覧に戻る](README.md)

---

## バックエンド

| 項目 | 技術・バージョン |
|------|----------------|
| 言語 | Java 21 |
| フレームワーク | Spring Boot 3.5.0 |
| ビルドツール | Gradle 8.14.4 |
| ORM | Spring Data JPA / Hibernate 6.6 |
| データベース | PostgreSQL 16 |
| コンテナ | Docker（docker compose） |

## フロントエンド

| 項目 | 技術・バージョン |
|------|----------------|
| 言語 | TypeScript 6.0 |
| UIライブラリ | React 19 |
| ビルドツール | Vite 8 |

## アーキテクチャ

```
ブラウザ（React）
    ↓ HTTP（JSON）
Spring Boot（REST API）
    ↓ JPA
PostgreSQL
```

- フロントエンドとバックエンドは分離構成
- 開発時：Vite dev server（5173）がAPIリクエストをSpring Boot（8080）へプロキシ転送
- フロントエンドはJSONを受け取って画面を描画する

## 起動方法

```bash
# 1. DB起動
docker compose up -d

# 2. バックエンド起動（backend/ ディレクトリ）
java -Xms64m -Xmx192m -XX:MaxMetaspaceSize=128m -XX:+UseSerialGC \
  -jar build/libs/backend-0.0.1-SNAPSHOT.jar

# 3. フロントエンド起動（frontend/ ディレクトリ）
npm run dev
```

| サーバー | URL |
|---------|-----|
| フロントエンド | http://localhost:5173 |
| バックエンドAPI | http://localhost:8080/api |
