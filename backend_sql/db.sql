CREATE DATABASE Finite Lead

-- TABLES

CREATE TABLE Users(
    _id SERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    email VARCHAR(500) NOT NULL UNIQUE,
    phone VARCHAR(11) NOT NULL,
    address VARCHAR(1000),
    password VARCHAR(100) NOT NULL,
    role INT DEFAULT 0 NOT NULL,
    created_at VARCHAR(20) NOT NULL
)

CREATE TABLE Sales(
    _id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    client_name VARCHAR(500) NOT NULL,
    client_phone VARCHAR(15) NOT NULL,
    client_address VARCHAR(1000) NOT NULL,
    multiplier INT DEFAULT 1 NOT NULL,
    updated_multiplier INT,
    extraBonus INT DEFAULT 0 NOT NULL,
    create_at VARCHAR(20) NOT NULL,
    updated_at VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES Users(_id) ON DELETE CASCADE
)

CREATE TABLE Chat(
    _id SERIAL PRIMARY KEY,
    groupName VARCHAR(200) NOT NULL,
    latestMessage VARCHAR(2000),
    latestMessage_sender_id INT,
    latestMessage_sender_name VARCHAR(500),
    groupAdmin INT NOT NULL,
    FOREIGN KEY (groupAdmin) REFERENCES Users(_id),
    create_at VARCHAR(20) NOT NULL
)
CREATE TABLE Groups(
    _chatId INT NOT NULL,
    _userId INT NOT NULL,
    FOREIGN KEY (_chatId) REFERENCES Chat(_id),
    FOREIGN KEY (_userId) REFERENCES Users(_id)
)
CREATE TABLE Messages(
    _id SERIAL PRIMARY KEY,
    content VARCHAR(2000),
    _userId INT NOT NULL,
    _chatId INT NOT NULL,
    FOREIGN KEY (_chatId) REFERENCES Chat(_id),
    FOREIGN KEY (_userId) REFERENCES Users(_id),
    create_at VARCHAR(20) NOT NULL
)

-- CREATE TABLE latestMessage(
--     _id SERIAL PRIMARY KEY,
--     latest_message_content VARCHAR(2000),
--     _userId INT NOT NULL,
--     _chatId INT NOT NULL,
--     FOREIGN KEY (_chatId) REFERENCES Chat(_id),
--     FOREIGN KEY (_userId) REFERENCES Users(_id),
-- )

