declare namespace Express {
  interface Request {
    user?: import('../../models/user.model').IUser,
    token?: { sub: string, role: string }
  }
}
