export const getIO = () => {
  if (!(globalThis as any)._io) {
    throw new Error("Socket.io not initialized");
  }
  return (globalThis as any)._io;
};