import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../../components/Button';
import Modal from '../../../components/NewModal/index';
import ModalActions from '../../../components/ModalActions';
import ButtonTransperant from '../../../components/Button/TransperantButton';
import TokenInput from '../../../components/TokenInput';
import { getBalance, getFullDisplayBalance } from '../../../utils/formatBalance';
import { BigNumber } from 'ethers';
import styled from 'styled-components';
import useBasisCash from '../../../hooks/useBasisCash';
import useStabilityFee from '../../../hooks/useStabilityFee';
import useBondStats from '../../../hooks/useBondStats';
import useCashTargetPrice from '../../../hooks/useCashTargetPrice';

interface ExchangeModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  onCancel?: Function;
  title: string;
  description: string;
  action: string;
  tokenName: string;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({ max, onConfirm, action, tokenName, onCancel }) => {
  const [val, setVal] = useState(0);
  const [openModal, toggleModalState] = useState(true);
  const [arthBAmount, setArthBAmount] = useState<BigNumber>(BigNumber.from(0));
  const basisCash = useBasisCash();
  const bondStat = useBondStats();
  const targetPrice = useCashTargetPrice();
  const fullBalance = useMemo(() => getFullDisplayBalance(max), [max]);
  const decimals = BigNumber.from(10).pow(18);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => setVal(Math.floor(Number(e.currentTarget.value))),
    [setVal],
  );

  const handleSelectMax = useCallback(() => {
    setVal(Number(fullBalance));
  }, [fullBalance, setVal]);

  useEffect(() => {
    const job = async () => {
      const arthAmount = await basisCash.estimateAmountOutFromUniswap(Number(val), [
        basisCash.DAI,
        basisCash.ARTH,
      ]);

      // const mul = Math.floor(1 / Number(bondStat?.priceInDAI || 1) - 1);
      // const artbAmount = arthAmount.mul(mul);
      setArthBAmount(arthAmount);
    };

    job();
  }, [basisCash, bondStat, val]);

  const rorAmount = useMemo(() => {
    const input = Number(val);
    const output = Number(getFullDisplayBalance(arthBAmount.mul(targetPrice).div(decimals)));
    if (input === 0 || output === 0) return 0;
    return (output - input).toFixed(2);
  }, [arthBAmount, targetPrice, decimals, val]);

  const rorPercentage = useMemo(() => {
    const input = Number(val);
    const output = Number(getFullDisplayBalance(arthBAmount.mul(targetPrice).div(decimals)));
    if (input === 0 || output === 0) return 0;
    return ((100 * (output - input)) / input).toFixed(2);
  }, [arthBAmount, targetPrice, decimals, val]);

  const mahaStabilityFee = BigNumber.from(1); // useStabilityFee();

  const mahaStabilityFeeAmount = useMemo(
    () => arthBAmount.mul(BigNumber.from(mahaStabilityFee)).div(100),
    [arthBAmount, mahaStabilityFee],
  );

  const finalRorAmount = useMemo(() => {
    const input = Number(val);
    const output = Number(getFullDisplayBalance(arthBAmount.mul(targetPrice).div(decimals)));
    if (input === 0 || output === 0) return 0;
    const amountAfterFees = (output * (100 - mahaStabilityFee.toNumber())) / 100;
    return (amountAfterFees - input).toFixed(2);
  }, [arthBAmount, targetPrice, mahaStabilityFee, decimals, val]);

  const finalRorPercentage = useMemo(() => {
    const input = Number(val);
    const output = Number(getFullDisplayBalance(arthBAmount.mul(targetPrice).div(decimals)));
    if (input === 0 || output === 0) return 0;
    const amountAfterFees = (output * (100 - mahaStabilityFee.toNumber())) / 100;
    return ((100 * (amountAfterFees - input)) / input).toFixed(2);
  }, [arthBAmount, targetPrice, mahaStabilityFee, decimals, val]);
  const handleClose = () => {
    onCancel();
  };
  return (
    <Modal open={openModal} title="Earn ARTH Bonds" handleClose={handleClose}>
      <TokenInput
        value={String(val)}
        onSelectMax={handleSelectMax}
        type="number"
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <StyledLabel>
        You are purchasing {getFullDisplayBalance(arthBAmount)} ARTHB which can be redeemed for
        approximately {getFullDisplayBalance(arthBAmount.mul(targetPrice).div(decimals))} DAI
        <RorSpan>
          {' '}
          ({rorPercentage}% or ${rorAmount} ROR){' '}
        </RorSpan>
        when ARTH is back to its target price.
      </StyledLabel>
      <StyledLabel>
        Please note that when you are redeeming your ARTH Bonds, there is 1% stability fee
        approximately {getFullDisplayBalance(mahaStabilityFeeAmount)} MAHA.
        {/* or 10$. */}
      </StyledLabel>

      <StyledLabel>
        <RorSpan>
          ROR after stability fees is {finalRorPercentage}% or ${finalRorAmount}
        </RorSpan>{' '}
        realisable when ARTH is trading above its target price.
      </StyledLabel>
      <ActionButton>
        <ResponsiveButtonWidth>
          <ButtonTransperant
            text="Cancel"
            variant="secondary"
            onClick={() => handleClose()}
          />
        </ResponsiveButtonWidth>
        <ResponsiveButtonWidth>
          <Button
            disabled={arthBAmount.lte(0)}
            text={action}
            onClick={() => onConfirm(String(val))}
          />
        </ResponsiveButtonWidth>
      </ActionButton>
    </Modal>
  );
};

const StyledLabel = styled.div`
  color: rgba(255, 255, 255, 0.64);
  font-size: 16px;
  padding: 15px 15px 0;
  text-align: center;
`;

const RorSpan = styled.span`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.88);
`;
const ActionButton = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.color.grey[100]}00;
  display: flex;
  height: 96px;
  justify-content: space-between;
  margin: ${(props) => props.theme.spacing[4]}px ${(props) => -props.theme.spacing[4]}px
    ${(props) => -props.theme.spacing[4]}px;
  padding: 0 ${(props) => props.theme.spacing[4]}px;
  @media (max-width: 768px) {
    flex-direction: column;
  } ;
`;
const ResponsiveButtonWidth = styled.div`
  width: 250px;
  @media (max-width: 768px) {
    width: 100%;
  } ;
`;
export default ExchangeModal;
