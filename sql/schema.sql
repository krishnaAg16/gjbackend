
-- Participants Table
CREATE TABLE participants (
    participant_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    college VARCHAR(100)
);

-- Events Table
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    committee VARCHAR(50) NOT NULL,
    price INT NOT NULL CHECK (price >= 0)
);

-- Transactions Table
CREATE TABLE transactions (
    tid VARCHAR(30) PRIMARY KEY,
    participant_id VARCHAR(20) NOT NULL,
    events JSON NOT NULL,  -- array of event IDs, optional depending on frontend
    amount INT NOT NULL CHECK (amount >= 0),
    upi VARCHAR(30), -- slightly increased in case of long UPI IDs
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id)
);

-- Participant_Events Join Table
CREATE TABLE participant_events (
    participant_id VARCHAR(20) NOT NULL,
    tid VARCHAR(30) NOT NULL,
    event_id INT NOT NULL,

    PRIMARY KEY (participant_id, event_id),
    FOREIGN KEY (participant_id) REFERENCES participants(participant_id) ON DELETE CASCADE,
    FOREIGN KEY (tid) REFERENCES transactions(tid) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);
