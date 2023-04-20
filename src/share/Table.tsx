import * as React from 'react';

interface ITable {
    num: number;
    selNum: number;
    setTime: string;
    alertView: boolean;
    soldOut: boolean;
    selected: (v: boolean, num: number) => void;
}
interface State {
    sel: boolean;
    soldOut: boolean;
    timeRemaining: string;
}

export default class Table extends React.Component<ITable, State> {
    constructor(props: ITable) {
        super(props);
        this.state = {
            sel: false,
            soldOut: false,
            timeRemaining: '',
        }
    }
    setTime: string = '';
    componentDidUpdate(prevProps: Readonly<ITable>, prevState: Readonly<State>, snapshot?: any): void {
        // if (JSON.stringify(prevProps) === JSON.stringify(this.props)) return;

        if (!this.props.alertView && this.state.sel) this.setState({ sel: false });

        if (this.state.timeRemaining === '00:00:00') {
            clearInterval(this.timer);
            this.setState({ soldOut: false, timeRemaining: '' });
            return;
        }

        if (this.props.num === this.props.selNum) {
            if (this.props.soldOut && !this.state.soldOut) this.setState({ soldOut: true });
            if (this.props.setTime !== '' && this.state.soldOut) {
                this.setTime = this.props.setTime;
                this.timer = setInterval(this.showRemaining, 1000);
            };
        }
    }
    componentWillUnmount(): void {
        clearInterval(this.timer);
    }
    showRemaining = () => {
        const _second = 1000;
        const _minute = _second * 60;
        const _hour = _minute * 60;
        const _day = _hour * 24;

        const endTime: any = new Date(this.setTime);
        const nowTime: any = new Date();
        const distance = endTime - nowTime;

        // const days = (`00${Math.floor(distance / _day)}`).slice(-2);
        const hours = (`00${Math.floor((distance % _day) / _hour)}`).slice(-2);
        const minutes = (`00${Math.floor((distance % _hour) / _minute)}`).slice(-2);
        const seconds = (`00${Math.floor((distance % _minute) / _second)}`).slice(-2);

        this.setState({ timeRemaining: `${hours}:${minutes}:${seconds}` })
    }
    timer: NodeJS.Timeout | undefined;

    render() {
        const { num } = this.props;
        return (
            <div
                className={`table table${num} ${this.state.sel ? 'sel' : ''} ${this.state.soldOut ? 'sold_out' : ''}`}
                onClick={() => {
                    if (this.state.soldOut) return;
                    this.setState({ sel: !this.state.sel }, () => {
                        // 콜백 함수 = setState 가 비동기 이므로 값 변경 이후 실행
                        this.props.selected(this.state.sel, num);
                    });
                }}>
                <span className="table_num">{num}</span>
                {this.state.timeRemaining !== '' ? <p className="table_time">{this.state.timeRemaining}</p> : undefined}
            </div>
        );
    }
}
