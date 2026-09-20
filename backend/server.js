const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Randomized splitting core mathematical engine staying below the 2000 INR barrier
function generateNineteen99Chunks(totalAmount) {
    const MAX_CHUNK = 1950.00; // Left a safe buffer below 1999
    const MIN_CHUNK = 1000.00;
    let chunks = [];
    let remaining = totalAmount;

    while (remaining > MAX_CHUNK) {
        let maxPossible = Math.min(MAX_CHUNK, remaining - 100);
        
        if (maxPossible <= MIN_CHUNK) {
            let half = +(remaining / 2).toFixed(2);
            chunks.push(half);
            remaining = +(remaining - half).toFixed(2);
            break;
        }

        let chunk = +(Math.random() * (maxPossible - MIN_CHUNK) + MIN_CHUNK).toFixed(2);
        chunks.push(chunk);
        remaining = +(remaining - chunk).toFixed(2);
    }
    
    if (remaining > 0) {
        chunks.push(+(remaining).toFixed(2));
    }
    return chunks;
}

// 1. Endpoint: Initiates payment intent matrix mapping
app.post('/api/v1/payments/nineteen99-split', (req, res) => {
    const { amount, merchantVpa } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: "Invalid bill amount specified." });
    }

    const orderRecord = db.createOrder(Number(amount), merchantVpa || "unknown@upi");
    const rawChunks = generateNineteen99Chunks(orderRecord.totalAmount);
    const finalizedChunks = db.registerChunks(orderRecord.id, rawChunks);
    
    res.json({
        engine: "Nineteen99 Core v1.0",
        success: true,
        orderId: orderRecord.id,
        grandTotal: orderRecord.totalAmount,
        chunks: finalizedChunks.map(c => ({ id: c.id, amount: c.amount, status: c.status }))
    });
});

// 2. Endpoint: Mutates individual transaction block token status states post-banking intent execution
app.patch('/api/v1/payments/verify-chunk', (req, res) => {
    const { chunkId, transactionStatus } = req.body; // transactionStatus = SUCCESS or FAILED
    if (!chunkId || !['SUCCESS', 'FAILED'].includes(transactionStatus)) {
        return res.status(400).json({ success: false, error: "Malformed mutation payload parameters." });
    }

    const updatedChunk = db.updateChunkStatus(chunkId, transactionStatus);
    if (!updatedChunk) {
        return res.status(404).json({ success: false, error: "Target transactional chunk token footprint not found." });
    }

    const completeStateTree = db.getOrderStateTree(updatedChunk.orderId);
    res.json({
        success: true,
        message: "State ledger synchronization unified successfully.",
        currentStateTree: completeStateTree
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Nineteen99 Production Engine operational on port ${PORT}`));
