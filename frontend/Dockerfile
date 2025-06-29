# frontend/Dockerfile  ★修正版
FROM node:20
WORKDIR /app

# lockfile だけ先にコピー
COPY package*.json ./
RUN npm install


# 残りをコピー
COPY . .

EXPOSE 3000

# dev スクリプトが無い場合は start をエイリアスに設定してから実行
CMD sh -c 'if ! npm run | grep -q " dev "; then npm pkg set scripts.dev="npm start"; fi && npm run dev'
