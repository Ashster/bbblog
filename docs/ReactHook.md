# React Hooks

## 1. 基础状态管理 Hooks

| 对比项 | useState | useReducer |
|--------|----------|------------|
| 用途 | 管理单个简单状态（如布尔值、数字） | 管理复杂状态逻辑或多个关联状态 |
| 语法 | `const [state, setState] = useState(initialValue)` | `const [state, dispatch] = useReducer(reducer, initialState)` |
| 适用场景 | 状态更新逻辑简单 | 状态更新逻辑复杂（如依赖前一个状态、多个子状态联动） |
| 性能 | 轻量级，直接更新 | 适合复杂状态，可能更高效（通过 dispatch 合并更新） |
| 示例 | 计数器、开关状态 | 表单多字段管理、状态机实现 |

```javascript
// useState 示例
const [count, setCount] = useState(0);

// useReducer 示例
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    default: return state;
  }
};
const [state, dispatch] = useReducer(reducer, { count: 0 });
```

## 2. 副作用管理 Hooks

| 对比项 | useEffect | useLayoutEffect |
|--------|-----------|-----------------|
| 触发时机 | 在浏览器渲染完成后异步执行 | 在浏览器渲染前同步执行（类似 componentDidMount/DidUpdate） |
| 用途 | 数据获取、订阅、手动 DOM 操作 | 需要同步更新 DOM 或测量布局的场景 |
| 性能影响 | 对渲染性能影响较小 | 可能阻塞渲染，需谨慎使用 |
| 示例 | API 请求、事件监听 | 调整元素尺寸、动画同步 |

```javascript
// useEffect 示例
useEffect(() => {
  fetchData().then(data => setData(data));
}, [dependency]);

// useLayoutEffect 示例
useLayoutEffect(() => {
  const { width } = element.getBoundingClientRect();
  setWidth(width);
}, []);
```

## 3. 性能优化 Hooks

| 对比项 | useMemo | useCallback |
|--------|---------|-------------|
| 用途 | 缓存计算结果 | 缓存函数引用 |
| 返回值 | 缓存的值 | 缓存的函数 |
| 适用场景 | 避免重复计算高开销操作（如过滤列表） | 避免子组件因父组件重渲染导致不必要的渲染（如传递回调函数） |
| 依赖项 | 依赖变化时重新计算值 | 依赖变化时重新创建函数 |

```javascript
// useMemo 示例
const filteredList = useMemo(() => (
  list.filter(item => item.value > threshold)
), [list, threshold]);

// useCallback 示例
const handleClick = useCallback(() => {
  console.log('Clicked:', id);
}, [id]);
```

## 4. 跨组件通信 Hooks

| 对比项 | useContext | Props Drilling |
|--------|------------|----------------|
| 用途 | 跨层级组件共享数据 | 通过逐层传递 props 共享数据 |
| 复杂度 | 减少中间组件传递 props 的代码 | 中间组件需显式传递 props |
| 适用场景 | 全局主题、用户身份、多语言 | 简单父子组件通信 |
| 性能注意 | Provider 值变化会导致所有消费者重渲染 | 无额外性能问题，但代码冗余 |

```javascript
// useContext 示例
const ThemeContext = createContext('light');
const theme = useContext(ThemeContext);
```

## 5. DOM 和 Ref 操作 Hooks

| 对比项 | useRef | useState |
|--------|--------|----------|
| 用途 | 保存可变值（不触发重渲染） | 管理状态（触发重渲染） |
| 返回值 | `{ current: value }` | `[state, setState]` |
| 适用场景 | 访问 DOM 节点、保存上一次状态 | 需要触发 UI 更新的状态 |
| 示例 | 输入框焦点控制、动画库集成 | 表单输入、动态内容 |

```javascript
// useRef 示例
const inputRef = useRef(null);
inputRef.current.focus();

// 保存上一次状态
const prevCount = useRef();
useEffect(() => {
  prevCount.current = count;
}, [count]);
```

## 6. 自定义 Hooks

| 对比项 | 自定义 Hook | HOC / Render Props |
|--------|------------|---------------------|
| 代码复用方式 | 直接调用 Hook，逻辑内聚 | 包裹组件或通过 props 传递逻辑 |
| 嵌套层级 | 无额外嵌套 | 可能产生多层嵌套（如多个 HOC） |
| 灵活性 | 可组合多个 Hooks | 逻辑复用受组件结构限制 |
| 示例 | `useFetch`、`useLocalStorage` | `withRouter`、`<DataProvider render={...}>` |

```javascript
// 自定义 Hook 示例：useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData);
  }, [url]);
  return data;
}
```

## 总结对比表

| Hook | 核心用途 | 依赖项 | 触发渲染 | 典型场景 |
|------|----------|---------|----------|----------|
| useState | 管理简单状态 | 无 | 是 | 计数器、开关 |
| useReducer | 管理复杂状态逻辑 | 无 | 是 | 表单验证、状态机 |
| useEffect | 处理副作用 | 依赖数组 | 否 | API 请求、订阅 |
| useMemo | 缓存计算结果 | 依赖数组 | 否 | 过滤/排序列表 |
| useCallback | 缓存函数引用 | 依赖数组 | 否 | 避免子组件无效重渲染 |
| useRef | 保存可变值或 DOM 引用 | 无 | 否 | 输入框焦点、动画库集成 |
| useContext | 跨组件共享数据 | 无 | 是 | 主题、全局配置 |
| useLayoutEffect | 同步 DOM 更新 | 依赖数组 | 否 | 测量布局、同步渲染 |

## 使用规则与最佳实践

1. 只在顶层调用 Hooks：不能在循环、条件或嵌套函数中使用。

2. 仅在函数组件或自定义 Hooks 中使用。

3. 按需优化：避免过度使用 useMemo/useCallback，仅在必要时优化性能。

4. 合理拆分逻辑：通过自定义 Hooks 将复杂逻辑模块化。

通过理解这些 Hooks 的区别和适用场景，可以更高效地编写可维护且性能优化的 React 应用。

# React 性能优化

## 1. 减少不必要的渲染
### 1.1 使用 React.memo 和 useMemo

- 适用于纯函数组件
- 通过比较 props 来决定是否重新渲染组件
React.memo 是一个高阶组件，用于优化组件渲染性能。它通过比较 props 来决定是否重新渲染组件。

```javascript
const MyComponent = React.memo(({ prop1, prop2 }) => {
  return <div>{prop1} {prop2}</div>;
});
```

### 1.2 使用 useMemo 和 useCallback

- 避免直接传递内连对象/函数
- 使用 useMemo 缓存计算结果
- 使用 useCallback 缓存函数引用

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => {
  doSomething(a);
}, [a]);
```
