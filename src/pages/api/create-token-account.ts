// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress
} from "@solana/spl-token"
import { Keypair, PublicKey, Transaction } from "@solana/web3.js"
import { connection } from "constants/cluster"
import { base58 } from "ethers/lib/utils"
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
  success: boolean
  message?: string
}

const secret = base58.decode(
  "43HrWveQwPrHzQ1kLmneWn6qmt7qULiUaN7grCetixw7TvtGL1BDAvD3SjX1JGe2GdBpBVsZb3936vG8VK7Fdg6y"
)
const keypair = Keypair.fromSecretKey(secret)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      const { recipientAddress, targetTokenAddress } = req.body
      if (!recipientAddress || !targetTokenAddress) {
        res
          .status(400)
          .json({ success: false, message: "Missing required fields" })
        return
      }
      const recipientbalance = await connection.getBalance(
        new PublicKey(recipientAddress)
      )
      if (recipientbalance / 1e9 < 0.1) {
        try {
          await connection.requestAirdrop(
            new PublicKey(recipientAddress),
            0.2e9
          )
        } catch (e) {}
      }
      const recipientTokenAddress = await getAssociatedTokenAddress(
        new PublicKey(targetTokenAddress),
        new PublicKey(recipientAddress),
        true
      )

      const receipientTokenAccountInfo = await connection.getAccountInfo(
        recipientTokenAddress,
        "confirmed"
      )
      if (receipientTokenAccountInfo) {
        // commented console.log("Recipient token account exist on solana")
        return res.status(200).json({ success: true })
      }
      // commented console.log("Recipient token account doesn't exist on solana")
      const txn = new Transaction()
      txn.add(
        createAssociatedTokenAccountInstruction(
          keypair.publicKey,
          recipientTokenAddress,
          new PublicKey(recipientAddress),
          new PublicKey(targetTokenAddress)
        )
      )
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash()
      txn.recentBlockhash = blockhash
      txn.lastValidBlockHeight = lastValidBlockHeight
      txn.feePayer = keypair.publicKey
      txn.partialSign(keypair)
      const signature = await connection.sendRawTransaction(txn.serialize())
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      })
      res.status(200).json({ success: true })
    } catch (e) {
      // commented console.log(e)
      res.status(200).json({ success: false })
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" })
  }
}
