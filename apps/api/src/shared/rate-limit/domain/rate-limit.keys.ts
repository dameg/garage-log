export const rateLimitKeys = {
  tokenBucket: (subject: string) => `rl:tb:${subject}`,
  slidingWindow: (subject: string) => `rl:sw:${subject}`,
};

export const rateLimitSubjects = {
  user: (userId: string) => `user:${userId}`,
  ip: (ip: string) => `ip:${ip}`,
  login: (email: string, ip: string) => `login:${email.toLowerCase()}:${ip}`,
};
