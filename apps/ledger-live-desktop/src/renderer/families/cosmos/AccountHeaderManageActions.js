// @flow
import { getMainAccount } from "@ledgerhq/live-common/account/index";
import { canDelegate } from "@ledgerhq/live-common/families/cosmos/logic";
import type { Account, AccountLike } from "@ledgerhq/types-live";
import invariant from "invariant";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";
import IconCoins from "~/renderer/icons/Coins";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderActions = ({ account, parentAccount }: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mainAccount = getMainAccount(account, parentAccount);

  const { cosmosResources } = mainAccount;
  invariant(cosmosResources, "cosmos account expected");
  const earnRewardEnabled = canDelegate(mainAccount);

  const hasDelegations = cosmosResources.delegations.length > 0;

  const onClick = useCallback(() => {
    if (!earnRewardEnabled) {
      dispatch(
        openModal("MODAL_NO_FUNDS_STAKE", {
          account,
          parentAccount,
        }),
      );
    } else if (hasDelegations) {
      dispatch(
        openModal("MODAL_COSMOS_DELEGATE", {
          account,
        }),
      );
    } else {
      dispatch(
        openModal("MODAL_COSMOS_REWARDS_INFO", {
          account,
        }),
      );
    }
  }, [account, earnRewardEnabled, hasDelegations, dispatch, parentAccount]);

  if (parentAccount) return null;

  const disabledLabel = earnRewardEnabled ? "" : t("cosmos.delegation.minSafeWarning");

  return [
    {
      key: "Stake",
      onClick: onClick,
      icon: IconCoins,
      label: t("account.stake"),
      tooltip: disabledLabel,
    },
  ];
};

export default AccountHeaderActions;
