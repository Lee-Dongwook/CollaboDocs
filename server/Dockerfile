# Node.js 이미지 사용

FROM node:18

WORKDIR /app

# package.json과 package-lock.json 파일을 복사, 의존성 설치

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start"]