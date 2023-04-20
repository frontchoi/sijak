import React from 'react';
import Table from '../share/Table';
import Alert from '../share/Alert';
interface IReserve {
    // 
}
interface State {
    alertView: boolean;
    soldOut: boolean;
    selNum: number;
    setTime: string;
}
export default class Reserve extends React.Component<IReserve, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            alertView: false,
            soldOut: false,
            selNum: 0,
            setTime: ''
        }
    }
    alertViewFnc = (v: boolean, num: number) => {
        this.setState({ alertView: v, selNum: num, soldOut: false, setTime: '' })
    }
    alertActionFnc = (buy: boolean, setTime: string) => {
        this.setState({ alertView: false, soldOut: buy, setTime }, () => {
            // Table 컴포넌트 componentDidUpdate 때문에 초기화
            setTimeout(() => {
                this.setState({ soldOut: false, setTime: '' })
            }, 100);
        });
    }
    render() {
        let arr = [7, 17, 24, 42, 50, 58];
        const lineWrap: JSX.Element[] = [];
        const line: JSX.Element[][] = [];
        const pushLine = (startIdx: number, endIdx: number) => {
            line.push([]);
            for (let index = startIdx; index < endIdx + 1; index++) {
                line[line.length - 1].push(
                    <Table key={`line${index}`}
                        num={index}
                        selected={this.alertViewFnc}
                        selNum={this.state.selNum}
                        alertView={this.state.alertView}
                        soldOut={this.state.soldOut}
                        setTime={this.state.setTime}
                    />
                );
            }
            lineWrap.push(
                <div className={`line line0${line.length}`} key={`lineWrap${startIdx}`}>{line[line.length - 1]}</div>
            );
        }
        arr.map((a, idx) => idx === 0 ? pushLine(1, a) : pushLine(arr[idx - 1] + 1, a));
        return (
            <>
                <div className="layout">
                    {lineWrap}
                    {/* {[...Array(6)].map((_, i) => (
                        <div className={`line line0${i + 1}`}>{line[i]}</div>
                    ))} */}
                </div>
                {this.state.alertView ? <Alert selNum={this.state.selNum} buyConfirm={this.alertActionFnc} /> : undefined}
            </>
        );
    }
}