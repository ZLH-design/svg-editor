# Lab1 Phase 1 — SVG 编辑器（CLI）

TypeScript + Node 实现的命令行 SVG 编辑器：图形以 `id` 定位，容器与叶子统一操作（Composite），
每个编辑动作都是一个可撤销的命令对象（Command）。

```bash
npm install
npm run build
npm run cli          # 进入 REPL，提示符 svg>
npm test             # transcript 回归测试（12 组断言）
```

最小会话：

```text
svg> init 400 200
canvas 400x200 created
svg> create g flow
g#flow created
svg> create rect start 30 70 120 60 #4a90d9 in flow
rect#start created in g#flow
svg> create line edge 150 100 250 100 black in flow
line#edge created in g#flow
svg> create rect end 250 70 120 60 #f5a623 in flow
rect#end created in g#flow
svg> tree
svg (400x200)
└── g#flow
    ├── rect#start  x=30 y=70 w=120 h=60 fill=#4a90d9
    ├── line#edge   (150,100) -> (250,100)
    └── rect#end    x=250 y=70 w=120 h=60 fill=#f5a623
svg> save demo.svg
saved to demo.svg (4 elements)
```

`save` 产出的就是标准 SVG，可直接用浏览器打开预览。

架构方案、过程记录与一致性自查见 [`doc/README.md`](doc/README.md)。

## 目录

| 目录 | 职责 |
|---|---|
| `src/model/` | Composite 图形模型、id 索引、类型工厂 |
| `src/commands/` | 可撤销的编辑命令与 undo/redo 栈 |
| `src/io/` | SVG 读写、XML 解析、文件系统端口 |
| `src/cli/` | REPL、命令分派、tree/show 渲染 |
| `src/test/` | 回归测试 |
