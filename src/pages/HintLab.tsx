import { useState } from 'react';
import { FlaskConical, Calculator, Atom, BookOpen, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { commonIons, valenceRules } from '../data/ions';
import { cn } from '../lib/utils';
import type { IonData } from '../types';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  color: string;
}

function AccordionItem({ title, icon, children, defaultOpen = false, color }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card hover={false} className="mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full"
      >
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${color}dd, ${color}88)` }}
            >
              {icon}
            </div>
            <h3 className="text-lg font-bold text-white text-left">{title}</h3>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-white/50" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/50" />
          )}
        </CardHeader>
      </button>
      <div
        className={cn(
          'transition-all duration-300 overflow-hidden',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <CardContent className="pt-0">
          {children}
        </CardContent>
      </div>
    </Card>
  );
}

function IonCard({ ion }: { ion: IonData }) {
  const typeColors = {
    cation: 'from-blue-500 to-cyan-500',
    anion: 'from-red-500 to-orange-500',
    polyatomic: 'from-purple-500 to-pink-500',
  };

  const typeLabels = {
    cation: '阳离子',
    anion: '阴离子',
    polyatomic: '原子团',
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-2xl font-bold text-white font-mono">{ion.formula}</span>
          <span className={cn(
            'ml-2 px-2 py-0.5 rounded-full text-xs',
            'bg-gradient-to-r',
            typeColors[ion.type]
          )}>
            {typeLabels[ion.type]}
          </span>
        </div>
        <span className="text-lg font-bold text-cyan-400">{ion.charge}</span>
      </div>
      <p className="text-white/70 text-sm mb-2">{ion.name}</p>
      <p className="text-xs text-white/50 font-mono bg-white/5 px-2 py-1 rounded">
        {ion.example}
      </p>
    </div>
  );
}

export function HintLab() {
  const [ionFilter, setIonFilter] = useState<'all' | 'cation' | 'anion' | 'polyatomic'>('all');

  const filteredIons = ionFilter === 'all'
    ? commonIons
    : commonIons.filter(ion => ion.type === ionFilter);

  return (
    <div className="min-h-screen pt-24 pb-12 px-8 ml-64">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            <FlaskConical className="inline w-10 h-10 mr-3 text-cyan-400" />
            提示实验室
          </h1>
          <p className="text-white/60 text-lg">
            学习配平技巧，掌握化学基础知识
          </p>
        </div>

        <AccordionItem
          title="第一步：元素原子数统计"
          icon={<Atom className="w-6 h-6 text-white" />}
          color="#00d4ff"
          defaultOpen
        >
          <div className="space-y-4">
            <p className="text-white/70 leading-relaxed">
              配平方程式的第一步是准确统计方程式两边每种元素的原子数量。
              这是配平的基础，只有准确统计才能找出不平衡的元素。
            </p>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <h4 className="font-bold text-cyan-400 mb-3">
                <Sparkles className="inline w-4 h-4 mr-2" />
                统计方法
              </h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• 元素符号第一个字母大写，第二个字母小写（如 H, O, Fe, Cu）</li>
                <li>• 元素符号右下角的数字表示该元素的原子数（如 H₂O 中有 2 个 H 和 1 个 O）</li>
                <li>• 括号外的数字要乘到括号内每个元素上（如 Ca(OH)₂ 中有 1 个 Ca, 2 个 O, 2 个 H）</li>
                <li>• 化学式前的系数要乘到该化学式的所有元素上</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white/5">
              <h4 className="font-bold text-white mb-3">示例：分析 H₂ + O₂ → H₂O</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-cyan-400 font-medium mb-2">反应物（左边）</p>
                  <p className="text-white/70">H₂: 2个氢原子</p>
                  <p className="text-white/70">O₂: 2个氧原子</p>
                  <p className="text-white/70 font-medium mt-2">总计: H=2, O=2</p>
                </div>
                <div>
                  <p className="text-orange-400 font-medium mb-2">生成物（右边）</p>
                  <p className="text-white/70">H₂O: 2个氢原子, 1个氧原子</p>
                  <p className="text-white/70 font-medium mt-2">总计: H=2, O=1</p>
                </div>
              </div>
              <p className="mt-3 text-yellow-400 text-sm">
                ❌ 发现：氧原子不相等！左边2个，右边1个
              </p>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem
          title="第二步：最小公倍数法"
          icon={<Calculator className="w-6 h-6 text-white" />}
          color="#ff6b35"
        >
          <div className="space-y-4">
            <p className="text-white/70 leading-relaxed">
              最小公倍数法是最常用的配平方法。找到两边原子数的最小公倍数，
              然后确定各化学式的系数。
            </p>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <h4 className="font-bold text-orange-400 mb-3">
                <Calculator className="inline w-4 h-4 mr-2" />
                配平步骤
              </h4>
              <ol className="space-y-2 text-white/80 text-sm list-decimal list-inside">
                <li>找出方程式两边各出现一次且原子数相差较大的元素</li>
                <li>计算该元素在两边原子数的最小公倍数</li>
                <li>用最小公倍数除以各自的原子数，得到系数</li>
                <li>根据已确定的系数，调整其他元素的系数</li>
                <li>最后检查所有元素是否都配平</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-white/5">
              <h4 className="font-bold text-white mb-3">示例：配平 H₂ + O₂ → H₂O</h4>
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-white/50 mb-1">第一步：找最小公倍数</p>
                  <p className="text-white/80">
                    O元素：左边2个，右边1个 → 最小公倍数是 2
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-white/50 mb-1">第二步：确定系数</p>
                  <p className="text-white/80">
                    O₂ 系数 = 2 ÷ 2 = 1，H₂O 系数 = 2 ÷ 1 = 2
                  </p>
                  <p className="text-cyan-400 font-mono mt-1">
                    H₂ + O₂ → 2H₂O
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-white/50 mb-1">第三步：调整其他元素</p>
                  <p className="text-white/80">
                    右边现在有 2×2=4 个 H，所以 H₂ 系数是 2
                  </p>
                  <p className="text-green-400 font-mono mt-1">
                    2H₂ + O₂ → 2H₂O ✓
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem
          title="第三步：常见离子和化合价"
          icon={<BookOpen className="w-6 h-6 text-white" />}
          color="#00c853"
        >
          <div className="space-y-4">
            <p className="text-white/70 leading-relaxed">
              记住常见离子和化合价可以大大加快配平速度。
              许多化合物由离子构成，了解它们的电荷有助于理解化学式。
            </p>

            <div className="flex gap-2 mb-4 flex-wrap">
              {(['all', 'cation', 'anion', 'polyatomic'] as const).map(filter => (
                <Button
                  key={filter}
                  size="sm"
                  variant={ionFilter === filter ? 'primary' : 'secondary'}
                  onClick={() => setIonFilter(filter)}
                >
                  {filter === 'all' ? '全部' :
                   filter === 'cation' ? '阳离子' :
                   filter === 'anion' ? '阴离子' : '原子团'}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredIons.map((ion, index) => (
                <IonCard key={`${ion.formula}-${index}`} ion={ion} />
              ))}
            </div>

            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 mt-6">
              <h4 className="font-bold text-green-400 mb-3">
                <Sparkles className="inline w-4 h-4 mr-2" />
                化合价口诀
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
                {valenceRules.map((rule, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-cyan-400">
                      {rule.element}
                    </span>
                    <span>{rule.valence}价</span>
                    {rule.note && (
                      <span className="text-xs text-white/40">({rule.note})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem
          title="配平技巧总结"
          icon={<Sparkles className="w-6 h-6 text-white" />}
          color="#ffd700"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-bold text-yellow-400 mb-2">✅ 配平原则</h4>
                <ul className="space-y-1 text-sm text-white/70">
                  <li>• 只能改变化学式前的系数</li>
                  <li>• 不能改变化学式中的下标</li>
                  <li>• 系数要化为最简整数比</li>
                  <li>• 两边各元素原子数必须相等</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <h4 className="font-bold text-cyan-400 mb-2">💡 实用技巧</h4>
                <ul className="space-y-1 text-sm text-white/70">
                  <li>• 从最复杂的化学式开始配平</li>
                  <li>• 把原子团当作整体配平</li>
                  <li>• 先配两边各出现一次的元素</li>
                  <li>• 最后检查氧和氢</li>
                  <li>• 用分数法配平后再整数化</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
              <h4 className="font-bold text-yellow-400 mb-3">
                反应类型判断
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-white font-medium mb-1">化合反应</p>
                  <p className="text-white/50">A + B → AB</p>
                  <p className="text-white/40 text-xs">多变一</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">分解反应</p>
                  <p className="text-white/50">AB → A + B</p>
                  <p className="text-white/40 text-xs">一变多</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">置换反应</p>
                  <p className="text-white/50">A + BC → AC + B</p>
                  <p className="text-white/40 text-xs">单质换单质</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">复分解反应</p>
                  <p className="text-white/50">AB + CD → AD + CB</p>
                  <p className="text-white/40 text-xs">双交换</p>
                </div>
                <div>
                  <p className="text-white font-medium mb-1">氧化还原</p>
                  <p className="text-white/50">有电子转移</p>
                  <p className="text-white/40 text-xs">化合价变化</p>
                </div>
              </div>
            </div>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}
