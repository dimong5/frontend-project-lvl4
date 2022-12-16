start-frontend:
	npx react-scripts start -timeout=1000

start-backend:
	npx start-server -p 5000

start:
	make start-backend & make start-frontend

install:
	npm install & npm i @hexlet/chat-server