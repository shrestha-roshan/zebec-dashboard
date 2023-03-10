import { login } from "api"
import TokenService from "api/services/token.service"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Modal, Tab } from "components/shared"
import { changeSignState } from "features/common/commonSlice"
import type { NextPage } from "next"
import { useTranslation } from "next-i18next"
import { useEffect, useState } from "react"
import jwt_decode from "jwt-decode"
import { SolanaWallet } from "components/shared/Wallet/SolanaWallet"
import { EthereumWallet } from "components/shared/Wallet/EthereumWallet"
import { Token } from "components/shared/Token"
import { useZebecWallet } from "hooks/useWallet"
import { useAccount, useConnect, useDisconnect, useSwitchNetwork } from "wagmi"

interface DecodedTokenProps {
  token_type: string
  exp: number
  iat: number
  jti: string
  wallet_address: string
}

const tabs = [
  {
    title: "Solana",
    icon: <Token symbol="SOL" />,
    count: 0,
    Component: <SolanaWallet className="mt-8" />
  },
  {
    title: "EVM",
    icon: <Token symbol="ETH" />,
    count: 2,
    Component: <EthereumWallet />
  }
]

const chainId = process.env.RPC_NETWORK === "mainnet" ? "56" : "97"

const WalletNotConnectedModal: NextPage = () => {
  const { t } = useTranslation("common")
  const walletObject = useZebecWallet()
  const [activeTab, setActiveTab] = useState<number>(0)
  const { disconnect } = useDisconnect()
  const { connect } = useConnect()
  const { connector } = useAccount()
  const { switchNetwork } = useSwitchNetwork({
    chainId: Number(chainId),
    onSuccess: () => {
      disconnect()
      setTimeout(() => {
        connect({ connector })
      }, 500)
    }
  })

  const [isInitialized, setIsInitialized] = useState(false)
  const [isLedgerWallet, setIsLedgerWallet] = useState(false)
  const { isSigned } = useAppSelector((state) => state.common)
  const dispatch = useAppDispatch()

  const handleLogin: () => void = async () => {
    const response = await login(walletObject, isLedgerWallet)
    if (response?.status === 200) {
      dispatch(changeSignState(true))
    }
  }

  useEffect(() => {
    if (walletObject.connected && walletObject.adapter === "Ledger")
      setIsLedgerWallet(true)
    // eslint-disable-next-line
  }, [walletObject.connected])

  useEffect(() => {
    if (walletObject.connected) {
      const token = TokenService.getLocalAccessToken()
      if (!token) {
        if (
          walletObject.adapter &&
          walletObject.network !== "solana" &&
          walletObject.chainId === chainId
        ) {
          handleLogin()
        }
        if (walletObject.chainId !== chainId) {
          switchNetwork?.()
        }
      } else {
        if (
          walletObject.network !== "solana" &&
          walletObject.chainId !== chainId
        ) {
          switchNetwork?.()
          return
        }
        const decodedToken: DecodedTokenProps = jwt_decode(token)
        if (
          decodedToken.wallet_address === walletObject.publicKey?.toString()
        ) {
          dispatch(changeSignState(!!token))
        } else {
          handleLogin()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletObject.connected, isSigned, walletObject.adapter])

  useEffect(() => {
    setTimeout(() => {
      setIsInitialized(true)
    }, 1000)
  }, [])

  return (
    <>
      {isInitialized && (
        <Modal
          show={!walletObject.connected || !isSigned}
          toggleModal={() => null}
          className="rounded-2xl pb-6 max-w-[398px] text-center"
          hasCloseIcon={false}
        >
          <span className="text-content-primary text-2xl font-semibold">
            {t("wallet-not-connected.title")}
          </span>
          <div className="flex items-center pt-2">
            {tabs.map((tab, index) => {
              return (
                <Tab
                  key={tab.title}
                  type="solid"
                  title={`${t(tab.title)}`}
                  isActive={activeTab === index}
                  onClick={() => setActiveTab(index)}
                  startIcon={tab.icon}
                  className="w-1/2 justify-center"
                />
              )
            })}
          </div>
          {tabs[activeTab].Component}
        </Modal>
      )}
    </>
  )
}

export default WalletNotConnectedModal
