import * as React from 'react';

interface IAlert {
    selNum: number;
    buyConfirm: (buy: boolean, setTime: string) => void;
}

interface ITimeList {
    time: number
}

interface State {
    viewMdoe: 'buy' | 'hours' | 'result';
    timeList: ITimeList[];
    buyTime: number;
    closeTime: number;
}

export default class Alert extends React.Component<IAlert, State> {
    constructor(props: IAlert) {
        super(props);
        this.state = {
            viewMdoe: 'buy',
            timeList: [],
            buyTime: 0,
            closeTime: 5
        }
    }
    hourList = [0, 1, 2, 3, 4, 5, 12, 24]
    getDate: string = '';
    setDate: string = '';
    componentDidMount(): void {
        const tArr: ITimeList[] = [];
        this.hourList.map((hour) => {
            tArr.push({ time: hour });
        });
        this.setState({ timeList: tArr });
    }
    selHour = (sel: number) => {
        this.setState({ buyTime: this.hourList[sel] });
    }
    buyHours = () => {
        this.setState({ viewMdoe: 'hours' });
    }
    buyComplete = () => {
        this.setState({ viewMdoe: 'result' });
        let date = new Date();

        let month = (`00${date.getMonth() + 1}`).slice(-2);
        let day = (`00${date.getDate()}`).slice(-2);
        let hours = (`00${date.getHours()}`).slice(-2);
        let minutes = (`00${date.getMinutes()}`).slice(-2);
        let seconds = (`00${date.getSeconds()}`).slice(-2);
        this.getDate = `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}:${seconds}`;

        const setHours = this.state.buyTime === 0 ? 12000 : 1 * 60 * 60 * (1000 * this.state.buyTime);
        date.setTime(date.getTime() + setHours);

        month = (`00${date.getMonth() + 1}`).slice(-2);
        day = (`00${date.getDate()}`).slice(-2);
        hours = (`00${date.getHours()}`).slice(-2);
        minutes = (`00${date.getMinutes()}`).slice(-2);
        seconds = (`00${date.getSeconds()}`).slice(-2);
        this.setDate = `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}:${seconds}`;
        this.timer = setInterval(this.alertClose, 1000);
    }
    alertClose = () => {
        if (this.state.closeTime <= 0) {
            clearInterval(this.timer);
            this.props.buyConfirm(true, this.setDate);
            return;
        }
        this.setState({ closeTime: this.state.closeTime - 1 })
    }
    timer: NodeJS.Timeout | undefined;
    render() {
        return (
            <div className={`alert`}>
                <div className="center">

                    {this.state.viewMdoe === 'buy' ?
                        <div className={'sel_buy'}>
                            <p className="txt_confirm">선택한 자리를 구매하시겠습니까?</p>
                            <span className="sel_num">{this.props.selNum}</span>
                            <div>
                                <button onClick={() => { this.buyHours() }}>구매</button>
                                <button onClick={() => { this.props.buyConfirm(false, '') }}>취소</button>
                            </div>
                        </div> : undefined
                    }
                    {/* 구매 시간 선택 */}
                    {this.state.viewMdoe === 'hours' ?
                        <div className={'sel_hours'}>
                            <p className="txt_confirm">사용할 시간을 선택해주세요.</p>
                            <ul>
                                {this.state.timeList.map((list, idx) => {
                                    return <li
                                        key={`hour${idx}`}
                                        onClick={() => { this.selHour(idx) }}
                                        className={`${this.state.buyTime === list.time ? 'sel' : ''}`}
                                    >
                                        {idx === 0 ? '12초' : `${list.time}시간`}
                                    </li>
                                })}
                            </ul>
                            <button onClick={() => { this.buyComplete() }}>확인</button>
                        </div>
                        : undefined
                    }
                    {/* 구매 결과 팝업 */}
                    {this.state.viewMdoe === 'result' ?
                        <div className={'result_buy'}>
                            <p className="txt_result">해당 자리의 구매가 확정되었습니다.<span>{this.state.closeTime}초 뒤 창이 닫힙니다.</span></p>
                            <dl>
                                <dt className="sel_title">구매한 자리 : </dt>
                                <dd className="sel_num">{this.props.selNum}</dd>
                            </dl>
                            <dl>
                                <dt className="sel_title">구매한 시간 : </dt>
                                <dd className="sel_num">{this.state.buyTime === 0 ? '12초' : `${this.state.buyTime}시간`}</dd>
                            </dl>
                            <dl>
                                <dt className="sel_title">시작한 시간 : </dt>
                                <dd className="sel_num">{this.getDate}</dd>
                            </dl>
                            <dl>
                                <dt className="sel_title">끝나는 시간 : </dt>
                                <dd className="sel_num">{this.setDate}</dd>
                            </dl>
                            <button className="btn_confirm" onClick={() => { this.props.buyConfirm(true, this.setDate) }}>확인</button>
                        </div> : undefined
                    }
                </div>
            </div>
        );
    }
}
