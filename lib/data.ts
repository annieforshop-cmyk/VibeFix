export type Category =
  | "自由职业"
  | "小生意"
  | "效率工具"
  | "创作者"
  | "学习成长"
  | "本地生活"
  | "社交连接"
  | "个人财务"
  | "宠物生活"
  | "健身健康";

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
  自由职业: "bg-violet-100 text-violet-700",
  小生意: "bg-amber-100 text-amber-700",
  效率工具: "bg-blue-100 text-blue-700",
  创作者: "bg-pink-100 text-pink-700",
  学习成长: "bg-emerald-100 text-emerald-700",
  本地生活: "bg-orange-100 text-orange-700",
  社交连接: "bg-cyan-100 text-cyan-700",
  个人财务: "bg-lime-100 text-lime-700",
  宠物生活: "bg-rose-100 text-rose-700",
  健身健康: "bg-teal-100 text-teal-700",
};

export const CATEGORY_DOTS: Record<Category, string> = {
  自由职业: "bg-violet-400",
  小生意: "bg-amber-400",
  效率工具: "bg-blue-400",
  创作者: "bg-pink-400",
  学习成长: "bg-emerald-400",
  本地生活: "bg-orange-400",
  社交连接: "bg-cyan-400",
  个人财务: "bg-lime-400",
  宠物生活: "bg-rose-400",
  健身健康: "bg-teal-400",
};

export const ALL_CATEGORIES: Category[] = [
  "自由职业",
  "小生意",
  "效率工具",
  "创作者",
  "学习成长",
  "本地生活",
  "社交连接",
  "个人财务",
  "宠物生活",
  "健身健康",
];

export const PROBLEMS: Problem[] = [
  {
    id: "cn-001",
    title: "自由职业者催款很尴尬，缺少自动化工具",
    description:
      "独立设计师、开发者做完项目催客户付款时场面尴尬，反复提醒容易伤感情。目前只能靠手动发微信，没有一个能自动发送礼貌催款提醒、追踪付款状态的轻量工具。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "自由职业",
    subcategory: "收款催款",
    status: "无人在做",
    aiPotential: "高",
    upvotes: 312,
    views: 2840,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-002",
    title: "独立健身教练用微信群管理预约，每天对账很崩溃",
    description:
      "私教老师或小型瑜伽工作室靠微信群收学员预约，经常出现超员、爽约、漏收款的情况。没有适合个人教练用的轻量预约+收款+提醒一体的工具，太重的SaaS又根本负担不起。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "小生意",
    subcategory: "预约管理",
    status: "部分解决",
    aiPotential: "高",
    upvotes: 287,
    views: 2210,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-003",
    title: "副业创业者不知道自己每个项目实际赚了多少",
    description:
      "同时做2-3个副业项目的人，时间分散在不同事情上，但不知道每个项目实际花了多少小时、折算时薪后是否值得继续。现有时间追踪工具太复杂，没有专为副业场景设计的轻量版本。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "效率工具",
    subcategory: "副业管理",
    status: "无人在做",
    aiPotential: "高",
    upvotes: 198,
    views: 1650,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-004",
    title: "多平台创作者回复评论要在5个App来回切换",
    description:
      "同时在小红书、B站、微博、抖音发内容的创作者，回复粉丝评论需要频繁切换App，经常漏回复，延迟回复影响平台算法推流。没有一个简单的多平台评论聚合管理工具。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "创作者",
    subcategory: "多平台管理",
    status: "无人在做",
    aiPotential: "高",
    upvotes: 445,
    views: 4120,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-005",
    title: "买了网课却坚持不下去，自学缺乏外部问责",
    description:
      "买了网课或报了训练营，一个人学习没有截止日期很容易拖延。现有打卡软件只是形式上的，没有真正带来压力和动力。缺少一个能找到学习搭子、互相监督进度的轻量工具。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "学习成长",
    subcategory: "自学问责",
    status: "部分解决",
    aiPotential: "高",
    upvotes: 389,
    views: 3560,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-006",
    title: "小餐馆改菜单要同时登三个外卖平台后台",
    description:
      "在美团、饿了么、抖音团购同时开店的小餐馆老板，每次调价、新增菜品或下架都要重复登录三个平台手动操作，费时费力还容易出错。没有一键同步多平台菜单的工具。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "小生意",
    subcategory: "多平台运营",
    status: "无人在做",
    aiPotential: "高",
    upvotes: 256,
    views: 2100,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-007",
    title: "朋友多人旅行结束后费用分摊总是算不清",
    description:
      "五六个人一起旅行，吃饭住宿谁先付、谁欠谁多少靠截图和记忆。回来后用微信一笔笔转账，记录混在聊天记录里，总有人对不上或忘记付。现有AA工具太繁琐，没人坚持用。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "个人财务",
    subcategory: "费用分摊",
    status: "部分解决",
    aiPotential: "中",
    upvotes: 334,
    views: 2980,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-008",
    title: "短途旅行找不到可信的宠物临时寄养",
    description:
      "出门三五天不方便带猫狗，只能求朋友帮忙，但朋友不一定有时间。专业寄养机构价格贵，网上陌生寄养者评价体系不可信，没办法验证对方真的会照顾动物。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "宠物生活",
    subcategory: "临时寄养",
    status: "无人在做",
    aiPotential: "中",
    upvotes: 421,
    views: 3870,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-009",
    title: "想找同城的人一起去健身，但没有低门槛的渠道",
    description:
      "一个人去健身房容易摆烂，想找同城健身搭子一起去更有动力，但微信群太乱、陌生人社交App太重。需要一个只专注于「约人一起去健身」的轻量匹配工具。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "健身健康",
    subcategory: "运动搭子",
    status: "无人在做",
    aiPotential: "中",
    upvotes: 502,
    views: 4680,
    submittedBy: "创始人精选",
  },
  {
    id: "cn-010",
    title: "远程工作者想偶尔找人一起去咖啡馆办公",
    description:
      "在家远程工作时间长了会感到孤独和低效，想偶尔找个同城的人一起去咖啡馆或共享空间工作。但现有社交工具要么太重要么不安全，没有专为「今天想找人搭伙办公」设计的轻量场景。",
    country: "中国",
    countryFlag: "🇨🇳",
    region: "中国",
    category: "社交连接",
    subcategory: "远程办公搭子",
    status: "无人在做",
    aiPotential: "中",
    upvotes: 178,
    views: 1420,
    submittedBy: "创始人精选",
  },
];
