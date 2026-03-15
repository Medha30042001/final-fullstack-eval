import supabase from "../config/supabaseClient.js";

export const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({
      message: "User balance fetched",
      balance: data.balance,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getStatement = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({
      message: "Statement fetched",
      statement: data || [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const makeTransfer = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id, amount } = req.body;

    if (!receiver_id?.trim()) {
      return res.status(400).json({ error: "Receiver is required" });
    }

    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        error: "Amount must be greater than 0",
      });
    }

    if (senderId === receiver_id) {
      return res.status(400).json({
        error: "Sender and receiver cannot be same",
      });
    }

    // fetch sender
    const { data: sender, error: senderErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", senderId)
      .single();

    if (senderErr) return res.status(500).json({ error: senderErr.message });
    if (!sender) return res.status(404).json({ error: "Sender not found" });

    // fetch receiver
    const { data: receiver, error: receiverErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", receiver_id)
      .single();

    if (receiverErr)
      return res.status(500).json({ error: receiverErr.message });
    if (!receiver)
      return res.status(404).json({ error: "Receiver not found" });

    if (Number(sender.balance) < parsedAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const newSenderBalance = Number(sender.balance) - parsedAmount;
    const newReceiverBalance = Number(receiver.balance) + parsedAmount;

    // update balances
    const { error: sendErr } = await supabase
      .from("users")
      .update({ balance: newSenderBalance })
      .eq("id", senderId);

    if (sendErr) return res.status(500).json({ error: sendErr.message });

    const { error: receiveErr } = await supabase
      .from("users")
      .update({ balance: newReceiverBalance })
      .eq("id", receiver_id);

    if (receiveErr)
      return res.status(500).json({ error: receiveErr.message });

    // insert ledger entries
    const { data: txns, error: txnErr } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: senderId,
          other_user_id: receiver_id,
          amount: parsedAmount,
          transaction_type: "debit",
          balance_after: newSenderBalance,
        },
        {
          user_id: receiver_id,
          other_user_id: senderId,
          amount: parsedAmount,
          transaction_type: "credit",
          balance_after: newReceiverBalance,
        },
      ])
      .select();

    if (txnErr) return res.status(500).json({ error: txnErr.message });

    return res.status(201).json({
      message: "Transfer successful",
      transactions: txns,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, balance")
      .neq("id", currentUserId);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({
      message: "Users fetched successfully",
      users: data || [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};