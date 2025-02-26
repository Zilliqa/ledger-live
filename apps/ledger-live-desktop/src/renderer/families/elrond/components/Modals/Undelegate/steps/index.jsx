// @flow

import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import GenericStepConnectDevice from "~/renderer/modals/Send/steps/GenericStepConnectDevice";

import StepAmount, { StepAmountFooter } from "./Amount";
import StepConfirmation, { StepConfirmationFooter } from "./Confirmation";

import type { StepProps, St } from "../types";

const useSteps = (): St[] => {
  const { t } = useTranslation();

  return useMemo<St[]>(
    () => [
      {
        id: "amount",
        label: t("elrond.undelegation.flow.steps.amount.title"),
        component: StepAmount,
        noScroll: true,
        footer: StepAmountFooter,
      },
      {
        id: "device",
        label: t("elrond.undelegation.flow.steps.device.title"),
        component: GenericStepConnectDevice,
        onBack: ({ transitionTo }: StepProps) => transitionTo("amount"),
      },
      {
        id: "confirmation",
        label: t("elrond.undelegation.flow.steps.confirmation.title"),
        component: StepConfirmation,
        footer: StepConfirmationFooter,
      },
    ],
    [t],
  );
};

export { useSteps };
