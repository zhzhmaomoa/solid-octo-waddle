Page({
  data: {
    // 当前步骤：0=基础信息，1=每日收益，2=每周收益
    step: 0,
    // 最终计算结果（预计晶钻总数）
    diamondFuture: 0,
    // 表单核心数据，统一由页面状态驱动，避免依赖 form submit
    formData: {
      // 当前持有晶钻
      diamondCurrent: 0,
      // 计算周期（单位：周）
      duration: 1,
      // 每日惊喜订单收益
      order: 15,
      // 每日钻分享物收益
      diamondShared: 0,
      // 每日钻饭收益
      diamondFood: 0,
      // 每日勾选项
      daily: false,
      ruby: false,
      duer: false,
      // 每周勾选项
      gachaMachine: false,
      party: false,
      loginEveryWeek: false,
      family: false,
      continuousLoginWeekend: false
    }
  },

  onLoad() {
    // 获取飘钻组件实例，用于计算后触发动画
    this.rain = this.selectComponent("#rain");
  },
  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      const tabBar = this.getTabBar();
      tabBar.setSelectedByPath(this.route);
      const { windowWidth, windowHeight } = wx.getWindowInfo();
      tabBar.setHidden(windowWidth > windowHeight);
    }
  },
  onResize(res) {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setHidden(res.size.windowWidth > res.size.windowHeight);
    }
  },

  // 返回上一步
  prevStep() {
    if (this.data.step === 0) {
      return;
    }
    this.setData({
      step: this.data.step - 1
    });
  },

  // 进入下一步
  nextStep() {
    if (this.data.step === 2) {
      return;
    }
    this.setData({
      step: this.data.step + 1
    });
  },

  // 文本输入框统一处理：根据 data-field 更新 formData
  onNumberInput(e) {
    const { field } = e.currentTarget.dataset;
    const raw = e.detail.value;
    const value = raw === "" ? 0 : Number(raw);
    this.setData({
      [`formData.${field}`]: Number.isNaN(value) ? 0 : value
    });
  },

  // 快捷按钮赋值（如 1周/2周/4周）
  setQuickValue(e) {
    const { field, value } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: Number(value)
    });
  },

  // 步进器加减：受 min/max 限制
  changeNumber(e) {
    const { field, delta, min, max } = e.currentTarget.dataset;
    const curr = Number(this.data.formData[field]) || 0;
    let next = curr + Number(delta);
    next = Math.max(Number(min), Math.min(Number(max), next));
    this.setData({
      [`formData.${field}`]: next
    });
  },

  // 选项卡片切换：直接切换 formData 对应布尔值
  toggleOption(e) {
    const { key } = e.currentTarget.dataset;
    const selected = !!this.data.formData[key];
    this.setData({
      [`formData.${key}`]: !selected
    });
  },

  // 执行计算：
  // 1) 基础值 = 当前晶钻
  // 2) 每日数值输入项总和 * 周数 * 7
  // 3) 每日勾选项收益累计 * 周数 * 7
  // 4) 每周勾选项收益累计 * 周数
  // 5) 若包含杜尔，额外加一次周结算奖励
  compute() {
    const { formData } = this.data;
    const weeks = Number(formData.duration) || 0;
    let diamondFuture = Number(formData.diamondCurrent) || 0;
    // 每次计算时重新生成杜尔单次收益（15~30）
    const duerDiamond = Math.floor(Math.random() * 16) + 15;
    // 每次计算时重新生成杜尔周结算奖励（28 或 38）
    const duerWeekSettlement = Math.random() < 0.5 ? 28 : 38;

    const diamondMap = {
      order: { period: "daily", type: "input" },
      diamondShared: { period: "daily", type: "input" },
      diamondFood: { period: "daily", type: "input" },
      daily: { period: "daily", type: "toggle", value: 50 },
      ruby: { period: "daily", type: "toggle", value: 90 },
      duer: { period: "daily", type: "toggle", value: duerDiamond },
      gachaMachine: { period: "weekly", type: "toggle", value: 100 },
      party: { period: "weekly", type: "toggle", value: 50 },
      loginEveryWeek: { period: "weekly", type: "toggle", value: 20 },
      family: { period: "weekly", type: "toggle", value: 50 },
      continuousLoginWeekend: { period: "weekly", type: "toggle", value: 120 }
    };

    Object.entries(formData).forEach(([key, rawValue]) => {
      const item = diamondMap[key];
      if (!item) {
        return;
      }

      // 输入项直接取数值；勾选项仅在为 true 时计入映射值
      const base = item.type === "input"
        ? (Number(rawValue) || 0)
        : (rawValue ? item.value : 0);
      const multiplier = item.period === "daily" ? weeks * 7 : weeks;
      diamondFuture += base * multiplier;
    });

    // 勾选杜尔时，加一次周结算奖励
    if (formData.duer) {
      diamondFuture += duerWeekSettlement;
    }

    this.setData({
      diamondFuture
    });

    // 触发飘钻动画
    if (this.rain && this.rain.render) {
      this.rain.render();
    }
  }
});
