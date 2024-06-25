class Rooms {
  constructor(db) {
    this.db = db;
  }

  async createRoom(name, userId) {
    const result = await this.db.run('INSERT INTO rooms (name, created_by) VALUES (?, ?)', [name, userId]);
    return { id: result.lastID, name };
  }

  async joinRoom(roomId, userId) {
    const room = await this.db.get('SELECT * FROM rooms WHERE id = ?', [roomId]);
    if (!room) throw new Error('Room not found');
    return room;
  }
}

module.exports = Rooms;