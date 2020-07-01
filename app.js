

class Menu extends React.Component {
    render() {
        const { onClick, current } = this.props;
        const links = [
            { title: 'All', query: '' },
            { title: 'JavaScript', query: 'javascript' },
            { title: 'Ruby', query: 'ruby' },
            { title: 'Java', query: 'java' },
            { title: 'CSS', query: 'css' },
            { title: 'Python', query: 'python' },
        ];
        const list = links.map((item, key) =>
            <div className="head" key={key}><a href={`/?q=${item.query}`}  style={current == item.query ? { 'color': 'red' } : { color: 'black' }}>{item.title}</a></div>
        );
        return <ul id="headbar">
            {list}
        </ul>
    }
}
class Header extends React.Component {
    render() {
        const { onClick, current } = this.props;
        return <div>
            <Menu onClick={onClick} current={current} />
        </div>;
    }
}

class Loading extends React.Component {
    render() {
        return <div className="load">
            loading...
        </div>;
    }
}

class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            items:[],
        };
    }
    componentDidMount() {
        this.search();    
    };

    search = async () => {
        function GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = r[2];
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
        console.log(GetQueryString("q"));
        const q = GetQueryString("q");
        const url = `https://api.github.com/search/repositories?q=stars:>1+language:${q}&sort=stars&order=desc&type=Repositories`;
        console.log('url', url);
        this.setState({ loading: true })
        try {
            const res = await axios.get(url)
            console.log('res', res.data)
            this.setState({
                items: res.data.items
            })
        } catch (e) {
            console.log('error', e)
        }
        this.setState({ loading: false });
    }

    render() {
        const { items, loading } = this.state;
        const cards = this.state.items.slice(0, 10).map((item, key) => {
            return <div className="card" ><div className='it' key={item.id}>
                <div className="num">#{key + 1}</div>
                <div className="img"><img src={item.owner.avatar_url}  style={{ width: '150px', height: '150px', }} /></div>
                <div className="name"><a href={item.html_url}>{item.name}</a></div>
                <div className="desc">
                    <div>
                        <i className="fa fa-user" id="u"></i>
                        <a href={item.owner.html_url}>{item.name}</a>
                    </div>
                    <div>
                        <i className="fa fa-star" id="s"></i>
                        <span>{item.stargazers_count}  stars</span>
                    </div>
                    <div>
                        <i className="fa fa-code-fork" id="c" ></i>
                        <span>{item.forks_count} forks</span>
                    </div>
                    <div>
                        <i className="fa fa-exclamation-triangle" id="t" ></i>
                        <span>{item.open_issues_count}  open_issues</span>
                    </div>
                </div>
            </div></div>
        })
        return <div className="content">
            {loading ? <Loading /> : cards}
        </div>;
    }
}
class App extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div>
            <Header onClick={this.onClick}></Header>
            <Content></Content>
        </div>;
    }
}
ReactDOM.render(
    <App />,
    document.getElementById('app')
);