Bước 1: Cài mysql
- Cài mysql server 8.0.x tại "https://dev.mysql.com/downloads/mysql/"
- Cài Mysql Workbench 8.0. CE tại "https://dev.mysql.com/downloads/workbench/"
- Mở Mysql Workbench, import schema martKiot vào database mysql từ file "./smartKiot.sql"
- Lưu ý: nhớ password cho user "root" để config cho bước sau

Bước 2: Config mysql
- Mở file "./server/app/mysql/mysql.js"
- Nhập password tương ứng với user "root" của mysql server

Bước 3: install packages cho server và client
- Mở git bash tại folder smartKiot
- Chạy lệnh: "npm run all-install"
- Chờ cho đến khi install xong thì chuyển qua bước 4

Bước 4: Chạy demo
- Git bash tại folder smartKiot
- Chạy lệnh: "npm run dev"
- Chờ cho đến khi server start
- Đăng nhập với user: "admin", password: "12345"