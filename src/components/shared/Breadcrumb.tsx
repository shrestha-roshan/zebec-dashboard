import React, { FC } from "react"
import { useRouter } from "next/router"
import { twMerge } from "tailwind-merge"
import { IconButton } from "./IconButton"
import * as Icons from "assets/icons"

interface BreadcrumbRightContentProps {
  children: React.ReactNode
}

interface BreadcrumbProps {
  title: string
  className?: string
  arrowBack?: boolean
  backTo?: string
  children?: BreadcrumbRightContentProps["children"]
}

export const BreadcrumbRightContent: FC<BreadcrumbRightContentProps> = ({
  children
}) => {
  return <>{children}</>
}

export const Breadcrumb: FC<BreadcrumbProps> = (props) => {
  const { title, className, arrowBack = false, backTo, children } = props

  const router = useRouter()

  return (
    <>
      <div
        className={twMerge(
          `items-center justify-between pl-8 pr-6 mb-5`,
          className
        )}
      >
        <div className="flex items-center py-1 gap-x-4 text-content-primary">
          {arrowBack && (
            <IconButton
              variant="plain"
              icon={<Icons.LeftArrowIcon />}
              onClick={() => (backTo ? router.push(backTo) : router.back())}
            />
          )}
          <div className="text-heading-4 font-semibold">{title}</div>
        </div>
        {children && (
          <BreadcrumbRightContent>{children}</BreadcrumbRightContent>
        )}
      </div>
    </>
  )
}
