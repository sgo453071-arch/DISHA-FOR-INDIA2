const { Server } = require('socket.io');
const jwt = require('../utils/jwt');
const User = require('../modules/user/user.model');

let io = null;
const onlineUsers = new Map();
const TYPING_TIMEOUT_MS = 3000;

const getSocketServer = () => io;

const getOnlineUsers = () => Array.from(onlineUsers.keys());

const broadcastToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId.toString()}`).emit(event, data);
  }
};

const broadcastToConversation = (conversationId, event, data) => {
  if (io) {
    io.to(`conversation:${conversationId}`).emit(event, data);
  }
};

const broadcastToAll = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

const logSocketEvent = (event, userId, data = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Socket] ${event}`, { userId, ...data });
  }
};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    path: '/socket.io/',
  });

  io.engine.on('headers', (headers, req) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.accessToken;
    if (token) {
      headers['set-cookie'] = undefined;
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      const decoded = jwt.verify(token);
      const user = await User.findById(decoded.id).select('-password -refreshToken');

      if (!user || user.status === 'SUSPENDED') {
        return next(new Error('Authentication error: User not found or suspended'));
      }

      socket.user = user;
      return next();
    } catch (_err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;

    socket.join(`user:${user._id.toString()}`);
    onlineUsers.set(user._id.toString(), { userId: user._id.toString(), name: user.name, email: user.email, socketId: socket.id });
    io.emit('user-online', { userId: user._id.toString(), name: user.name, email: user.email, online: true });
    logSocketEvent('connect', user._id.toString(), { socketId: socket.id });

    socket.on('join-room', (conversationId) => {
      if (!conversationId || typeof conversationId !== 'string') return;
      socket.join(`conversation:${conversationId}`);
      logSocketEvent('join-room', user._id.toString(), { conversationId });
    });

    socket.on('leave-room', (conversationId) => {
      if (!conversationId || typeof conversationId !== 'string') return;
      socket.leave(`conversation:${conversationId}`);
      logSocketEvent('leave-room', user._id.toString(), { conversationId });
    });

    socket.on('typing', ({ conversationId }) => {
      if (!conversationId || typeof conversationId !== 'string') return;
      socket.to(`conversation:${conversationId}`).emit('typing', {
        userId: user._id.toString(),
        conversationId,
        name: user.name,
      });
      logSocketEvent('typing', user._id.toString(), { conversationId });
    });

    socket.on('stop-typing', ({ conversationId }) => {
      if (!conversationId || typeof conversationId !== 'string') return;
      socket.to(`conversation:${conversationId}`).emit('stop-typing', {
        userId: user._id.toString(),
        conversationId,
      });
      logSocketEvent('stop-typing', user._id.toString(), { conversationId });
    });

    socket.on('message-read', async ({ conversationId, messageId }) => {
      if (!conversationId || !messageId) return;
      socket.to(`conversation:${conversationId}`).emit('message-read', {
        userId: user._id.toString(),
        conversationId,
        messageId,
      });

      try {
        const Message = require('../modules/message/message.model');
        await Message.updateOne(
          { _id: messageId, conversationId },
          {
            $set: { status: 'read' },
            $addToSet: { readBy: { userId: user._id, readAt: new Date() } },
          }
        );
      } catch (err) {
        console.error('Error updating message status to read:', err);
      }
      logSocketEvent('message-read', user._id.toString(), { conversationId, messageId });
    });

    socket.on('message-delivered', async ({ conversationId, messageId }) => {
      if (!conversationId || !messageId) return;
      socket.to(`conversation:${conversationId}`).emit('message-delivered', {
        userId: user._id.toString(),
        conversationId,
        messageId,
      });

      try {
        const Message = require('../modules/message/message.model');
        await Message.updateOne(
          { _id: messageId, conversationId, status: 'sent' },
          { $set: { status: 'delivered' } }
        );
      } catch (err) {
        console.error('Error updating message status to delivered:', err);
      }
      logSocketEvent('message-delivered', user._id.toString(), { conversationId, messageId });
    });

    socket.on('disconnect', (reason) => {
      onlineUsers.delete(user._id.toString());
      io.emit('user-offline', { userId: user._id.toString(), name: user.name, email: user.email, online: false });
      socket.leave(`user:${user._id.toString()}`);
      logSocketEvent('disconnect', user._id.toString(), { reason });
    });
  });

  io.on('reconnect', () => {
    logSocketEvent('reconnect', 'server', { timestamp: new Date().toISOString() });
  });

  return io;
};

module.exports = {
  initializeSocket,
  getSocketServer,
  broadcastToUser,
  broadcastToConversation,
  broadcastToAll,
  getOnlineUsers,
  logSocketEvent,
};
