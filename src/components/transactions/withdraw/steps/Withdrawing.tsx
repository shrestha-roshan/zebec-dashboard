import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { withdrawProps } from "../data";
import Loading from "assets/images/transactions/loading_animation.png";
import { useTranslation } from "next-i18next";
import * as Icons from "assets/icons";





const Withdrawing: FC<withdrawProps> = ({ setCurrentStep }) => {
    const { t } = useTranslation("transactions");
    useEffect(() => {
        setTimeout(() => {
            setCurrentStep(-1);
        }, 1000);
    }, [])
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div><img {...Loading} /></div> 
            <div className="text-content-secondary text-heading-5 pt-4">{t("withdraw.withdrawing")}</div>
            <div className="text-primary-contrast text-heading-5 ">101010 SOL</div>
            <div className="flex justify-center pt-4">
                <div>
                    <Icons.Asterik />

                </div>
                <div className="text-warning text-caption pl-2 ">
                    {t("withdraw.dont-close-window")}
                </div>
            </div>



        </div>
    );
}
export default Withdrawing; 
