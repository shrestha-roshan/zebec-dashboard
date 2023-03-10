import { yupResolver } from "@hookform/resolvers/yup"
import { TokenDetails } from "features/tokenDetails/tokenDetailsSlice.d"
import { useToggle } from "hooks/useToggle"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
// import { getBalance } from "utils/getBalance"
import * as Yup from "yup"

interface UseWithdrawDepositFormOptions {
  tokens: TokenDetails[]
  type?: "deposit" | "withdraw"
}

interface InputData {
  amount: string
  balance: string
}

export const useWithdrawDepositForm = ({
  tokens,
  type = "deposit"
}: UseWithdrawDepositFormOptions) => {
  const [currentToken, setCurrentToken] = useState<{
    symbol: string
    image: string
    mint: string
    decimal: number
    coingeckoId: string
  }>(
    tokens[0] || {
      symbol: "",
      image: "",
      mint: "",
      decimal: 0,
      coingeckoId: ""
    }
  )

  useEffect(() => {
    if (tokens.length > 0 && currentToken.symbol === "") {
      setCurrentToken(tokens[0])
    }
  }, [tokens, currentToken])

  const [show, toggle, setToggle] = useToggle(false)

  const validationSchema = Yup.object().shape({
    balance: Yup.string(),
    amount: Yup.string()
      .required(`transactions:${type}.enter-${type}-amount`)
      .test(
        "is-not-zero",
        `transactions:${type}.not-zero`,
        (value) => typeof value === "string" && parseFloat(value) > 0
      )
      .test("max-amount", `validation:${type}-max-amount`, (value, context) => {
        return (
          !context.parent.balance || Number(value) <= context.parent.balance
        )
      })
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
    trigger,
    reset
  } = useForm<InputData>({
    mode: "onChange",
    resolver: yupResolver(validationSchema)
  })

  return {
    currentToken,
    setCurrentToken,
    show,
    toggle,
    setToggle,
    errors,
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    getValues,
    trigger,
    reset
  }
}
