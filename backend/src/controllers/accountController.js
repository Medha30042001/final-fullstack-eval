import supabase from "../config/supabaseClient.js";

export const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select("balance")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

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

    const { data: statement, error } = await supabase
      .from("transactions")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Statement fetched",
      statement: statement || [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const makeTransfer = async (req, res) => {
  try {
    const sender_id = req.user.id;
    const { receiver_id, amount } = req.body;

    if (!receiver_id?.trim()) {
      return res.status(400).json({ error: "Receiver is required" });
    }

    const parsedAmount = Number(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ error: "Amount must be greater than 0" });
    }

    if (sender_id === receiver_id) {
      return res.status(400).json({
        error: "Sender and receiver should not be the same",
      });
    }

    // get sender
    const { data: sender, error: senderErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", sender_id)
      .single();

    if (senderErr) {
      return res.status(500).json({ error: senderErr.message });
    }

    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    // get receiver
    const { data: receiver, error: receiverErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", receiver_id)
      .single();

    if (receiverErr) {
      return res.status(500).json({ error: receiverErr.message });
    }

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    if (Number(sender.balance) < parsedAmount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    const newSenderBalance = Number(sender.balance) - parsedAmount;
    const newReceiverBalance = Number(receiver.balance) + parsedAmount;

    // update sender balance
    const { error: sendErr } = await supabase
      .from("users")
      .update({ balance: newSenderBalance })
      .eq("id", sender_id);

    if (sendErr) {
      return res.status(500).json({ error: sendErr.message });
    }

    // update receiver balance
    const { error: receiveErr } = await supabase
      .from("users")
      .update({ balance: newReceiverBalance })
      .eq("id", receiver_id);

    if (receiveErr) {
      return res.status(500).json({ error: receiveErr.message });
    }

    // insert both debit and credit entries
    const { data: transaction, error: transferErr } = await supabase
      .from("transactions")
      .insert([
        {
          sender_id,
          receiver_id,
          amount: parsedAmount,
          transaction_type: "debit",
        },
        {
          sender_id,
          receiver_id,
          amount: parsedAmount,
          transaction_type: "credit",
        },
      ])
      .select();

    if (transferErr) {
      return res.status(500).json({ error: transferErr.message });
    }

    return res.status(201).json({
      message: "Transaction made",
      transaction,
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

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Users fetched successfully",
      users: data || [],
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};