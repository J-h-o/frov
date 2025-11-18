import { useState, useEffect, useRef, useCallback } from 'react';
import Peer, { DataConnection } from 'peerjs';
import type { MultiplayerMessage } from './types';

interface UseMultiplayerOptions {
  onMessage?: (message: MultiplayerMessage) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

interface UseMultiplayerReturn {
  peerId: string | null;
  isConnected: boolean;
  isHost: boolean;
  error: string | null;
  createRoom: () => string | null;
  joinRoom: (roomCode: string) => void;
  sendMessage: (message: MultiplayerMessage) => void;
  disconnect: () => void;
}

export function useMultiplayer(options: UseMultiplayerOptions = {}): UseMultiplayerReturn {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const connectionRef = useRef<DataConnection | null>(null);

  // Initialize peer
  useEffect(() => {
    const peer = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    });

    peer.on('open', (id) => {
      console.log('Peer ID:', id);
      setPeerId(id);
      setError(null);
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      setError(err.message || 'Connection error');
    });

    // Listen for incoming connections (when someone joins your room)
    peer.on('connection', (conn) => {
      console.log('Incoming connection from:', conn.peer);
      connectionRef.current = conn;
      setupConnection(conn);
    });

    peerRef.current = peer;

    return () => {
      disconnect();
      peer.destroy();
    };
  }, []);

  const setupConnection = (conn: DataConnection) => {
    conn.on('open', () => {
      console.log('Connection established');
      setIsConnected(true);
      setError(null);
      options.onConnected?.();
    });

    conn.on('data', (data) => {
      const message = data as MultiplayerMessage;
      options.onMessage?.(message);
    });

    conn.on('close', () => {
      console.log('Connection closed');
      setIsConnected(false);
      options.onDisconnected?.();
    });

    conn.on('error', (err) => {
      console.error('Connection error:', err);
      setError('Connection error');
      setIsConnected(false);
    });
  };

  const createRoom = useCallback((): string | null => {
    if (!peerId) {
      setError('Peer not initialized yet');
      return null;
    }

    setIsHost(true);
    setError(null);
    console.log('Room created with code:', peerId);
    return peerId;
  }, [peerId]);

  const joinRoom = useCallback((roomCode: string) => {
    if (!peerRef.current) {
      setError('Peer not initialized');
      return;
    }

    console.log('Joining room:', roomCode);
    setIsHost(false);
    setError(null);

    try {
      const conn = peerRef.current.connect(roomCode, {
        reliable: true,
      });

      connectionRef.current = conn;
      setupConnection(conn);
    } catch (err) {
      console.error('Failed to join room:', err);
      setError('Failed to join room');
    }
  }, []);

  const sendMessage = useCallback((message: MultiplayerMessage) => {
    if (connectionRef.current && connectionRef.current.open) {
      connectionRef.current.send(message);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    setIsConnected(false);
    setIsHost(false);
  }, []);

  return {
    peerId,
    isConnected,
    isHost,
    error,
    createRoom,
    joinRoom,
    sendMessage,
    disconnect,
  };
}
