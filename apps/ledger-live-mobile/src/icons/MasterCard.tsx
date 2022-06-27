import React, { memo } from "react";
import Svg, { Path } from "react-native-svg";

type Props = {
  height: number;
  width: number;
};

const MasterCard: React.FC<Props> = ({ height = 12, width = 20 }) => (
  <Svg viewBox="0 0 20 12" width={width} height={height}>
    <Path d="M12.5255 1.2832H7.19751V10.7168H12.5255V1.2832Z" fill="#FF5F00" />
    <Path
      d="M7.53575 5.99999C7.53586 5.09249 7.74436 4.19678 8.14561 3.37993C8.54687 2.56308 9.13049 1.84627 9.85277 1.28319C8.95451 0.587334 7.87567 0.154559 6.73958 0.034319C5.60349 -0.085921 4.45598 0.111223 3.42823 0.603236C2.40049 1.09525 1.53397 1.86227 0.927735 2.81662C0.321497 3.77096 0 4.87412 0 5.99999C0 7.12587 0.321497 8.22903 0.927735 9.18337C1.53397 10.1377 2.40049 10.9047 3.42823 11.3968C4.45598 11.8888 5.60349 12.0859 6.73958 11.9657C7.87567 11.8454 8.95451 11.4127 9.85277 10.7168C9.12919 10.1549 8.54464 9.43831 8.14325 8.62119C7.74186 7.80408 7.53413 6.90779 7.53575 5.99999Z"
      fill="#EB001B"
    />
    <Path
      d="M19.7144 5.99999C19.7155 7.12534 19.395 8.22825 18.7897 9.18254C18.1844 10.1368 17.3186 10.9039 16.2915 11.3961C15.2644 11.8882 14.1175 12.0855 12.9819 11.9654C11.8463 11.8452 10.768 11.4125 9.87036 10.7168C10.5928 10.1538 11.1765 9.43703 11.5778 8.62016C11.9791 7.80329 12.1875 6.90752 12.1875 5.99999C12.1875 5.09245 11.9791 4.19669 11.5778 3.37982C11.1765 2.56295 10.5928 1.84616 9.87036 1.28318C10.768 0.587436 11.8463 0.154742 12.9819 0.0346161C14.1175 -0.0855094 15.2644 0.111787 16.2915 0.603922C17.3186 1.09606 18.1844 1.86316 18.7897 2.81744C19.395 3.77172 19.7155 4.87464 19.7144 5.99999Z"
      fill="#F79E1B"
    />
  </Svg>
);

export default memo(MasterCard);