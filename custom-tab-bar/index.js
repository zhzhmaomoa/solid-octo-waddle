Component({
  data: {
    selected: 0,
    hidden: false,
    list: [
      {
        pagePath: "pages/index/index",
        text: "memory"
      },
      {
        pagePath: "pages/map/map",
        text: "map"
      },
      {
        pagePath: "pages/calculator/calculator",
        text: "calculator"
      }
    ]
  },
  methods: {
    switchTab(e) {
      const path = e.currentTarget.dataset.path;
      if (!path) {
        return;
      }

      const url = `/${path}`;
      wx.switchTab({ url });
    },
    setSelectedByPath(route) {
      const selected = this.data.list.findIndex((item) => item.pagePath === route);
      this.setData({
        selected: selected === -1 ? 0 : selected
      });
    }
  },
  lifetimes: {
    attached() {
      const pages = getCurrentPages();
      if (!pages.length) {
        return;
      }

      const currentRoute = pages[pages.length - 1].route;
      this.setSelectedByPath(currentRoute);
    }
  }
});
