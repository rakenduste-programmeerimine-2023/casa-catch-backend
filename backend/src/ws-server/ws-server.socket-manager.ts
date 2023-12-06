import {Injectable, Logger} from "@nestjs/common";
import {Socket} from "socket.io";

/**
 * Represents the websocket connection pool manager,
 * which allows various use cases for the connected websockets.
 * @class WebsocketConnectionPoolManager
 */
@Injectable()
export class WebsocketConnectionPoolManager {

  private readonly logger: Logger = new Logger(WebsocketConnectionPoolManager.name)
  // Property is static to make sure there is only one connectionPool instance which makes the connection pool shared
  private static connectionPool: Map<string, Socket> = new Map<string, Socket>()

  public addConnection(client: Socket): void {
    WebsocketConnectionPoolManager.connectionPool.set(client.id, client)
  }

  public removeConnection(client: Socket): void {
    if (!client.connected) {
      this.logger.log(`Client with id: ${client.id} disconnected the websocket connection, removing the client from the pool...`)
    }
    WebsocketConnectionPoolManager.connectionPool.delete(client.id)
  }

  /**
   * Get the number of clients in the connection pool
   * @method getConnectionPoolSze
   * @returns {number} - number of connected clients
   */
  public getConnectionPoolSze(): number {
    return WebsocketConnectionPoolManager.connectionPool.size
  }

  /**
   * Get the entire connection pool Map<string, Socket> object
   * @method getConnectionPool
   * @returns Map<string, Socket>
   */
  public getConnectionPool(): Map<string, Socket> {
    return WebsocketConnectionPoolManager.connectionPool
  }

  /**
   * Get the client from the connection pool if exists, otherwise returns null
   * @method getClientFromConnectionPool
   * @param {Socket} client - client socket instance
   * @returns {Socket | null}
   */
  public getClientFromConnectionPool(client: Socket): Socket | null {
    return WebsocketConnectionPoolManager.connectionPool.get(client.id) || null
  }

}