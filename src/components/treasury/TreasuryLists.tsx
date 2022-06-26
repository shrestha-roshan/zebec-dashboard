import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";
import * as AvatarImages from "../../assets/images/avatars";
import * as Icons from "../../assets/icons";
import { toSubstring } from "../../utils";

//fakeData
import { treasuries } from "../../fakedata";

const TreasuryLists: FC = () => {
  const Avatars: StaticImageData[] = [
    AvatarImages.Avatar2,
    AvatarImages.Avatar3,
    AvatarImages.Avatar4,
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        {treasuries.map((treasury, index) => {
          return (
            <div
              key={treasury._id.$oid}
              className="p-6 bg-background-secondary rounded"
            >
              <Image
                src={Avatars[index % 3]}
                alt="Treasuries Avatar"
                layout="fixed"
                width={48}
                height={48}
                alt={`Avatar ${index + 1}`}
              />
              <div className="flex flex-col gap-y-4 mt-6">
                <div className="text-subtitle text-content-primary font-semibold">
                  {treasury.safe_name}
                </div>
                <div className="flex gap-x-3 items-center">
                  <div className="flex gap-x-1.5 items-center text-content-primary">
                    <Icons.UserGroupIcon className="text-base" />
                    <div>{treasury.owners.length} Owners</div>
                  </div>
                  <div className="flex gap-x-1.5 items-center text-content-primary">
                    <Icons.NotebookIcon className="text-base" />
                    <div>{toSubstring(treasury.multisig_vault, 6, true)}</div>
                    <div className="w-7 h-7 grid place-content-center border border-outline rounded-full cursor-pointer">
                      <Icons.CopyIcon onClick={()=>{
                        navigator.clipboard.writeText(treasury.vault_address);
                      }} className="text-base" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TreasuryLists;
