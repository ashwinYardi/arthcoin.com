import React from 'react';
import styled from 'styled-components';
import Card from '../../../components/InfoCard';
import { withStyles, Theme } from '@material-ui/core/styles';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import InfoIcon from '../../../assets/img/InfoWarning.svg';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '../../../components/Button';
import useAdvanceEpoch from '../../../hooks/useAdvanceEpoch';
import { useWallet } from 'use-wallet';
const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#2A2827',
    color: 'white',
    fontWeight: 300,
    fontSize: '13px',
    borderRadius: '6px',
    padding: '20px',
  },
}))(Tooltip);
interface ProgressCountdownProps {
  base: Date;
  deadline: Date;
  description: string;
  toolTipTitle?: string;
  toolTipLink?: string;
}

const ProgressCountdown: React.FC<ProgressCountdownProps> = ({
  base,
  deadline,
  description,
  toolTipLink,
  toolTipTitle,
}) => {
  const advanceEpoch = useAdvanceEpoch();
  const { account, connect } = useWallet();

  const percentage =
    Date.now() >= deadline.getTime()
      ? 100
      : ((Date.now() - base.getTime()) / (deadline.getTime() - base.getTime())) * 100;

  const countdownRenderer = (countdownProps: CountdownRenderProps) => {
    const { days, hours, minutes, seconds } = countdownProps;
    const h = String(days * 24 + hours);
    const m = String(minutes);
    const s = String(seconds);
    return (
      <StyledCountdown>
        {h.padStart(2, '0')}:{m.padStart(2, '0')}:{s.padStart(2, '0')}
      </StyledCountdown>
    );
  };

  return (
    <Card>
      <StyledCardContentInner>
        <StyledDesc>
          <StyledLink href={toolTipLink} target="_blank">
            {description}
          </StyledLink>
          <HtmlTooltip enterTouchDelay={0} title={<span>{toolTipTitle}</span>}>
            <img src={InfoIcon} alt="Inof" width="16px" className="margin-left-5" />
          </HtmlTooltip>
        </StyledDesc>
        <Countdown
          autoStart={true}
          key={deadline.toDateString()}
          date={deadline}
          renderer={countdownRenderer}
        />
        <StyledProgressOuter>
          <StyledProgress progress={percentage} />
        </StyledProgressOuter>

        {!account ? (
          <Button onClick={() => connect('injected')} size="sm" text="Connect Wallet" />
        ) : (
          <Button onClick={advanceEpoch} disabled={percentage < 100}>
            Advance Epoch
          </Button>
        )}
      </StyledCardContentInner>
    </Card>
  );
};

const StyledCountdown = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.color.grey[100]};
  margin: 0 0 6px 0;
`;
const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const StyledProgressOuter = styled.div`
  width: 100%;
  height: 5px;
  border-radius: 15px;
  margin-bottom: 5px;
  background: ${(props) => props.theme.color.grey[700]};
`;

const StyledProgress = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  border-radius: 15px;
  background: #f7653b;
`;

const StyledDesc = styled.span`
  color: ${(props) => props.theme.color.grey[500]};
  font-weight: 400;
  font-size: 12px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCardContentInner = styled.div`
  height: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding: ${(props) => props.theme.spacing[2]}px ${(props) => props.theme.spacing[4]}px;
`;

export default ProgressCountdown;
