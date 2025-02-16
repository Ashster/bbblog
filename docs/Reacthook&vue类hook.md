# 什么是 hook

hook 是 React 16.8 引入的新特性，用于在函数组件中使用状态和其他 React 特性。
一般采用 useXXX 来命名，

# why hook

在组件中，我们经常会遇到一些相同的逻辑，如果在各处都重写一遍，代码会变得臃肿且冗余。
在 hook 出现之前，我们通常会采用高阶组件（HOC）或者 render props 来解决这个问题。

## 高阶组件

高阶组件（HOC）是一种组件，它接受一个组件作为参数，返回一个新的增强组件，比如给所有的组件包裹一层 loading 状态。
优点：

- 可以复用组件逻辑
- 可以增强组件功能
- 原组件并不需要关注这些公共状态
缺点：
- 组件层级嵌套过深
- 组件难以维护
- props 可能会被覆盖
- 命名冲突问题
- 如果一个组件需要被多个高阶组件包裹，那么这个组件可能会变得非常复杂

```jsx
function withLoading(Component) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
      };
    }

    async componentDidMount() {
      const res = await fetchData();
      this.setState({ loading: false });
    }

    render() {
      if (this.state.loading) {
        return <div>Loading...</div>;
      }

      return <Component {...this.props} />;
    }
  };
}
```

## 使用 render props

将 render 函数作为 props 之间传入组件中，在组件内部调用 render 函数来动态渲染组件，而不是直接渲染组件。在调用 render 函数的时候，会把这个组件的 props 和 state 作为参数传入，以实现数据共享。
优点：
- 逻辑复用
- 职责清晰
- 数据流向清晰
缺点：
- 可能会产生嵌套地狱，比如一个组件需要被多个 render props 包裹，那么这个组件可能会变得非常复杂
- 使用不当可能会影响性能
- 代码可读性下降

```jsx
// DataFetcher 组件：负责数据获取逻辑
class DataFetcher extends React.Component {
  state = {
    loading: true,
    data: null,
    error: null
  };

  async componentDidMount() {
    try {
      const data = await fetch(this.props.url)
        .then(res => res.json());
      
      this.setState({
        loading: false,
        data
      });
    } catch (error) {
      this.setState({
        loading: false,
        error: error.message
      });
    }
  }

  render() {
    // 将状态传递给 render prop
    return this.props.render({
      loading: this.state.loading,
      data: this.state.data,
      error: this.state.error
    });
  }
}

// 使用 DataFetcher 的不同方式
// 1. 显示用户列表
function UserList() {
  return (
    <DataFetcher
      url="/api/users"
      render={({ loading, data, error }) => {
        if (loading) return <div>加载中...</div>;
        if (error) return <div>错误：{error}</div>;
        
        return (
          <ul>
            {data.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        );
      }}
    />
  );
}
```

## 使用 hook

hook 是 React 16.8 引入的新特性，用于在函数组件中使用状态和其他 React 特性。
优点：
- 逻辑复用
- 职责清晰
- 数据流向清晰
缺点：
- 需要自己去处理什么时候要更新，需要自己去保证性能，否则每一个 hook 的 state 更新都造成组件重新渲染

## 使用 vue 的类 hook

vue 的类 hook 是 vue 2.6 引入的新特性，用于在组件中使用状态和其他 vue 特性。
优点：
- 逻辑复用
- 职责清晰
- 数据流向清晰
- 利用 vue 本身的响应式特性，可以自动更新组件，不会跟 React 一样需要自己去处理什么时候要更新，需要自己去保证性能，否则每一个 hook 的 state 更新都造成组件重新渲染