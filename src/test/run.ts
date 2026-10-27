import { Session } from '../cli/Session';
import { InMemoryFileSystem } from './InMemoryFileSystem';

const OTHER_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <text id="t1" x="10" y="290">imported</text>
  <circle id="c1" cx="50" cy="50" r="10"/>
  <g id="g1">
    <rect id="r2" x="0" y="0" width="10" height="10"/>
    <circle id="c2" cx="5" cy="5" r="2"/>
  </g>
  <ellipse id="e1" cx="1" cy="2" rx="3" ry="4"/>
</svg>
`;

let failures = 0;
let checks = 0;

function run(session: Session, lines: string[]): string[] {
  const out: string[] = [];
  for (const line of lines) {
    out.push(...session.run(line).lines);
  }
  return out;
}

function expect(name: string, actual: string[], expected: string[]): void {
  checks += 1;
  const a = actual.join('\n');
  const e = expected.join('\n');
  if (a === e) {
    console.log(`  ok   ${name}`);
    return;
  }
  failures += 1;
  console.log(`  FAIL ${name}`);
  const actualLines = actual as string[];
  const max = Math.max(actualLines.length, expected.length);
  for (let i = 0; i < max; i += 1) {
    if (actualLines[i] !== expected[i]) {
      console.log(`    line ${i + 1}\n      expected: ${JSON.stringify(expected[i])}\n      actual:   ${JSON.stringify(actualLines[i])}`);
    }
  }
}

function assert(name: string, condition: boolean, detail = ''): void {
  checks += 1;
  if (condition) {
    console.log(`  ok   ${name}`);
  } else {
    failures += 1;
    console.log(`  FAIL ${name} ${detail}`);
  }
}

// ── 6. 典型会话（完整 transcript） ───────────────────────────────────────
console.log('spec 6: 典型会话 transcript');
{
  const files = new InMemoryFileSystem();
  files.seed('other.svg', OTHER_SVG);
  const session = new Session(files);
  const out = run(session, [
    'init 800 600',
    'create rect bg 0 0 800 600 #ffffff',
    'create text title 20 40 "My Diagram"',
    'create circle c1 100 100 20 red',
    'create rect box 200 80 60 60 #3366ff',
    'group markers c1 box',
    'tree',
    'move c1 30 0',
    'undo',
    'redo',
    'set title text "My Diagram v2"',
    'undo',
    'group bad c1 markers',
    'delete box',
    'undo',
    'save demo.svg',
    'undo',
    'read other.svg',
    'tree',
  ]);

  expect('transcript', out, [
    'canvas 800x600 created',
    'rect#bg created',
    'text#title created',
    'circle#c1 created',
    'rect#box created',
    'g#markers created with 2 children',
    'svg (800x600)',
    '├── rect#bg     x=0 y=0 w=800 h=600 fill=#ffffff',
    '├── text#title  (20,40) "My Diagram"',
    '└── g#markers',
    '    ├── circle#c1  cx=100 cy=100 r=20 fill=red',
    '    └── rect#box   x=200 y=80 w=60 h=60 fill=#3366ff',
    'circle#c1 moved to (130,100)',
    'circle#c1 moved back to (100,100)',
    'circle#c1 moved to (130,100)',
    'text#title updated: text="My Diagram v2"',
    'text#title updated: text="My Diagram"',
    'error: cannot group a container into its own descendant: markers',
    'rect#box deleted',
    'rect#box restored into g#markers',
    'saved to demo.svg (5 elements)',
    'error: undo not allowed after io command',
    'warning: assigned id rect1 to unnamed <rect>',
    'read other.svg (7 elements)',
    'svg (400x300)',
    '├── rect#rect1  x=0 y=0 w=400 h=300 fill=#ffffff',
    '├── text#t1     (10,290) "imported"',
    '├── circle#c1   cx=50 cy=50 r=10',
    '├── g#g1',
    '│   ├── rect#r2    x=0 y=0 w=10 h=10',
    '│   └── circle#c2  cx=5 cy=5 r=2',
    '└── ellipse#e1  cx=1 cy=2 rx=3 ry=4',
  ]);
}

// ── 6.1 两节点流程图（in 子句自顶向下构建） ─────────────────────────────
console.log('spec 6.1: 两节点流程图');
{
  const session = new Session(new InMemoryFileSystem());
  const out = run(session, [
    'init 800 600',
    'create g flowchart',
    'create g node1 in flowchart',
    'create rect start 120 100 160 60 #4a90d9 in node1',
    'create text start-label 155 135 "开始" in node1',
    'create g node2 in flowchart',
    'create rect process 520 100 160 60 #f5a623 in node2',
    'create text process-label 545 135 "处理数据" in node2',
    'create line arrow1 280 130 520 130 black in flowchart',
    'tree',
    'move node2 0 100',
    'undo',
    'set process-label text "处理数据 v2"',
    'save flowchart.svg',
  ]);

  expect('flowchart transcript', out, [
    'canvas 800x600 created',
    'g#flowchart created',
    'g#node1 created in g#flowchart',
    'rect#start created in g#node1',
    'text#start-label created in g#node1',
    'g#node2 created in g#flowchart',
    'rect#process created in g#node2',
    'text#process-label created in g#node2',
    'line#arrow1 created in g#flowchart',
    'svg (800x600)',
    '└── g#flowchart',
    '    ├── g#node1',
    '    │   ├── rect#start          x=120 y=100 w=160 h=60 fill=#4a90d9',
    '    │   └── text#start-label    (155,135) "开始"',
    '    ├── g#node2',
    '    │   ├── rect#process        x=520 y=100 w=160 h=60 fill=#f5a623',
    '    │   └── text#process-label  (545,135) "处理数据"',
    '    └── line#arrow1  (280,130) -> (520,130)',
    'g#node2 moved by (0,100)',
    'g#node2 moved back by (0,-100)',
    'text#process-label updated: text="处理数据 v2"',
    'saved to flowchart.svg (8 elements)',
  ]);
}

// ── 4.2 错误信息 ────────────────────────────────────────────────────────
console.log('spec 4.2: 错误信息约定');
{
  const session = new Session(new InMemoryFileSystem());
  const out = run(session, [
    'create rect r1 0 0 10 10', // 无文档
    'init 400 200',
    'create rect r1 0 0 10 10',
    'create rect r1 0 0 10 10',
    'show r9',
    'create rect r2 0 0 10 10 in node9',
    'create rect r3 0 0 10 10 in r1',
    'create hexagon h1 0 0 10',
    'scale r1 0',
    'set r1 colour red',
    'read missing.svg',
    'delete r1',
    'undo',
    'create g scene',
    'ungroup scene',
    'create g inner in scene',
    'create rect r4 0 0 1 1 in inner',
    'group outer scene inner',
  ]);

  expect('error messages', out, [
    "error: no document. use 'init' or 'read' first",
    'canvas 400x200 created',
    'rect#r1 created',
    'error: id already exists: r1',
    'error: no such shape: r9',
    'error: no such container: node9',
    'error: not a container: r1',
    'error: unknown shape type: hexagon (is the plugin loaded?)',
    'error: scale factor must be positive',
    'error: unknown attribute: colour',
    'error: cannot read file: missing.svg',
    'rect#r1 deleted',
    'rect#r1 restored into svg',
    'g#scene created',
    'error: cannot ungroup top-level container: scene',
    'g#inner created in g#scene',
    'rect#r4 created in g#inner',
    'error: cannot group a container into its own descendant: scene',
  ]);
}

// ── 5.2 show ────────────────────────────────────────────────────────────
console.log('spec 5.2: show');
{
  const session = new Session(new InMemoryFileSystem());
  const out = run(session, [
    'init 800 600',
    'create circle c1 100 100 20 red',
    'create g markers',
    'addto markers c1',
    'show c1',
    'show markers',
  ]);
  expect('show', out, [
    'canvas 800x600 created',
    'circle#c1 created',
    'g#markers created',
    'circle#c1 added to g#markers',
    'circle#c1  parent=g#markers',
    '  cx=100 cy=100 r=20',
    '  fill=red',
    'g#markers  parent=svg',
  ]);
}

// ── Composite：容器统一操作 ──────────────────────────────────────────────
console.log('composite: 容器 move / scale / delete');
{
  const session = new Session(new InMemoryFileSystem());
  const out = run(session, [
    'init 800 600',
    'create g node',
    'create rect face 10 20 100 50 #eee in node',
    'create circle dot 30 40 5 in node',
    'scale node 2',
    'tree node',
    'delete node',
    'tree',
    'undo',
    'tree',
  ]);
  expect('composite ops', out, [
    'canvas 800x600 created',
    'g#node created',
    'rect#face created in g#node',
    'circle#dot created in g#node',
    'g#node scaled by 2',
    'g#node',
    '├── rect#face   x=20 y=40 w=200 h=100 fill=#eee',
    '└── circle#dot  cx=60 cy=80 r=10',
    'g#node deleted',
    'svg (800x600)',
    'g#node restored into svg',
    'svg (800x600)',
    '└── g#node',
    '    ├── rect#face   x=20 y=40 w=200 h=100 fill=#eee',
    '    └── circle#dot  cx=60 cy=80 r=10',
  ]);
}

// ── 序列化 round-trip ───────────────────────────────────────────────────
console.log('io: save → read round-trip');
{
  const files = new InMemoryFileSystem();
  const session = new Session(files);
  run(session, [
    'init 320 240',
    'create rect bg 0 0 320 240 #ffffff',
    'create text title 20 40 "Hello & <World>"',
    'create g cluster',
    'create circle dot 30 40 5 red in cluster',
    'save a.svg',
  ]);
  const written = files.read('a.svg') ?? '';
  const expectedSvg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240">',
    '  <rect id="bg" x="0" y="0" width="320" height="240" fill="#ffffff"/>',
    '  <text id="title" x="20" y="40">Hello &amp; &lt;World&gt;</text>',
    '  <g id="cluster">',
    '    <circle id="dot" cx="30" cy="40" r="5" fill="red"/>',
    '  </g>',
    '</svg>',
    '',
  ].join('\n');
  expect('serialized svg', [written], [expectedSvg]);

  const session2 = new Session(files);
  const out = run(session2, ['read a.svg', 'tree', 'save b.svg']);
  expect('round-trip tree', out, [
    'read a.svg (4 elements)',
    'svg (320x240)',
    '├── rect#bg     x=0 y=0 w=320 h=240 fill=#ffffff',
    '├── text#title  (20,40) "Hello & <World>"',
    '└── g#cluster',
    '    └── circle#dot  cx=30 cy=40 r=5 fill=red',
    'saved to b.svg (4 elements)',
  ]);
  assert('round-trip 文件一致', files.read('b.svg') === written);
}

// ── z-order / ungroup / redo 栈清空 ─────────────────────────────────────
console.log('misc: z-order / ungroup / redo 栈');
{
  const session = new Session(new InMemoryFileSystem());
  const out = run(session, [
    'init 100 100',
    'create rect a 0 0 1 1',
    'create rect b 0 0 1 1',
    'create rect c 0 0 1 1',
    'back c',
    'tree',
    'undo',
    'tree',
    'front a',
    'tree',
    'undo',
    'move a 1 1',
    'undo',
    'redo',
    'redo',
    'create g outer',
    'create g inner in outer',
    'create rect x 0 0 1 1 in inner',
    'ungroup inner',
    'tree',
  ]);
  expect('z-order / ungroup', out, [
    'canvas 100x100 created',
    'rect#a created',
    'rect#b created',
    'rect#c created',
    'rect#c moved to back',
    'svg (100x100)',
    '├── rect#c  x=0 y=0 w=1 h=1',
    '├── rect#a  x=0 y=0 w=1 h=1',
    '└── rect#b  x=0 y=0 w=1 h=1',
    'rect#c restored to position 3',
    'svg (100x100)',
    '├── rect#a  x=0 y=0 w=1 h=1',
    '├── rect#b  x=0 y=0 w=1 h=1',
    '└── rect#c  x=0 y=0 w=1 h=1',
    'rect#a moved to front',
    'svg (100x100)',
    '├── rect#b  x=0 y=0 w=1 h=1',
    '├── rect#c  x=0 y=0 w=1 h=1',
    '└── rect#a  x=0 y=0 w=1 h=1',
    'rect#a restored to position 1',
    'rect#a moved to (1,1)',
    'rect#a moved back to (0,0)',
    'rect#a moved to (1,1)',
    'error: nothing to redo',
    'g#outer created',
    'g#inner created in g#outer',
    'rect#x created in g#inner',
    'g#inner ungrouped, 1 children lifted to g#outer',
    'svg (100x100)',
    '├── rect#a   x=1 y=1 w=1 h=1',
    '├── rect#b   x=0 y=0 w=1 h=1',
    '├── rect#c   x=0 y=0 w=1 h=1',
    '└── g#outer',
    '    └── rect#x  x=0 y=0 w=1 h=1',
  ]);
}

// ── 约定自检：失败不改状态 / id 大小写敏感 / io 锁 ───────────────────────
console.log('spec 2: 通用约定');
{
  const files = new InMemoryFileSystem();
  files.seed('empty.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>');
  const session = new Session(files);
  const out = run(session, [
    'init 100 100',
    'create rect r1 1 2 3 4',
    'set r1 bogus 9',
    'scale r1 0',
    'group gx r1 nope',
    'create hexagon h1',
    'read nope.svg',
    'delete nope',
    'tree',
    'create rect R1 0 0 1 1',
    'save',
    'undo',
  ]);
  expect('失败命令不改变状态 + 大小写敏感', out, [
    'canvas 100x100 created',
    'rect#r1 created',
    'error: unknown attribute: bogus',
    'error: scale factor must be positive',
    'error: no such shape: nope',
    'error: unknown shape type: hexagon (is the plugin loaded?)',
    'error: cannot read file: nope.svg',
    'error: no such shape: nope',
    'svg (100x100)',
    '└── rect#r1  x=1 y=2 w=3 h=4',
    'rect#R1 created',
    'error: no file name given. usage: save <file.svg>',
    'rect#R1 removed',
  ]);

  const afterFailedRead = run(session, ['read nope.svg', 'tree']);
  expect('read 失败后原文档保持', afterFailedRead, [
    'error: cannot read file: nope.svg',
    'svg (100x100)',
    '└── rect#r1  x=1 y=2 w=3 h=4',
  ]);

  const box = run(session, ['create box n1 1 2 3 4 "标题"']);
  expect('box 本阶段未实现', box, [
    'error: unknown shape type: box (is the plugin loaded?)',
  ]);
}

console.log('');
console.log(`${checks - failures}/${checks} checks passed`);
if (failures > 0) {
  console.log(`${failures} FAILED`);
  process.exit(1);
}
