# TaskManagement

Trello風のタスク管理アプリ。カンバンボード形式でタスクを管理する。

## 技術スタック

| 領域 | 技術 |
|------|------|
| フロントエンド | React 19 / TypeScript 6.0 / Vite 8 |
| バックエンド | Spring Boot 3.5.0 / Java 21 |
| データベース | PostgreSQL 16（Docker） |

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

## ドキュメント

詳細は [docs/](docs/README.md) を参照。
