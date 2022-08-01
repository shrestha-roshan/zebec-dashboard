import * as Icons from "assets/icons"
import { Button } from "components/shared"
import { nftLists } from "fakedata"
import Image from "next/image"
import { FC, useState } from "react"
import { twMerge } from "tailwind-merge"
import { toSubstring } from "utils"
import { NFTDetail, NFTEach } from "./NFTEach"

export const NFTsList: FC<{
  className?: string
  nft: NFTDetail | undefined
  onChange?: (detail: NFTDetail | undefined) => void
}> = ({ className, onChange, nft }) => {
  const [nftChoosed, setNFTChoosed] = useState<NFTDetail>()
  return (
    <div
      className={twMerge(
        "lg:ml-8 mt-8 lg:mt-0 flex flex-col justify-center text-content-primary flex-1",
        className ?? ""
      )}
    >
      {(!nft || nft?.address === "") && (
        <div className="flex flex-wrap justify-start gap-4">
          {nftLists.map((item) => (
            <NFTEach
              key={item.address}
              detail={item}
              onChange={(detail) => onChange && onChange(detail)}
              onChoose={(detail) => setNFTChoosed(detail)}
              isChoosed={nftChoosed?.address === item.address}
            />
          ))}
        </div>
      )}
      {nft?.address && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-content-secondary">NFT Info:</div>
          <div>
            <Image
              src={nft.image}
              className="rounded"
              alt={nft.name}
              width={262}
              height={262}
            />
          </div>
          <div className="flex flex-col gap-1 items-center text-content-secondary">
            <p className="text-subtitle font-semibold">{nft.name}</p>
            <p className="flex items-center">
              {toSubstring(nft.address, 5, true)}
            </p>
          </div>
          <Button
            size="small"
            title={`Select Another NFT`}
            onClick={() => onChange && onChange(undefined)}
            startIcon={<Icons.EditIcon className="text-content-contrast" />}
          />
        </div>
      )}
    </div>
  )
}