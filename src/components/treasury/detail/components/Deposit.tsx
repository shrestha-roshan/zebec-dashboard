/* eslint-disable @next/next/no-img-element */
import { useAppSelector } from "app/hooks";
import * as Icons from "assets/icons";
import { Button, CollapseDropdown, InputField } from "components/shared";
import { useClickOutside } from "hooks";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import { getBalance } from "utils/getBalance";

export const Deposit = () => {
  const { t } = useTranslation();
  const tokensDropdownWrapper = useRef(null);

  const [searchData, setSearchData] = useState("");
  const [toggleTokensDropdown, setToggleTokensDropdown] =
    useState<boolean>(false);
  const tokenDetails = useAppSelector((state) => state.tokenDetails.tokens);
  const walletTokens =
    useAppSelector((state) => state.zebecBalance.tokens) || [];
  const [currentToken, setCurrentToken] = useState(
    tokenDetails[0] || {
      symbol: "",
      image: "",
    }
  );
  const [amount, setAmount] = useState("");

  const handleClose = () => setToggleTokensDropdown(false);

  //handle clicking outside
  useClickOutside(tokensDropdownWrapper, {
    onClickOutside: handleClose,
  });

  const handleMaxClick = () => {
    setAmount(getBalance(walletTokens, currentToken.symbol).toString());
  };

  useEffect(() => {
    if (tokenDetails.length > 0) {
      setCurrentToken(tokenDetails[0]);
    }
  }, [tokenDetails]);

  return (
    <>
      <p className="leading-4 text-xs font-normal text-content-contrast mb-[24px]">
        {t("treasuryOverview:deposit-description")}
      </p>
      <InputField
        label={t("treasuryOverview:token")}
        className="mb-[24px] relative text-content-primary"
        error={false}
      >
        <div>
          <div
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => setToggleTokensDropdown((prev) => !prev)}
            className="absolute left-2.5 top-2"
            aria-disabled
          >
            <div className="relative flex cursor-pointer  w-[104px] justify-center items-center h-[40px] text-content-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {currentToken.image && (
                <img
                  className="w-[18px] h-[18px]"
                  src={currentToken.image}
                  alt={currentToken.symbol}
                />
              )}
              <div className="max-w-[68px] ml-[5px] overflow-x-hidden text-content-primary">
                {currentToken.symbol}
              </div>
              <Icons.CheveronDownIcon className="text-sm w-7" />
            </div>
          </div>
          <div ref={tokensDropdownWrapper}>
            <CollapseDropdown
              className="w-full left-0 mt-5 "
              show={toggleTokensDropdown}
              variant="light"
            >
              <div>
                <div className="w-48 px-3.5 py-3">
                  <Icons.SearchIcon className="text-lg absolute left-5 top-3.5 text-content-secondary" />
                  <input
                    className="is-search w-full  h-6 bg-background-primary"
                    placeholder="Search token"
                    type="text"
                    style={{
                      paddingLeft: '25px'
                    }}
                    onChange={(e) => setSearchData(e.target.value)}
                  />
                </div>
                <div className="max-h-48 rounded-lg overflow-auto">
                  {tokenDetails
                    .filter((token) =>
                      token.symbol.includes(searchData.toUpperCase())
                    ).length === 0 && <div className="py-5 px-4">
                        No tokens found
                      </div>}
                  {tokenDetails
                    .filter((token) =>
                      token.symbol.includes(searchData.toUpperCase())
                    )
                    .map((item) => (
                      <div
                        key={item.symbol}
                        onClick={(event) => {
                          event.stopPropagation();
                          setToggleTokensDropdown(false);
                          setCurrentToken(item);
                        }}
                        className="border-b-[1px] last:border-b-0 border-outline flex cursor-pointer overflow-hidden py-4 px-5 justify-start items-center hover:bg-background-light"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="w-4 h-4 mr-3  text-content-primary"
                          src={item.image}
                          alt={item.symbol}
                        />
                        <div>
                          <div className="text-content-primary ">
                            {item.symbol}
                          </div>
                          <div className="text-caption text-content-tertiary">
                            {item.name}
                          </div>
                        </div>

                        <div className="ml-auto text-caption  text-content-secondary">
                          {getBalance(walletTokens, item.symbol)} {item.symbol}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CollapseDropdown>
          </div>

          <input
            className="w-full h-[56px] pl-[120px] is-amount"
            placeholder={t("treasuryOverview:enter-amount")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0"
          />
          <Button
            size="small"
            title={t("treasuryOverview:max")}
            className="h-10 absolute right-2.5 top-2 text-content-primary"
            onClick={handleMaxClick}
          />
        </div>
      </InputField>

      <Button
        className="w-full"
        variant="gradient"
        type="button"
        title={t("treasuryOverview:deposit")}
      />
    </>
  );
};
