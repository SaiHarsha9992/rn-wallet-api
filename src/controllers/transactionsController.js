import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
        try{
            const { userId } = req.params;
            const transactions = await sql`
                SELECT * FROM transactions WHERE user_id = ${userId}
                ORDER BY created_at DESC;
            `;
            res.status(200).json(transactions); 
        } catch(err){
            console.error("Error fetching transactions:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    
}

export async function createTransaction(req, res) {
 
        
        try {
            const { user_id, title, amount, category } = req.body;
            if(!title || amount === undefined || !category || !user_id) {
                return res.status(400).json({ error: "All fields are required" });
            } 
            const transaction = await sql`
                INSERT INTO transactions (user_id, title, amount, category)
                VALUES (${user_id}, ${title}, ${amount}, ${category})
                RETURNING *;
            `;
            console.log("Transaction inserted:", transaction);
            res.status(201).json(transaction[0]);
        } catch (err) {
            console.error("Error inserting transaction:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
   
}

export async function deleteTransaction(req, res) {
  
       try {
           const { id } = req.params;
           const result = await sql`
               DELETE FROM transactions WHERE id = ${id}
               RETURNING *;
           `;
           if (result.length === 0) {
               return res.status(404).json({ error: "Transaction not found" });
           }
           res.status(200).json({ message: "Transaction deleted successfully", transaction: result[0] });
       } catch (err) {
           console.error("Error deleting transaction:", err);
           res.status(500).json({ error: "Internal Server Error" });
       }
   
}

export async function getSummaryByUserId(req, res) {
    try {
        const { userId } = req.params;
       const summary = await sql`
    SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId};
`;

        const incomeResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0;
        `;
        const expensesResult = await sql`
            SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount < 0;
        `;
        res.status(200).json({
            balance: summary[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].income
        });
    } catch (err) {
        console.error("Error fetching summary:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }

}