class Messages {
  constructor(db) {
    this.db = db;
  }

  async sendMessage(roomId, userId, content) {
    const result = await this.db.run('INSERT INTO messages (room_id, user_id, content) VALUES (?, ?, ?)', [roomId, userId, content]);
    return { id: result.lastID, roomId, userId, content };
  }

  async getMessages(roomId) {
    return await this.db.all('SELECT * FROM messages WHERE room_id = ? ORDER BY timestamp ASC', [roomId]);
  }
}

module.exports = Messages;