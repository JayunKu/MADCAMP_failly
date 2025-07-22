import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

describe('Chat Matching E2E Test with "미룸" tag', () => {
  let userA: any, userB: any;
  let socketA: Socket, socketB: Socket;
  const API_URL = 'http://localhost:3000';
  const TAG = '미룸'; // Use the existing "미룸" tag

  beforeAll(async () => {
    // Create two test users
    userA = await prisma.user.create({
      data: {
        nickname: 'UserA_E2E_Mirum',
        email: 'usera.e2e.mirum@example.com',
        password: 'password123',
      },
    });

    userB = await prisma.user.create({
      data: {
        nickname: 'UserB_E2E_Mirum',
        email: 'userb.e2e.mirum@example.com',
        password: 'password123',
      },
    });
  });

  afterAll(async () => {
    // Disconnect sockets
    if (socketA) socketA.disconnect();
    if (socketB) socketB.disconnect();

    // Clean up database
    // Note: We are not deleting the "미룸" badge as it's pre-existing
    await prisma.failPost.deleteMany({ where: { user_id: { in: [userA.id, userB.id] } } });
    await prisma.user.deleteMany({ where: { id: { in: [userA.id, userB.id] } } });
    await prisma.$disconnect();
  });

  it('should connect two users, have them post with the "미룸" tag, and receive a match event', (done) => {
    let matchEventCount = 0;
    const checkDone = () => {
      matchEventCount++;
      if (matchEventCount === 2) {
        done();
      }
    };

    // Connect User A
    socketA = io(API_URL);
    socketA.on('connect', () => {
      console.log('Socket A connected');
      socketA.emit('register_user', { userId: userA.id });
    });
    socketA.on('matched', (data) => {
      console.log('Socket A received matched event:', data);
      // Check if roomId is a valid UUID string (length 36)
      expect(typeof data.roomId).toBe('string');
      expect(data.roomId.length).toBe(36);
      expect(data.users.some(u => u.userId === userA.id)).toBe(true);
      expect(data.users.some(u => u.userId === userB.id)).toBe(true);
      checkDone();
    });

    // Connect User B
    socketB = io(API_URL);
    socketB.on('connect', () => {
      console.log('Socket B connected');
      socketB.emit('register_user', { userId: userB.id });
    });
    socketB.on('matched', (data) => {
      console.log('Socket B received matched event:', data);
      // Check if roomId is a valid UUID string (length 36)
      expect(typeof data.roomId).toBe('string');
      expect(data.roomId.length).toBe(36);
      expect(data.users.some(u => u.userId === userA.id)).toBe(true);
      expect(data.users.some(u => u.userId === userB.id)).toBe(true);
      checkDone();
    });

    // Stagger the API calls slightly to ensure sockets are registered
    setTimeout(async () => {
      try {
        // User A creates a post
        await axios.post(`${API_URL}/failposts`, {
          user_id: userA.id,
          text: 'User A is waiting with "미룸".',
          tag: TAG,
        });
        console.log('User A created a post with tag "미룸".');

        // User B creates a post, triggering the match
        await axios.post(`${API_URL}/failposts`, {
          user_id: userB.id,
          text: 'User B is joining with "미룸".',
          tag: TAG,
        });
        console.log('User B created a post with tag "미룸".');
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error('API call failed:', errorMessage);
        done.fail(new Error(errorMessage));
      }
    }, 1000); // 1-second delay
  }, 10000); // 10-second timeout for the test
});
