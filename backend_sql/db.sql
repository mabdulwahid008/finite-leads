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

ALTER TABLE USERS ADD brokerage_name VARCHAR(250)
ALTER TABLE USERS ADD broker_name VARCHAR(150)
ALTER TABLE USERS ADD office_phone VARCHAR(11)
ALTER TABLE USERS ADD city VARCHAR(100)
ALTER TABLE USERS ADD country VARCHAR(100)
ALTER TABLE USERS ADD zip_code VARCHAR(100)
ALTER TABLE USERS ADD state VARCHAR(100)
ALTER TABLE USERS ADD service_radius VARCHAR(5)
ALTER TABLE USERS ADD re_license_no VARCHAR(150)
ALTER TABLE USERS ADD rep INT, ADD CONSTRAINT representative FOREIGN KEY(rep) REFERENCES USERS(_id);
ALTER TABLE USERS ADD active INT DEFAULT 1
ALTER TABLE USERS ADD profile_image VARCHAR(150)

CREATE TABLE SERVICE_AREAS(
    lat VARCHAR(20) NOT NULL,
    long VARCHAR(20) NOT NULL,
    realEstateAgent_id INT NOT NULL,
    FOREIGN KEY (realEstateAgent_id) REFERENCES USERS(_id) ON DELETE CASCADE
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



CREATE TABLE LEADS(
    _id SERIAL PRIMARY KEY, 
    lead_type INT DEFAULT 0,
    working_status INT DEFAULT 0,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    address VARCHAR(150) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    recording_link VARCHAR(300),
    beds FLOAT NOT NULL,
    baths FLOAT NOT NULL,
    price VARCHAR(100) NOT NULL,
    additional_info VARCHAR(500),
    agentName VARCHAR(100) NOT NULL,
    created_on VARCHAR(10) NOT NULL
)
ALTER TABLE LEADS ADD city VARCHAR(250)
ALTER TABLE LEADS ADD country VARCHAR(250)


CREATE TABLE LEAD_ASSIGNED_TO(
    lead_id INT NOT NULL,
    realEstateAgent_id INT NOT NULL,
    create_at VARCHAR(15) NOT NULL,
    current_status INT DEFAULT 99,
    viewed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (lead_id) REFERENCES Leads(_id) ON DELETE CASCADE,
    FOREIGN KEY (realEstateAgent_id) REFERENCES Users(_id) ON DELETE CASCADE
)

CREATE TABLE LEAD_COMMENTS(
    _id SERIAL PRIMARY KEY,
    lead_id INT NOT NULL,
    content VARCHAR(500),
    lead_status INT DEFAULT 0,
    realEstateAgent_id INT NOT NULL, 
    FOREIGN KEY (lead_id) REFERENCES Leads(_id) ON DELETE CASCADE,
    FOREIGN KEY (realEstateAgent_id) REFERENCES Users(_id) ON DELETE SET NULL
)

CREATE TABLE ANNOUNCEMENTS(
    _id SERIAL PRIMARY KEY, 
    image VARCHAR(150),
    for_user_role INT NOT NULL,
    created_at VARCHAR(10) NOT Null
)


CREATE TABLE RFA(
    _id SERIAL PRIMARY KEY,
    rfa VARCHAR(500) NOT NULL,
    comments VARCHAR(500),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USERS(_id) ON DELETE CASCADE 
)

CREATE TABLE QUERIES (
    _id SERIAL PRIMARY KEY,
    content VARCHAR(500) NOT NULL,
    sender_id INT NOT NULL,
    seen INT DEFAULT 0,
    reciver_id INT,
    FOREIGN KEY (sender_id) REFERENCES USERS(_id) ON DELETE CASCADE,
    FOREIGN KEY (reciver_id) REFERENCES USERS(_id) ON DELETE CASCADE
)