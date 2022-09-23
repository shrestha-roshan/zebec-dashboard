import React, { FC, useContext } from "react"
import { useTranslation } from "next-i18next"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { setLoading, togglePauseModal } from "features/modals/pauseModalSlice"
import { pauseStreamNative, pauseStreamToken } from "application/normal"
import { Modal, Button } from "components/shared"
import ZebecContext from "app/zebecContext"
import { useZebecWallet } from "hooks/useWallet"
import {
  BSC_ZEBEC_BRIDGE_ADDRESS,
  ZebecEthBridgeClient
} from "@jettxcypher/zebec-wormhole-sdk"
import { useSigner } from "wagmi"
import { getEVMToWormholeChain } from "constants/wormholeChains"

const PauseModal: FC = ({}) => {
  const { t } = useTranslation("transactions")
  const { stream, token } = useContext(ZebecContext)
  const dispatch = useAppDispatch()
  const walletObject = useZebecWallet()
  const { data: signer } = useSigner()

  const { show, loading, transaction } = useAppSelector((state) => state.pause)

  const handleSolanaPause = async () => {
    dispatch(setLoading(true))
    // data
    const data = {
      sender: transaction.sender,
      receiver: transaction.receiver,
      escrow: transaction.pda
    }

    const transaction_uuid = transaction.uuid
    if (transaction.token === "SOL")
      stream && dispatch(pauseStreamNative(data, transaction_uuid, stream))
    else token && dispatch(pauseStreamToken(data, transaction_uuid, token))
  }
  const handleEVMPause = async () => {
    if (!signer) return
    const messengerContract = new ZebecEthBridgeClient(
      BSC_ZEBEC_BRIDGE_ADDRESS,
      signer,
      getEVMToWormholeChain(walletObject.chainId)
    )
    console.log("pda-data:", transaction)
    const tx = await messengerContract.pauseTokenStream(
      transaction.sender,
      transaction.receiver,
      transaction.token_mint_address,
      transaction.pda
    )
    console.log("tx:", tx)
  }

  const handlePauseTransaction = () => {
    if (walletObject.chainId === "solana") {
      handleSolanaPause()
    } else {
      handleEVMPause()
    }
  }

  return (
    <Modal
      show={show}
      toggleModal={() => dispatch(togglePauseModal())}
      className="rounded "
      hasCloseIcon={false}
      size="small"
    >
      {
        <>
          <div className="text-content-primary text-subtitle font-semibold ">
            {t("modal-actions.pause-modal-header")}
          </div>
          <div className="pt-3 pb-3">
            <Button
              disabled={loading}
              loading={loading}
              className={`w-full`}
              variant="gradient"
              title={
                loading
                  ? `${t("modal-actions.pausing")}`
                  : `${t("modal-actions.yes-pause")}`
              }
              onClick={handlePauseTransaction}
            />
          </div>
          <div className="">
            <Button
              className={`w-full`}
              disabled={loading}
              title={`${t("modal-actions.no-pause")}`}
              onClick={() => {
                dispatch(togglePauseModal())
              }}
            />
          </div>
        </>
      }
    </Modal>
  )
}
export default PauseModal
