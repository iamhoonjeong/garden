import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as IOServer } from 'socket.io';

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

let serverCircles: { pos: number; vel: number }[] = [];

const addCircle = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (req.method === 'POST') {
    serverCircles.push(req.body);
    const circles = serverCircles;

    res.socket.server.io?.emit('circles', circles);
    res.status(201).json(circles);
  } else if (req.method === 'GET') {
    res.status(201).json(serverCircles);
  }
};

export default addCircle;
