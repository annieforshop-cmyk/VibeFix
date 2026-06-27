export type Category =
  | "医疗健康"
  | "教育"
  | "环境"
  | "工作就业"
  | "老龄化"
  | "金融普惠"
  | "食品安全"
  | "心理健康"
  | "社会公平"
  | "城市生活";

export type Status = "无人在做" | "有人在做" | "部分解决";
export type AIPotential = "高" | "中" | "低";

export interface Problem {
  id: string;
  title: string;
  description: string;
  country: string;
  countryFlag: string;
  region: "中国" | "亚洲" | "全球" | "非洲" | "欧洲" | "美洲";
  category: Category;
  subcategory: string;
  status: Status;
  aiPotential: AIPotential;
  upvotes: number;
  views: number;
  submittedBy: "创始人精选" | "社区提交";
  source?: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  医疗健康: "bg-rose-100 text-rose-700",
  教育: "bg-blue-100 text-blue-700",
  环境: "bg-emerald-100 text-emerald-700",
  工作就业: "bg-amber-100 text-amber-700",
  老龄化: "bg-purple-100 text-purple-700",
  金融普惠: "bg-cyan-100 text-cyan-700",
  食品安全: "bg-orange-100 text-orange-700",
  心理健康: "bg-indigo-100 text-indigo-700",
  社会公平: "bg-pink-100 text-pink-700",
  城市生活: "bg-slate-100 text-slate-700",
};

export const CATEGORY_DOTS: Record<Category, string> = {
  医疗健康: "bg-rose-400",
  教育: "bg-blue-400",
  环境: "bg-emerald-400",
  工作就业: "bg-amber-400",
  老龄化: "bg-purple-400",
  金融普惠: "bg-cyan-400",
  食品安全: "bg-orange-400",
  心理健康: "bg-indigo-400",
  社会公平: "bg-pink-400",
  城市生活: "bg-slate-400",
};

export const ALL_CATEGORIES: Category[] = [
  "医疗健康",
  "教育",
  "环境",
  "工作就业",
  "老龄化",
  "金融普惠",
  "食品安全",
  "心理健康",
  "社会公平",
  "城市生活",
];

export const PROBLEMS: Problem[] = [
  {
    id: "cn-001",
    title: "农村地区心理健康服务严重匮乏",
    description:
      "中国超过5000万农村居民患有不同程度的抑郁或焦虑，但96%的乡镇卫生院没有专业心理医生，患者平均需要跨越100公里以上才能获得基础心理咨询。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "心理健康",
    subcategory: "农村心理健康",
    status: "无人在做",
    aiPotential: "高",
    upvotes: 312,
    views: 2840,
    submittedBy: "创始人精选",
    source: "国家卫生健康委员会 2023",
  },
  {
    id: "cn-002",
    title: "职业教育与市场需求长期脱节",
    description:
      "每年数百万职校毕业生找不到对口工作，而制造业和服务业企业同时喊招不到合格工人。课程体系平均滞后市场需求5-8年，技能错配造成巨大社会浪费。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "教育",
    subcategory: "职业技能教育",
    status: "有人在做",
    aiPotential: "高",
    upvotes: 287,
    views: 2210,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-003",
    title: "农村生活垃圾处理基础设施缺失",
    description:
      "超过40%的农村地区仍无规范化垃圾收集和处理设施，垃圾随意堆放引发土壤和水源污染。分散的居住格局让传统集中处理方式成本极高、难以推广。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "环境",
    subcategory: "农村环境治理",
    status: "部分解决",
    aiPotential: "中",
    upvotes: 198,
    views: 1650,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-004",
    title: "45岁以上求职者面临系统性年龄歧视",
    description:
      "大量招聘平台和企业明确设置35-45岁年龄上限，中年失业者几乎被排斥在正规就业市场之外。这一群体往往有丰富经验却无处施展，成为沉默的社会压力来源。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "工作就业",
    subcategory: "就业歧视",
    status: "无人在做",
    aiPotential: "中",
    upvotes: 445,
    views: 4120,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-005",
    title: "2600万独居老人缺乏安全监护手段",
    description:
      "中国约有2600万独居老人，突发疾病或摔倒时无法及时获得帮助，现有解决方案要么太贵要么操作复杂。低成本、易操作的日常安全监护产品几乎空白。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "老龄化",
    subcategory: "独居老人安全",
    status: "有人在做",
    aiPotential: "高",
    upvotes: 389,
    views: 3560,
    submittedBy: "创始人精选",
    source: "民政部 2024",
  },
  {
    id: "cn-006",
    title: "小微企业主无法获得低门槛正规融资",
    description:
      "数千万小微经营者因缺乏抵押物和信用记录，无法获得银行贷款，只能依赖年化利率高达20-50%的民间借贷。正规金融体系的风控模型几乎不适配小微经营场景。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "金融普惠",
    subcategory: "小微信贷",
    status: "有人在做",
    aiPotential: "高",
    upvotes: 256,
    views: 2100,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-007",
    title: "外卖食品安全无法追溯和监督",
    description:
      "消费者无法了解外卖食品的原料来源、存储条件和加工过程。食品安全事件频发但难以精确追责，现有平台评分体系无法反映真实的卫生和食材质量状况。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "食品安全",
    subcategory: "餐饮溯源",
    status: "无人在做",
    aiPotential: "高",
    upvotes: 334,
    views: 2980,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-008",
    title: "约600万留守儿童长期缺乏教育陪伴",
    description:
      "农村留守儿童长期缺乏父母陪伴，课业辅导、心理关爱和兴趣培养几乎全部缺失。现有远程教育产品设计为城市中产家庭服务，与留守儿童真实处境严重不符。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "教育",
    subcategory: "留守儿童",
    status: "部分解决",
    aiPotential: "高",
    upvotes: 421,
    views: 3870,
    submittedBy: "创始人精选",
    source: "全国妇联 2023",
  },
  {
    id: "cn-009",
    title: "职场倦怠缺乏早期识别和干预",
    description:
      "高压工作文化下，职场倦怠（Burnout）在发展为严重抑郁前几乎没有任何预警机制。HR系统只追踪考勤和绩效，对员工心理状态完全盲视，企业和个人都付出了巨大隐性代价。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "心理健康",
    subcategory: "职场心理健康",
    status: "无人在做",
    aiPotential: "高",
    upvotes: 502,
    views: 4680,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-010",
    title: "城市社区邻里互助关系几乎消失",
    description:
      "城市高密度居住环境下，同楼层邻居互不相识成为常态。社区资源（工具、空间、技能）无法共享，老人、新手父母等需要帮助的群体难以从社区获得支持。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "城市生活",
    subcategory: "社区互助",
    status: "无人在做",
    aiPotential: "中",
    upvotes: 178,
    views: 1420,
    submittedBy: "创始人精选",
  },
];
