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

export const useWithdrawDepositForm = ({
  tokens,
  type = "deposit"
}: UseWithdrawDepositFormOptions) => {
  const [currentToken, setCurrentToken] = useState<{
    symbol: string
    image: string
  }>(
    tokens[0] || {
      symbol: "",
      image: ""
    }
  )

  useEffect(() => {
    if (tokens.length > 0) {
      setCurrentToken(tokens[0])
    }
  }, [tokens])

  const [show, toggle, setToggle] = useToggle(false)

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required(`transactions:${type}.enter-${type}-amount`)
      .test(
        "is-not-zero",
        `transactions:${type}.not-zero`,
        (value) => typeof value === "string" && parseFloat(value) > 0
      )
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
    trigger
  } = useForm({
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
    trigger
  }
}
