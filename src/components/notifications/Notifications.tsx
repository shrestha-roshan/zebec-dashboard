import { useTranslation } from "next-i18next"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Breadcrumb, Button, InputField } from "components/shared"
import * as Icons from "assets/icons"
import { notificationSchema } from "utils/validations/notificationSchema"

interface Notification {
  email: string
  telegram: string
}

export default function NotificationsComponent() {
  const { t } = useTranslation("common")
  const [userNotification, setUserNotification] = useState<Notification>()

  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(notificationSchema)
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    setUserNotification(data)
  }
  return (
    <>
      <div className="container w-full ">
        <Breadcrumb
          title={`${t("notifications.notification")}`}
          className="mt-20"
        />

        <div className="rounded bg-background-secondary p-10 mt-12 max-w-96">
          <div className="text-subtitle font-semibold">{`${t(
            "notifications.notified-on"
          )} `}</div>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div className="w-96">
              <div className="pt-6 ">
                <InputField
                  label={t("notifications.email-address")}
                  className="relative text-content-secondary"
                  error={!!errors.email}
                  helper={t(errors.email?.message?.toString() || "").toString()}
                >
                  <div>
                    <input
                      className={`w-full h-10 ${
                        !!errors.email?.message && "error"
                      }`}
                      placeholder={t("notifications.email-address")}
                      type="text"
                      {...register("email")}
                    />
                  </div>
                </InputField>
              </div>

              <div className="pt-6 pb-6 ">
                <InputField
                  label={t("notifications.telegram-username")}
                  className="relative text-content-secondary"
                  error={!!errors.telegram}
                  helper={t(
                    errors.telegram?.message?.toString() || ""
                  ).toString()}
                >
                  <div>
                    <input
                      className={`w-full h-10 ${
                        !!errors.telegram?.message && "error"
                      }`}
                      placeholder={t("notifications.telegram-username")}
                      type="text"
                      {...register("telegram")}
                    />
                  </div>
                </InputField>
              </div>

              {/* submit Button */}

              <div className="pb-20">
                <Button
                  className={`w-full ${userNotification ? "hidden" : ""}`}
                  variant="gradient"
                  type="submit"
                  title={`${t("notifications.subscribe")}`}
                />

                {userNotification && (
                  <>
                    <div className="text-content-secondary pb-4">
                      {t("notifications.unsubscribe-description")}
                    </div>
                    <Button
                      className={`w-full`}
                      variant="danger"
                      endIcon={<Icons.Envelope />}
                      type="button"
                      title={`${t("notifications.unsubscribe")}`}
                    />
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
