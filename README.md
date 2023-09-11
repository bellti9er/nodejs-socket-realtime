# nodejs-socket-realtime

Socket.io와 Express 그리고 MongoDB를 이용하여 실시간 채팅 서버를 만들고, React를 사용하여 서버의 기능과 연동할 수 있는 웹을 구현합니다.

</br>

### 🚧 TODO 🚧

- refactoring in a structure for easy to write test codes
- write unit test

</br>

# Key Features

주요 기능은 다음과 같습니다.

- 새로운 유저 접속 시 알림 출력
- 닉네임 변경 가능
- 유저가 닉네임을 변경 했을 때 알림 출력
- 유저가 떠났을 경우 알림 출력
- 유저가 실시간으로 주고 받는 메세지 출력

</br>

mongoose를 활용하여 어플리케이션 레벨에서 스키마를 정의하고 MongoDB에 아래와 같은 데이터를 저장합니다.

- 채팅룸 정보
  - roomNumber
  - messages
- 메세지 정보
  - sender
  - content
  - chatRoom
- 유저 정보
  - username
  - roomNubmer
  - nicknameHistory

</br>

# Getting Started
1. Clone the repository

    ```shell
    $ git clone git@github.com:bellti9er/graphql-api-template.git

    $ git clone https://github.com/bellti9er/graphql-api-template.git
    ```


2. Install dependencies

    ```shell
    $ cd client
    $ npm install

    $ cd server
    $ npm install
    ```


3. Write `.env` file for your server environment

    ```txt
    . . . 
    ```


4. Build and run the project as local server

    ```shell
    $ cd server
    $ npm run dev

    $ cd client
    $ npm start
    ```

</br>

