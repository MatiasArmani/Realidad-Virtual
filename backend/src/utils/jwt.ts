import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { JWTPayload } from '@/types/auth';

export const generateTokens = (payload: Omit<JWTPayload, 'iat' | 'exp'>) => {
  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });

  const refreshToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
};

export const generateAccessToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};



