// Nineteen99 Core Ledger Engine (Silicon Valley Spec: In-Memory Atomic Storage)
class LedgerDatabase {
    constructor() {
        this.orders = new Map();
        this.chunks = new Map();
    }

    // Creates the master parent order record
    createOrder(amount, merchantVpa) {
        const orderId = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const orderRecord = {
            id: orderId,
            totalAmount: Number(amount),
            merchantVpa: merchantVpa,
            status: 'INITIALIZED', // INITIALIZED, PARTIAL, COMPLETED, FAILED
            createdAt: new Date().toISOString()
        };
        this.orders.set(orderId, orderRecord);
        return orderRecord;
    }

    // Registers the individual randomized split blocks mapped to the parent order
    registerChunks(orderId, chunkList) {
        const registeredChunks = chunkList.map((amt, index) => {
            const chunkId = `CHK_${orderId}_${index + 1}`;
            const chunkRecord = {
                id: chunkId,
                orderId: orderId,
                amount: amt,
                status: 'PENDING', // PENDING, SUCCESS, FAILED
                updatedAt: new Date().toISOString()
            };
            this.chunks.set(chunkId, chunkRecord);
            return chunkRecord;
        });
        return registeredChunks;
    }

    // Atomic state transition mutation to verify a single payment block execution
    updateChunkStatus(chunkId, status) {
        const chunk = this.chunks.get(chunkId);
        if (!chunk) return null;

        chunk.status = status;
        chunk.updatedAt = new Date().toISOString();
        this.chunks.set(chunkId, chunk);

        // Cascade verification update to parent order state automatically
        this._reconcileOrderStatus(chunk.orderId);
        return chunk;
    }

    // Internal reconciliation loop to verify absolute payment completeness
    _reconcileOrderStatus(orderId) {
        const parentOrder = this.orders.get(orderId);
        if (!parentOrder) return;

        const allChunks = Array.from(this.chunks.values()).filter(c => c.orderId === orderId);
        const successCount = allChunks.filter(c => c.status === 'SUCCESS').length;
        const failedCount = allChunks.filter(c => c.status === 'FAILED').length;

        if (successCount === allChunks.length) {
            parentOrder.status = 'COMPLETED';
        } else if (failedCount > 0 || successCount > 0) {
            parentOrder.status = 'PARTIAL';
        }

        this.orders.set(orderId, parentOrder);
    }

    // Fetches the entire operational matrix state tree for state resumption queries
    getOrderStateTree(orderId) {
        const order = this.orders.get(orderId);
        if (!order) return null;

        const dynamicChunks = Array.from(this.chunks.values()).filter(c => c.orderId === orderId);
        return {
            ...order,
            chunks: dynamicChunks
        };
    }
}

const dbInstance = new LedgerDatabase();
module.exports = dbInstance;
