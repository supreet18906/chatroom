class Auth {
  constructor(db) {
    this.db = db;
  }

  async register(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return { id: result.lastID, username };
  }

  async login(username, password) {
    const user = await this.db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) throw new Error('User not found');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Incorrect password');
    return { id: user.id, username: user.username };
  }
}

module.exports = Auth;